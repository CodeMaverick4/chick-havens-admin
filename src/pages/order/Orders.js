import { useEffect, useState } from "react";
import axios from "axios";
import DataTableCustom from "../../components/common/DataTableCustom";
import { ORDERS_API_URL } from "../../utils/api-constants";
import { toastEmitter } from "../../utils/toastEmitter";

const Orders = () => {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    { name: "S.No", selector: (row, index) => index + 1, sortable: false },
    { name: "Order ID", selector: row => row.id, sortable: true },
    { name: "Customer Email", selector: row => row.email, sortable: true },
    { name: "Total ($)", selector: row => row.total, sortable: true },
    {
      name: "Items",
      cell: row => (
        <ul className="m-0 p-0">
          {row.items.map((item, idx) => (
            <li key={idx}>{item.name} (x{item.quantity})</li>
          ))}
        </ul>
      ),
    },
    { name: "Status", selector: row => row.status || "Pending", sortable: true },
    { name: "Created At", selector: row => new Date(row.createdAt).toLocaleString(), sortable: true },
  ];

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${ORDERS_API_URL}.json`);
      let arr = [];
      for (let key in response.data) {
        arr.push({ ...response.data[key], id: key });
      }
      setRows(arr);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      toastEmitter("error", "Unable to fetch orders.");
      console.error("Orders fetch error -->", err);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="outlet-container">
      <h4 className="mb-3">All Orders</h4>
      <DataTableCustom _tblColumns={columns} _rowData={rows} isLoading={isLoading} />
    </div>
  );
};

export default Orders;
