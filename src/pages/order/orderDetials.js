import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "../../components/common/Button";
import { ORDERS_API_URL } from "../../utils/api-constants";
import axios from "axios";
import { toastEmitter } from "../../utils/toastEmitter";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [newPaymentStatus, setNewPaymentStatus] = useState("");

  const loadOrder = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${ORDERS_API_URL}/${orderId}.json`);
      setOrder(response.data);
      setNewStatus(response.data.orderStatus);
      setNewPaymentStatus(response.data.paymentStatus);
    } catch (err) {
      toastEmitter("error", "Failed to load order");
    }
    setIsLoading(false);
  };

  const updateOrderStatus = async () => {
    try {
      await axios.patch(`${ORDERS_API_URL}/${orderId}.json`, { 
        orderStatus: newStatus,
        updatedAt: new Date().toISOString()
      });
      toastEmitter("success", "Order status updated");
      loadOrder();
    } catch (err) {
      toastEmitter("error", "Failed to update order status");
    }
  };

  const updatePaymentStatus = async () => {
    try {
      await axios.patch(`${ORDERS_API_URL}/${orderId}.json`, { 
        paymentStatus: newPaymentStatus,
        updatedAt: new Date().toISOString()
      });
      toastEmitter("success", "Payment status updated");
      loadOrder();
    } catch (err) {
      toastEmitter("error", "Failed to update payment status");
    }
  };

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  if (isLoading || !order) return <p>Loading...</p>;

  return (
    <div className="outlet-container">
      <div className="pb-4 mb-3 border-bottom d-flex justify-content-between align-items-center">
        <h3>Order Details - {order.orderId}</h3>
        <Button label="Back" onClick={() => navigate("/orders")} icon={<i className="bi bi-arrow-left"></i>} />
      </div>

      <div className="row">
        {/* Customer Info */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header"><strong>Customer Information</strong></div>
            <div className="card-body">
              <p><strong>Name:</strong> {order.customerName}</p>
              <p><strong>Email:</strong> {order.customerEmail}</p>
              <p><strong>Phone:</strong> {order.customerPhone}</p>
              <p><strong>Address:</strong> {order.shippingAddress}</p>
            </div>
          </div>
        </div>

        {/* Order Info */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header"><strong>Order Information</strong></div>
            <div className="card-body">
              <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
              <p><strong>Payment Method:</strong> {order.paymentMethod.toUpperCase()}</p>
              <p>
                <strong>Payment Status:</strong> 
                <span className={`badge ms-2 ${order.paymentStatus === 'paid' ? 'bg-success' : order.paymentStatus === 'failed' ? 'bg-danger' : 'bg-warning'}`}>
                  {order.paymentStatus}
                </span>
              </p>
              <p>
                <strong>Order Status:</strong> 
                <span className={`badge ms-2 ${order.orderStatus === 'delivered' ? 'bg-success' : order.orderStatus === 'cancelled' ? 'bg-danger' : 'bg-info'}`}>
                  {order.orderStatus}
                </span>
              </p>
              <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="card mb-4">
        <div className="card-header"><strong>Order Items</strong></div>
        <div className="card-body">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Product</th>
                <th>Image</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.productName}</td>
                  <td>
                    <img 
                      src={item.image || '/assets/Image_Placeholder.svg'} 
                      alt={item.productName} 
                      width="50" 
                      height="50" 
                      style={{objectFit: 'cover', borderRadius: '4px'}} 
                    />
                  </td>
                  <td>{item.quantity}</td>
                  <td>₹{item.price}</td>
                  <td>₹{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="4" className="text-end"><strong>Total:</strong></td>
                <td><strong>₹{order.totalAmount}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="row">
        {/* Update Order Status */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <strong>Update Order Status</strong>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Current Status: <span className="badge bg-info">{order.orderStatus}</span></label>
                <select 
                  className="form-select" 
                  value={newStatus} 
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <Button 
                type="primary" 
                label="Update Order Status" 
                onClick={updateOrderStatus}
                extraCss="w-100"
              />
            </div>
          </div>
        </div>

        {/* Update Payment Status */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header bg-success text-white">
              <strong>Update Payment Status</strong>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">
                  Current Status: <span className={`badge ${order.paymentStatus === 'paid' ? 'bg-success' : 'bg-warning'}`}>{order.paymentStatus}</span>
                </label>
                <select 
                  className="form-select" 
                  value={newPaymentStatus} 
                  onChange={(e) => setNewPaymentStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
              <Button 
                type="primary" 
                label="Update Payment Status" 
                onClick={updatePaymentStatus}
                extraCss="w-100"
              />
              
              {order.paymentMethod === 'cod' && order.paymentStatus === 'pending' && (
                <div className="alert alert-info mt-3 mb-0">
                  <small>
                    <i className="bi bi-info-circle me-2"></i>
                    Mark as "Paid" after receiving cash on delivery
                  </small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
