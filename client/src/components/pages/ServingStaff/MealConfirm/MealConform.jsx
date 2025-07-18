import { Button, Card, Typography, Space, Divider, notification } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './MealConform.module.css';
import DateTime from '../../../organisms/Serving/DateAndTime/DateTime';
import Loading from '../../../atoms/loading/loading'; // Renamed to Loading
import { useAuth } from "../../../../contexts/AuthContext";
import axios from 'axios';

const { Title, Text } = Typography;


const MealConform = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [mealDetails, setMealDetails] = useState(null);
  const [employeeName, setEmployeeName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { authData } = useAuth();
  const urL = import.meta.env.VITE_BASE_URL;
  const token = authData?.accessToken;

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        const orderRes = await axios.get(`${urL}/orders/${id}`);
        const orderData = orderRes.data;
        setOrderDetails(orderData);

        const [mealIdPart] = orderData.meals[0].split(':');
        const mealRes = await axios.get(`${urL}/meal/${mealIdPart}?orgId=${orderData.orgId}`);
        const mealData = mealRes.data;
        setMealDetails(mealData);

        const nameRes = await axios.get(`${urL}/user/${orderData.employeeId}/org/${orderData.orgId}/name`);
        const nameData = nameRes.data;
        setEmployeeName(nameData.name);
      } catch (error) {
        notification.error({
          message: 'Error',
          description: error.response?.data?.message || error.message,
          duration: 3,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleCancel = () => {
    notification.warning({
      message: 'Order Cancelled',
      description: `The meal order ${orderDetails?.orderNumber || id} has been cancelled.`,
      duration: 3,
    });
    navigate('/serving');
  };

  const handleConfirm = async () => {
    try {
      await axios.patch(
        `${urL}/orders/${id}`,
        { serve: true },
        { headers: { 'Content-Type': 'application/json' } }
      );

      notification.success({
        message: 'Order Confirmed',
        description: `The meal order ${orderDetails?.orderNumber || id} has been confirmed successfully.`,
        duration: 3,
      });

      setTimeout(() => {
        navigate('/serving');
      }, 1000);
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error.response?.data?.message || 'Failed to confirm order',
        duration: 3,
      });
    }
  };

  if (isLoading || !orderDetails || !mealDetails) {
    return <Loading />;
  }

  return (
    <div className={styles.Maincontainer}>
      <div className={styles.container}>
        <Card className={styles.card}>
          {/* Header */}
          <div className={styles.headerRow}>
            <Title level={2} className={styles.title}>
              {mealDetails.category?.[0] || 'Meal'} Meal
            </Title>
            <Text className={styles.dateText}>
              <DateTime color="#701c33" />
            </Text>
          </div>

          {/* Content Section */}
          <div className={styles.contentWrapper}>
            {/* Left: Meal Image */}
            <div className={styles.leftSection}>
              <img
                src={mealDetails.imageUrl}
                alt={mealDetails.nameEnglish}
                className={styles.foodImage}
              />
            </div>

            {/* Right: Details */}
            <div className={styles.rightSection}>
              <Title level={3} className={styles.userName}>
                Employee Name: {employeeName || 'Loading...'}
              </Title>

              <Space style={{ marginBottom: '8px' }}>
                <Text type="secondary">Order ID:</Text>
                <Text strong className={styles.orderId}>{orderDetails.id}</Text>
              </Space>

              <div className={styles.priceContainer}>
                <Text type="secondary">Total Price:</Text>
                <Text strong className={styles.price}>
                  Rs. {orderDetails.price.toFixed(2)}
                </Text>
              </div>

              <div className={styles.mealDetails}>
                <Text type="secondary" className={styles.mealDetailsHeader}>Meal Details</Text>
                <Title level={4} className={styles.mealName}>
                  {mealDetails.nameEnglish}
                </Title>
                <Text>{mealDetails.description}</Text>
              </div>
            </div>
          </div>

          <Divider className={styles.divider} />

          {/* Button Section */}
          <div className={styles.buttonContainer}>
            <Button
              type="primary"
              size="large"
              className={styles.confirmButton}
              onClick={handleConfirm}
            >
              Confirm
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MealConform;