import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Card from "../components/card";
import DataTableCustom from "../components/common/DataTableCustom";
import { CUSTOMERS, ORDER, PRODUCT, REVENUE } from "../utils/image-constants";
import { toastEmitter } from "../utils/toastEmitter";
import { ORDERS_API_URL, CUSTOMERS_API_URL, PRODUCT_API_URL } from "../utils/api-constants";

const Dashboard = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'table_status_pending',
      confirmed: 'table_status_conform',
      shipped: 'table_status_conform',
      delivered: 'table_status_conform',
      cancelled: 'table_status_canceled'
    };
    return badges[status] || 'table_status_pending';
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const columns = [
    { 
      name: 'Order ID', 
      selector: row => row.orderId, 
      sortable: true,
      width: '140px'
    },
    { 
      name: 'Date Placed', 
      selector: row => new Date(row.orderDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }), 
      sortable: true,
      width: '130px'
    },
    { 
      name: 'Customer', 
      selector: row => row.customerName, 
      sortable: true 
    },
    { 
      name: 'Items', 
      selector: row => row.items?.length || 0, 
      center: true,
      width: '80px'
    },
    { 
      name: 'Total Amount', 
      selector: row => `$${Number(row.totalAmount).toFixed(2)}`,
      sortable: true,
      width: '130px'
    },
    {
      name: 'Payment',
      cell: row => (
        <span className={`badge ${row.paymentStatus === 'paid' ? 'bg-success' : 'bg-warning'}`}>
          {row.paymentStatus}
        </span>
      ),
      width: '110px',
      center: true
    },
    {
      name: 'Status',
      cell: row => (
        <span className={getStatusBadge(row.orderStatus)}>
          {getStatusText(row.orderStatus)}
        </span>
      ),
      width: '120px'
    },
    { 
      name: 'Action', 
      cell: row => (
        <i 
          className="bi bi-eye fs-5 cursor-pointer text-primary" 
          onClick={() => navigate(`/order-details/${row.id}`)}
          title="View Details"
        ></i>
      ),
      center: true,
      width: '80px'
    }
  ];

  // Fetch all dashboard data
  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Fetch Orders
      const ordersResp = await axios.get(`${ORDERS_API_URL}.json`);
      const ordersArr = [];
      
      for (let key in ordersResp.data) {
        const order = ordersResp.data[key];
        ordersArr.push({
          id: key,
          orderId: order.orderId || key,
          orderDate: order.orderDate || order.createdAt,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          totalAmount: order.totalAmount || 0,
          orderStatus: order.orderStatus || 'pending',
          paymentStatus: order.paymentStatus || 'pending',
          items: order.items || []
        });
      }

      // Sort by date (newest first)
      ordersArr.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      
      setRows(ordersArr);
      setTotalOrders(ordersArr.length);
      
      // Calculate total revenue (only from paid orders)
      const revenue = ordersArr
        .filter(order => order.paymentStatus === 'paid')
        .reduce((sum, order) => sum + Number(order.totalAmount), 0);
      setTotalRevenue(revenue);

      // Fetch Products
      const productsResp = await axios.get(`${PRODUCT_API_URL}.json`);
      const productsCount = productsResp.data ? Object.keys(productsResp.data).length : 0;
      setTotalProducts(productsCount);

      // Fetch Customers (unique emails from orders)
      const uniqueCustomers = new Set(ordersArr.map(order => order.customerEmail));
      setTotalCustomers(uniqueCustomers.size);

    } catch (err) {
      toastEmitter("error", "Unable to fetch dashboard data.");
      console.error("Dashboard fetch error -->", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div>
      <h4 className="mb-4">Dashboard Overview</h4>
      
      {/* Dashboard Cards */}
      <div className="d-flex flex-wrap gap-3 mb-4">
        <Card 
          title={"Total Revenue"} 
          val={`$${totalRevenue.toFixed(2)}`} 
          img={REVENUE} 
          icon={<i className="fs-5 bi bi-currency-dollar dashboard-card-icon-pos"></i>} 
        />
        <Card 
          title={"Total Orders"} 
          val={totalOrders} 
          img={ORDER} 
          icon={<i className="fs-5 bi bi-bag-check-fill dashboard-card-icon-pos"></i>} 
        />
        <Card 
          title={"Total Products"} 
          val={totalProducts} 
          img={PRODUCT} 
          icon={<i className="fs-5 bi bi-box-seam dashboard-card-icon-pos"></i>} 
        />
        <Card 
          title={"Total Customers"} 
          val={totalCustomers} 
          img={CUSTOMERS} 
          icon={<i className="fs-5 bi bi-people-fill dashboard-card-icon-pos"></i>} 
        />
      </div>

      {/* Recent Orders Table */}
      <div className="outlet-container">
        <h5 className="mb-3">Recent Orders</h5>
        <DataTableCustom
          _tblColumns={columns}
          _rowData={rows.slice(0, 10)} // Show only latest 10 orders
          isLoading={isLoading}
          pagination={false}
        />
        
        {rows.length > 10 && (
          <div className="text-center mt-3">
            <button 
              className="btn btn-outline-primary"
              onClick={() => navigate('/orders')}
            >
              View All Orders <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
