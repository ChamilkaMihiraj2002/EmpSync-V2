import React from "react";
import {
  faUsers,
  faUserPlus,
  faFileInvoice,
  faDollarSign,
  faFingerprint,
  faCalendar,
  faChartLine,
  faBowlFood,
} from "@fortawesome/free-solid-svg-icons";
import { BellOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NavBar from '../../../organisms/NavBar/NavBar.jsx';
import NotificationPanel from "../../../organisms/Kitchen/NotificationPanel/NotificationPanel.jsx";
import { useNotifications } from "../../../../contexts/NotificationsContext.jsx";
import styles from "../../../organisms/Kitchen/NotificationPanel/NotificationPanel.module.css";
import MealSection from "../../../organisms/Kitchen/MealsSection/Meal.jsx";
import { useAuth } from "../../../../contexts/AuthContext.jsx";

const MealDash = () => {
  const { authData } = useAuth();
  const { getUnreadCount, toggleNotifications } = useNotifications();

  // Safely get permission actions
  const actions = authData?.permissions?.actions || [];

  // Define all possible menu items
  const allMenuItems = [
    {
      key: "1",
      label: "Employees",
      action: "User Management",
      icon: <FontAwesomeIcon icon={faUsers} />,
      link: "/EmployeePage",
    },
    {
      key: "2",
      label: "Registration",
      action: "User Management",
      icon: <FontAwesomeIcon icon={faUserPlus} />,
      link: "/reg",
    },
    {
      key: "3",
      label: "FingerPrints",
      action: "User Management",
      icon: <FontAwesomeIcon icon={faFingerprint} />,
      link: "/FingerPrint",
    },
    {
      key: "4",
      label: "Schedule",
      action: "Meal Management",
      icon: <FontAwesomeIcon icon={faCalendar} />,
      link: "/kitchen-admin",
    },
    {
      key: "5",
      label: "Meal",
      action: "Meal Management",
      icon: <FontAwesomeIcon icon={faBowlFood} />,
      link: "/kitchen-meal",
    },
    {
      key: "6",
      label: "Reports & Analysis",
      action: "Reports",
      icon: <FontAwesomeIcon icon={faChartLine} />,
      link: "/kitchen-report",
    },
  ];

  // Create notification menu item
  const notificationMenuItem = {
    key: "4",
    className: "notification-menu-item",
    icon: <BellOutlined />,
    label: (
      <div className={styles.notificationMenuItem}>
        Notifications
        {getUnreadCount() > 0 && (
          <span className={styles.notificationBadge}>{getUnreadCount()}</span>
        )}
      </div>
    ),
    onClick: toggleNotifications,
  };

  // Filter menu based on permissions
  const filteredMenuItems = allMenuItems.filter((item) =>
    actions.includes(item.action)
  );

  return (
    <>
      <NavBar
        Comp={MealSection}
        titleLines={["Meal", "Schedule", "Management"]}
        menuItems={filteredMenuItems}
      />
      <NotificationPanel />
    </>
  );
};

export default MealDash;
