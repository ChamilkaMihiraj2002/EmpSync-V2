import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import Loading from "../../../atoms/loading/loading";

const roleRouteMap = {
  HR_ADMIN: "/EmployeePage",
  INVENTORY_ADMIN: "/Ingredients",
  KITCHEN_STAFF: "/KitchenStaff",
  KITCHEN_ADMIN: "/kitchen-admin",
  SUPER_ADMIN: "/superadmin/dashboard",
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { authData, authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && authData?.user?.role) {
      const userRole = authData.user.role;
      const route = roleRouteMap[userRole] || "/ProfilePage";
      navigate(route);
    }
  }, [authLoading, authData, navigate]);

  if (authLoading) return <Loading />;
  return null; // No UI needed
};

export default LoginPage;
