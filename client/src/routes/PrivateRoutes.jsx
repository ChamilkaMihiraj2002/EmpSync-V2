import { Route } from "react-router-dom";
import ProtectedRoute from "../../src/guards/ProtectedRoutes.jsx";
import SuperAdminProtectedRoute from "../../src/guards/SuperAdminProtectedRoute.jsx";
import LoginRole from "../components/pages/Login/LoginAsPage/LoginRole.jsx";
import Login from "../components/pages/Login/LoginPage/Login.jsx";

// HR_ADMIN
import EmployeePage from "../components/pages/HR/EmployeePage/EmployeePage.jsx";
import RegisterPage from "../components/pages/HR/RegisterPage/RegisterPage.jsx";


// KITCHEN_ADMIN
import KitchenAdmin from "../components/pages/KitchenAdmin/SchedulePage/KitchenAdmin.jsx";
import Reports from "../components/pages/KitchenAdmin/ReportPage/Report.jsx";
import Meals from "../components/pages/KitchenAdmin/MealPage/Meal.jsx";
import MealDetailsForm from "../components/pages/KitchenAdmin/AddMealPage/AddMeal.jsx";
import EditMeal from "../components/pages/KitchenAdmin/EditMealPage/EditMeal.jsx";

// ServingStaff
import Serving from "../components/pages/ServingStaff/BarcodeScan/Serving.jsx";
import MealConform from "../components/pages/ServingStaff/MealConfirm/MealConform.jsx";

// KitchenStaff
import KitchenStaff from "../components/pages/KitchenStaff/kitchenStaff.jsx";

import LoginRouting from "../guards/LoginRouting.jsx";


// SuperAdmin
import SuperAdmin from "../components/pages/SuperAdmin/SuperAdmin.jsx";
import SuperAdminLogin from '../components/pages/Login/SuperAdmin/LoginPage/Login.jsx';
import Organizations from '../components/organisms/SuperAdmin/pages/Organizations/Organization List/OrganizationList.jsx';
import Roles from '../components/organisms/SuperAdmin/pages/Roles/RolesList.jsx';
import Permissions from '../components/organisms/SuperAdmin/pages/Permissions/PermissionsList.jsx';

const PrivateRoutes = () => (
  <>
    <Route
      path="/Login"
      element={
        <LoginRouting>
          <Login />
        </LoginRouting>
      }
    />
    <Route
      path="/LoginRole"
      element={
        <ProtectedRoute
          allowedRoles={[
            "HR_ADMIN",
            "KITCHEN_ADMIN",
            "KITCHEN_STAFF",
          ]}
        >
          <LoginRole />
        </ProtectedRoute>
      }
    />

    {/* SuperAdmin Routes */}
    <Route
      path="/SuperAdmin/login"
      element={<SuperAdminLogin />}
    />
    <Route
      path="/SuperAdmin/dashboard"
      element={
        <SuperAdminProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
          <SuperAdmin />
        </SuperAdminProtectedRoute>
      }
    />
    <Route
      path="/SuperAdmin/organizations"
      element={
        <SuperAdminProtectedRoute allowedRoles={["SUPER_ADMIN"]}> 
          <Organizations />
        </SuperAdminProtectedRoute>
      }
    />
    <Route
      path="/SuperAdmin/roles"
      element={
        <SuperAdminProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
          <Roles />
        </SuperAdminProtectedRoute>
      }
    />
    <Route
      path="/SuperAdmin/permissions"
      element={
        <SuperAdminProtectedRoute allowedRoles={["SUPER_ADMIN"]}> 
          <Permissions />
        </SuperAdminProtectedRoute>
      }
    />
    
    

    {/* HR_ADMIN Routes */}
    <Route
      path="/EmployeePage"
      element={
        <ProtectedRoute allowedRoles={["HR_ADMIN","KITCHEN_ADMIN"]}>
          <EmployeePage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/reg"
      element={
        <ProtectedRoute allowedRoles={["HR_ADMIN","KITCHEN_ADMIN"]}>
          <RegisterPage />
        </ProtectedRoute>
      }
    />




    

    {/* KITCHEN_ADMIN Routes */}
    <Route
      path="/kitchen-admin"
      element={
        <ProtectedRoute allowedRoles={["KITCHEN_ADMIN","HR_ADMIN"]}>
          <KitchenAdmin />
        </ProtectedRoute>
      }
    />
    <Route
      path="/kitchen-report"
      element={
        <ProtectedRoute allowedRoles={["KITCHEN_ADMIN","HR_ADMIN"]}>
          <Reports />
        </ProtectedRoute>
      }
    />
    <Route
      path="/kitchen-meal"
      element={
        <ProtectedRoute allowedRoles={["KITCHEN_ADMIN","HR_ADMIN"]}>
          <Meals />
        </ProtectedRoute>
      }
    />
    <Route
      path="/meal-details"
      element={
        <ProtectedRoute allowedRoles={["KITCHEN_ADMIN","HR_ADMIN"]}>
          <MealDetailsForm />
        </ProtectedRoute>
      }
    />
    <Route
      path="/edit-meal"
      element={
        <ProtectedRoute allowedRoles={["KITCHEN_ADMIN","HR_ADMIN"]}>
          <EditMeal />
        </ProtectedRoute>
      }
    />

    {/* ServingStaff Routes */}
    <Route
      path="/serving"
      element={
        // <ProtectedRoute allowedRoles={["KITCHEN_STAFF"]}>
          <Serving />
        // </ProtectedRoute>
      }
    />
    <Route
      path="/meal-conform/:id"
      element={
        // <ProtectedRoute allowedRoles={["KITCHEN_STAFF"]}>
          <MealConform />
        // </ProtectedRoute>
      }
    />

    {/*Kitchen Staff */}
    <Route
      path="/kitchenStaff"
      element={
        <ProtectedRoute allowedRoles={["KITCHEN_STAFF"]}>
          <KitchenStaff />
        </ProtectedRoute>
      }
    />
  </>
);

export default PrivateRoutes;
