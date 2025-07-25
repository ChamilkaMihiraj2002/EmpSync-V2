import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Alert } from "antd";
import {
  LoadingOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import styles from "./PasswordReset.module.css";
import illustration from "../../../../assets/Login/Password-Reset.png";
import axios from "axios";

const PasswordReset = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const auth0Url = import.meta.env.VITE_AUTH0_URL;
  const auth0Id = import.meta.env.VITE_AUTH0_ID;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res=await axios.post(`https://${auth0Url}/dbconnections/change_password`, {
        client_id: auth0Id,
        email: email,
        connection: "Username-Password-Authentication",
      });
      console.log(res);
      setIsSuccess(true);
    } catch (err) {
      setError("There was an error sending the reset link. Please try again.");
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <div className={styles.loginLeft}>
          <img
            src={illustration}
            alt="Illustration"
            className={styles.loginIllustration}
          />
        </div>
        <div className={styles.loginRight}>
          <div className={styles.container}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.title}>Forgot Password</div>
                <div className={styles.description}>
                  Enter your email address and we'll send you a link to reset
                  your password.
                </div>
              </div>
              <div className={styles.cardContent}>
                {isSuccess ? (
                  <Alert
                    message="If your Email is Registered, You Will Receive Password Reset Link To Given Address!"
                    description="Please check your email and follow the instructions to reset your password."
                    type="success"
                    showIcon
                    icon={
                      <CheckCircleOutlined className={styles.successIcon} />
                    }
                  />
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className={styles.formContent}>
                      <div className={styles.inputGroup}>
                        <label htmlFor="email">Email</label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      {error && (
                        <Alert
                          message="Error"
                          description={error}
                          type="error"
                          showIcon
                          icon={
                            <ExclamationCircleOutlined
                              className={styles.errorIcon}
                            />
                          }
                        />
                      )}
                      <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isSubmitting || !email}
                      >
                        {isSubmitting ? (
                          <>
                            <LoadingOutlined className={styles.loadingIcon} />
                            Sending Reset Link
                          </>
                        ) : (
                          <>
                            Reset Password
                            <ArrowRightOutlined className={styles.arrowIcon} />
                            {/* //password reset link sent */}
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
              <div className={styles.footer}>
                <a href="/login" className={styles.backButton}>
                  Back to Login
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
