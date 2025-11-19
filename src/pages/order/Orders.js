// import { useEffect, useState } from "react";
// import axios from "axios";
// import DataTableCustom from "../../components/common/DataTableCustom";
// import { ORDERS_API_URL } from "../../utils/api-constants";
// import { toastEmitter } from "../../utils/toastEmitter";

// const Orders = () => {
//   const [rows, setRows] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const columns = [
//     { name: "S.No", selector: (row, index) => index + 1, sortable: false, width: "70px" },
//     { name: "Order ID", selector: row => row.id, sortable: true, wrap: true },
//     { name: "Customer Email", selector: row => row.email, sortable: true, wrap: true },
//     { name: "Total ($)", selector: row => row.total.toFixed(2), sortable: true },
//     { name: "Status", selector: row => row.status || "Pending", sortable: true },
//     {
//       name: "Created At",
//       selector: row => new Date(row.createdAt).toLocaleString(),
//       sortable: true,
//       wrap: true,
//     },
//   ];

//   // 🔽 Expanded Row with Product Images
//   const ExpandedRow = ({ data }) => (
//     <div
//       style={{
//         backgroundColor: "#f9fbfc",
//         borderRadius: "8px",
//         padding: "10px 15px",
//         marginTop: "5px",
//         maxHeight: "220px",
//         overflowY: "auto",
//       }}
//     >
//       <h6 className="fw-semibold mb-3">Items Ordered</h6>
//       <div className="row g-3">
//         {data.items?.map((item, idx) => (
//           <div
//             key={idx}
//             className="col-md-6 col-lg-4 d-flex align-items-center border rounded p-2 bg-white shadow-sm"
//             style={{ minWidth: "250px" }}
//           >
//             <img
//               src={item.image || "https://via.placeholder.com/80"}
//               alt={item.name}
//               width={60}
//               height={60}
//               className="rounded me-3 object-fit-cover"
//               style={{ flexShrink: 0 }}
//             />
//             <div className="d-flex flex-column justify-content-between">
//               <span className="fw-semibold">{item.name}</span>
//               <small className="text-muted">
//                 Qty: <strong>{item.quantity}</strong> × ${Number(item.price).toFixed(2)}
//               </small>
//               <small className="fw-bold">Total: ${(item.price * item.quantity).toFixed(2)}</small>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   const loadOrders = async () => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get(`${ORDERS_API_URL}.json`);
//       const arr = Object.keys(response.data || {}).map(key => ({
//         ...response.data[key],
//         id: key,
//       }));
//       setRows(arr);
//     } catch (err) {
//       toastEmitter("error", "Unable to fetch orders.");
//       console.error("Orders fetch error -->", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadOrders();
//   }, []);

//   return (
//     <div className="outlet-container">
//       <h4 className="mb-3">All Orders</h4>
//       <DataTableCustom
//         _tblColumns={columns}
//         _rowData={rows}
//         isLoading={isLoading}
//         expandableRows
//         expandableRowsComponent={ExpandedRow}
//       />
//     </div>
//   );
// };

// export default Orders;


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataTableCustom from "../../components/common/DataTableCustom";
import { ORDERS_API_URL } from "../../utils/api-constants";
import axios from "axios";
import { toastEmitter } from "../../utils/toastEmitter";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  const columns = [
    { name: 'Order ID', selector: row => row.orderId, sortable: true, width: '120px' },
    { name: 'Date', selector: row => new Date(row.orderDate).toLocaleDateString(), sortable: true, width: '120px' },
    { name: 'Customer', selector: row => row.customerName, sortable: true },
    { name: 'Items', selector: row => row.items.length, center: true, width: '80px' },
    { name: 'Amount', selector: row => `₹${row.totalAmount}`, sortable: true, width: '120px' },
    {
      name: 'Status',
      cell: row => (
        <span className={`badge ${getStatusBadge(row.orderStatus)}`}>
          {row.orderStatus}
        </span>
      ),
      width: '120px'
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="d-flex gap-2 fs-5">
          <i className="bi bi-eye text-primary cursor-pointer" onClick={() => navigate(`/order-details/${row.id}`)} title="View Details"></i>
          <i className="bi bi-file-earmark-pdf text-danger cursor-pointer" onClick={() => generateInvoice(row.id)} title="Download Invoice"></i>
        </div>
      ),
      center: true,
      width: '100px'
    }
  ];

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-warning',
      confirmed: 'bg-info',
      shipped: 'bg-primary',
      delivered: 'bg-success',
      cancelled: 'bg-danger'
    };
    return badges[status] || 'bg-secondary';
  };

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${ORDERS_API_URL}.json`);
      let arr = [];
      for (let key in response.data) {
        arr.push({ ...response.data[key], id: key });
      }
      setOrders(arr);
    } catch (err) {
      toastEmitter("error", "Failed to load orders");
    }
    setIsLoading(false);
  };

  const generateInvoice = (orderId) => {
    // Simple alert for now - implement PDF later
    toastEmitter("info", "Invoice download feature coming soon!");
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Filter orders
  const filteredOrders = statusFilter === "all" 
    ? orders 
    : orders.filter(order => order.orderStatus === statusFilter);

  return (
    <>
      <h4 className="mb-4">All Orders</h4>
      <div className="outlet-container">
        <div className="d-flex justify-content-between mb-4">
          <select className="form-select w-25" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <DataTableCustom
          tableHeading="Order List"
          _tblColumns={columns}
          _rowData={filteredOrders}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};

export default Orders;
