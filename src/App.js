import './App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import MainLayout from './layout/mainLayout';
import { ROUTES } from './routes/routes';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import { ToastContainer } from 'react-toastify';

import NotFound from './pages/notFound';
import ProtectedRoute, { PublicRoute } from './routes/RouteGuard';
import Dashboard from './pages/dashboard';
import Products from './pages/product/Products';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadLoginDetails } from './redux/slice/authSlicer';
import AddProduct from './pages/product/AddProduct';
import Categories from './pages/categories';
import Customers from './pages/customers/Customers';
import Orders from './pages/order/Orders';
import Enquiries from './pages/enquiry/enquiries';
import Feedbacks from './pages/customers/Feedbacks';
import Staff from './pages/staff management/staff';
// import AddStaff from './pages/staff management/addStaff';
import Roles from './pages/staff management/roles';
import AddRole from './pages/staff management/addRole';
import AddStaff from './pages/staff management/addStaff';
import OrderDetails from './pages/order/orderDetials';


function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadLoginDetails())
  }, [])
  return (
    <>
      <ToastContainer />
      <Routes>
        {/* Public Route */}
        <Route path={ROUTES.LOGIN} element={<PublicRoute><Login /></PublicRoute>} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>

          {/* Dashboard - Everyone can access */}
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />

          {/* Products - Requires manage_products permission */}
          <Route
            path={ROUTES.PRODUCTS}
            element={
              <ProtectedRoute requiredPermission="manage_products">
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path={`${ROUTES.ADDPRODUCT}:product_id?`}
            element={
              <ProtectedRoute requiredPermission="manage_products">
                <AddProduct />
              </ProtectedRoute>
            }
          />

          {/* Categories - Requires manage_categories permission */}
          <Route
            path={ROUTES.CATEGORY}
            element={
              <ProtectedRoute requiredPermission="manage_categories">
                <Categories />
              </ProtectedRoute>
            }
          />

          {/* Customers - Requires manage_customers permission */}
          <Route
            path={ROUTES.CUSTOMERS}
            element={
              <ProtectedRoute requiredPermission="manage_customers">
                <Customers />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.FEEDBACKS}
            element={
              <ProtectedRoute requiredPermission="manage_customers">
                <Feedbacks />
              </ProtectedRoute>
            }
          />

          {/* Orders - Requires manage_orders permission */}
          <Route
            path={ROUTES.ORDERS}
            element={
              <ProtectedRoute requiredPermission="manage_orders">
                <Orders />
              </ProtectedRoute>
            }
          />

          <Route path="/order-details/:orderId" element={
            <ProtectedRoute requiredPermission="manage_orders">
              <OrderDetails />
            </ProtectedRoute>
          } />

          {/* Enquiries - Requires manage_enquiries permission */}
          <Route
            path={ROUTES.ENQUIRIES}
            element={
              <ProtectedRoute requiredPermission="manage_enquiries">
                <Enquiries />
              </ProtectedRoute>
            }
          />

          {/* Roles - Admin Only */}
          <Route
            path={ROUTES.ROLES}
            element={
              <ProtectedRoute adminOnly={true}>
                <Roles />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADDROLES}
            element={
              <ProtectedRoute adminOnly={true}>
                <AddRole />
              </ProtectedRoute>
            }
          />

          {/* Staff - Admin Only */}
          <Route
            path={ROUTES.STAFF}
            element={
              <ProtectedRoute adminOnly={true}>
                <Staff />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADDSTAFF}
            element={
              <ProtectedRoute adminOnly={true}>
                <AddStaff />
              </ProtectedRoute>
            }
          />

        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>

    </>
  );
}

export default App;
