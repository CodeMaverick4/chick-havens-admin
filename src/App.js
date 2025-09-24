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

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadLoginDetails())
  }, [])
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path={ROUTES.LOGIN} element={<PublicRoute><Login /></PublicRoute>} />
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path={ROUTES.DASHBOARD} element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path={ROUTES.PRODUCTS} element={<ProtectedRoute><Products /></ProtectedRoute>} />
          <Route path={`${ROUTES.ADDPRODUCT}:product_id?`} element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
          <Route path={ROUTES.CATEGORY} element={<ProtectedRoute><Categories /></ProtectedRoute>} />
          <Route path={ROUTES.CUSTOMERS} element={<ProtectedRoute><Customers /></ProtectedRoute>} />
          <Route path={ROUTES.ORDERS} element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path={ROUTES.ENQUIRIES} element={<ProtectedRoute><Enquiries /></ProtectedRoute>} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
