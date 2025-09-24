import { useNavigate } from "react-router-dom"
import Button from "../../components/common/Button"
import { ROUTES } from "../../routes/routes"
import DataTableCustom from "../../components/common/DataTableCustom";
import { useEffect, useState } from "react";
import { toastEmitter } from "../../utils/toastEmitter";
import { Input } from "../../components/common/Input";
import { ORDERS_API_URL } from "../../utils/api-constants";
import axios from "axios";
import Card from "../../components/card";
import { CUSTOMERS } from "../../utils/image-constants";

const Orders = () => {
    const [rows, setRows] = useState([]);
    // +---------------------+
    const [isLoading, setIsLoading] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const navigate = useNavigate();

    const handleNavigate = (id) => {
        navigate(ROUTES.ADDPRODUCT, { state: { productId: id } });
    };

    const columns = [
        { name: 'S.No', selector: (row, index) => index + 1, sortable: false },
        { name: 'Order', cell: row => row.order },
        { name: 'Customer', selector: row => row.customer, sortable: true },
        { name: 'Payment', selector: row => row.payment, sortable: true },
        { name: 'Total', selector: row => row.total, sortable: true },
        { name: 'Items', selector: row => row.items, sortable: true },
        { name: 'Fulfilment', selector: row => row.fulfilment, sortable: false },
    ];

    const loadOrders = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${ORDERS_API_URL}.json`);
            console.log(Object.values(response.data));
            let arr = [];
            for (let key in response.data) {
                arr.push({ ...response.data[key], id: key })
            }
            console.log(arr)
            setRows(arr)
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            toastEmitter("error", "Unable to reach server.")
            console.log("err -->", err);
        }
    }

    useEffect(() => {
        loadOrders()
    }, []);

    return (
        <>
            <h4 className="mb-2">All Products</h4>
            <div className="d-flex gap-3 mb-3">
                <Card title={"Total Order"} val={'10'} img={CUSTOMERS} icon={<i className="fs-5 bi bi-people-fill dashboard-card-icon-pos"></i>} />
                <Card title={"Total Return Order"} val={'0'} img={CUSTOMERS} icon={<i className="fs-5 bi bi-people-fill dashboard-card-icon-pos"></i>} />
                <Card title={"Total Unfulfilled"} val={'10'} img={CUSTOMERS} icon={<i className="fs-5 bi bi-people-fill dashboard-card-icon-pos"></i>} />
            </div>
            <div className="outlet-container">
                <div className="d-flex justify-content-between mb-4">
                    <div><Input type={"text"} placeholder={"Search"} value={searchValue} label={"Search"} /></div>
                </div>
                <DataTableCustom
                    _tblColumns={columns}
                    _rowData={rows}
                    isLoading={isLoading}
                />
            </div>
        </>
    )
}
export default Orders