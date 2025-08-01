import React from 'react';
import { Typography, Card } from 'antd';
import { MdLanguage } from "react-icons/md";

import styles from './Page1.module.css'; // Import CSS module for styling
import DateAndTime from '../DateAndTime/DateAndTime.jsx'; // Import DateAndTime component

// Page1 component for the welcome and language selection screen
const Page1 = ({ carouselRef, setLanguage, isActive = true }) => {
    // Handle language selection and carousel navigation
    const handleLanguageSelect = (language) => {
        console.log(`${language} selected`);
        setLanguage(language.toLowerCase()); // Update language state in parent component
        if (carouselRef && carouselRef.current) {
            carouselRef.current.next(); // Move to the next slide in the carousel
        }
    };

    // Determine greeting based on the time of day
    const getGreeting = () => {
        const currentHour = new Date().getHours();
        if (currentHour < 12) {
            return "Good Morning සුභ උදෑසනක් වේවා காலை வணக்கம்"; // Morning greeting in multiple languages
        } else if (currentHour < 17) {
            return "Good Afternoon සුභ දහවලක් වේවා மதிய வணக்கம்"; // Afternoon greeting
        } else {
            return "Good Evening සුභ සන්ධ්‍යාවක් වේවා மலை வணக்கம்"; // Evening greeting
        }
    };

    // Render the welcome page
    return (
        <div className={styles.mainbox}>
            {/* <div>
                <br />
                <Typography.Title level={2} className={styles.getGreeting}>
                    {getGreeting()}
                </Typography.Title>
            </div> */}
            {/* <div>
                <Typography.Title level={1} className={styles.mainTitle1}>
                    Welcome to Helix Food Ordering
                </Typography.Title>
            </div> */}
            {/* Date and time display */}
            {/* <div>
                <DateAndTime />
            </div> */}
            <br />
            {/* Language selection card */}
                            <MdLanguage color='#ababab' size={125}/>

            <div>
                <Card className={styles.cardStyle}>
                    <div className={styles.cardPartl}>
                        <Typography.Title level={2} className={styles.getGreeting}>
                            Select Your Language | භාෂාව තෝරන්න <br/> மொழியை தேர்ந்தெடுக்கவும்
                        </Typography.Title>
                        <br /><br />
                        {/* Language selection buttons */}
                        <div className={styles.languageButtonContainer}>
                            <button
                                className={styles.languageButton}
                                onClick={() => handleLanguageSelect('English')}
                            >
                                English
                            </button>
                            <button
                                className={styles.languageButton}
                                onClick={() => handleLanguageSelect('Sinhala')}
                            >
                                සිංහල
                            </button>
                            <button
                                className={styles.languageButton}
                                onClick={() => handleLanguageSelect('Tamil')}
                            >
                                தமிழ்
                            </button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

// Export the Page1 component
export default Page1;