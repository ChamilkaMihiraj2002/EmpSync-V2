import React, { useRef, useState } from 'react';
import { Carousel } from 'antd';
import styles from './OrderTab.module.css'; // Import CSS module for styling
import Page1 from "../../organisms/OrderTabUI/Page1/Page1.jsx"; // Import Page1 component
import Page2 from "../../organisms/OrderTabUI/Page2/Page2.jsx"; // Import Page2 component
import Page3 from "../../organisms/OrderTabUI/Page3/Page3.jsx"; // Import Page3 component
import { MealDataProvider } from '../../../contexts/MealDataContext.jsx'; // Import MealDataProvider

// OrderTab component to manage the carousel of ordering pages
const OrderTab = () => {
    const carouselRef = useRef(); // Reference to control the carousel
    const [language, setLanguage] = useState('english'); // State for selected language
    const [username, setUsername] = useState(""); // State to store the username
    const [userId, setUserId] = useState(""); // State to store the user ID
    const [resetPin, setResetPin] = useState(false); // Add this state
    
    // Determine initial slide based on sessionStorage flag
    function getInitialSlide() {
        if (typeof window !== 'undefined' && sessionStorage.getItem('redirectToPage3') === 'true') {
            sessionStorage.removeItem('redirectToPage3');
            return 2; // Go directly to Page3
        }
        return 1; // Default to Page2
    }
    
    const [currentSlide, setCurrentSlide] = useState(getInitialSlide()); // Track current slide for accessibility

    // Render the carousel with three pages wrapped in MealDataProvider
    return (
        <MealDataProvider>
            <Carousel
                ref={carouselRef}
                infinite={false} // Disable infinite looping
                dots={false} // Hide navigation dots
                accessibility={false} // Disable default accessibility features
                speed={0}
                swipe={false} // Disable swipe navigation
                draggable={false} // Disable drag navigation
                touchMove={false} // Disable touch move
                initialSlide={getInitialSlide()} // Start at Page2.jsx
                beforeChange={(from, to) => setCurrentSlide(to)} // Track current slide
                afterChange={(current) => setCurrentSlide(current)} // Ensure sync after change
            >
                {/* Page 1: Language selection */}
                <div 
                    className={styles.contentStyle1}
                    tabIndex={currentSlide === 0 ? 0 : -1}
                    inert={currentSlide !== 0 ? "" : undefined}
                >
                    <Page1
                        carouselRef={carouselRef}
                        isActive={currentSlide === 0}
                        setLanguage={(lang) => {
                            setLanguage(lang);
                            // If coming from Page3, go directly to Page3 after language select
                            if (typeof window !== 'undefined' && sessionStorage.getItem('redirectToPage3') === 'true') {
                                sessionStorage.removeItem('redirectToPage3');
                                setTimeout(() => {
                                    carouselRef.current?.goTo(2);
                                }, 0);
                            }
                        }} // Pass function to update language
                    />
                </div>
                {/* Page 2: Authentication */}
                <div 
                    className={styles.contentStyle2}
                    tabIndex={currentSlide === 1 ? 0 : -1}
                    inert={currentSlide !== 1 ? "" : undefined}
                >
                    <Page2
                        carouselRef={carouselRef}
                        isActive={currentSlide === 1}
                        language={language}
                        setUsername={setUsername} // Pass function to update username
                        setUserId={setUserId} // Pass function to update user ID
                        resetPin={resetPin}        // Add this prop
                        setResetPin={setResetPin}  // Add this prop
                    />
                </div>
                {/* Page 3: Meal selection and ordering */}
                <div 
                    className={styles.contentStyle3}
                    tabIndex={currentSlide === 2 ? 0 : -1}
                    inert={currentSlide !== 2 ? "" : undefined}
                >
                    <Page3
                        carouselRef={carouselRef}
                        isActive={currentSlide === 2}
                        language={language}
                        username={username}
                        userId={userId} // Pass user ID to Page3
                        setResetPin={setResetPin}  // Add this prop
                    />
                </div>
            </Carousel>
        </MealDataProvider>
    );
};

// Export the OrderTab component
export default OrderTab;