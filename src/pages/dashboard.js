import { useState } from "react";
import Card from "../components/card"
import DataTableCustom from "../components/common/DataTableCustom"
import { CUSTOMERS, ORDER, PRODUCT, REVENUE } from "../utils/image-constants"

const Dashboard = () => {
    const [rows, setRows] = useState([]);

    // +---------------------+
    const [isLoading, setIsLoading] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [payload, setPayload] = useState({
        pageIndex: 1,
        pageSize: 10,
        searchText: "",
        direction: "asc",
        filterByFieldName: "name"
    });

    const columns = [
        {
            name: 'Order ID',
            selector: row => row.orderId,
        },
        {
            name: 'Date Placed',
            selector: row => row.placed,
            sortable:true
        },
        {
            name: 'Total Amount',
            selector: row => row.amount,
        },
        {
            name: 'Status',
            selector: row => {
                if (row.status === 'Confirmed') {
                    return <span className="table_status_conform">Confirmed</span>
                } else if (row.status === 'Pending') {
                    return <span className="table_status_pending">Pending</span>
                } else if (row.status === 'Pending Payment') {
                    return <span className="table_status_pending_payment">Pending Payment</span>
                } else {
                    return <span className="table_status_canceled">Cancled</span>
                }
            },
        },
        {
            name: 'Action',
            selector: row => <i className="bi bi-eye fs-4 cursor-pointer"></i>,
            // center:true
        },
    ];
    const data = [
        {
            orderId: 'ORD-1001',
            placed: '2025-08-01',
            amount: '$120.00',
            status: 'Pending Payment',
        },
        {
            orderId: 'ORD-1002',
            placed: '2025-08-02',
            amount: '$250.00',
            status: 'Confirmed',
        },
        {
            orderId: 'ORD-1003',
            placed: '2025-08-03',
            amount: '$75.50',
            status: 'Cancelled',
        },
        {
            orderId: 'ORD-1004',
            placed: '2025-08-04',
            amount: '$300.00',
            status: 'Pending',
        },
        {
            orderId: 'ORD-1005',
            placed: '2025-08-05',
            amount: '$99.99',
            status: 'Pending',
        },
        {
            orderId: 'ORD-1006',
            placed: '2025-08-06',
            amount: '$180.00',
            status: 'Pending Payment',
        },
        {
            orderId: 'ORD-1007',
            placed: '2025-08-07',
            amount: '$220.00',
            status: 'Confirmed',
        },
        {
            orderId: 'ORD-1008',
            placed: '2025-08-08',
            amount: '$145.75',
            status: 'Pending',
        },
        {
            orderId: 'ORD-1009',
            placed: '2025-08-09',
            amount: '$80.00',
            status: 'Cancelled',
        },
        {
            orderId: 'ORD-1010',
            placed: '2025-08-10',
            amount: '$55.20',
            status: 'Pending Payment',
        },
        {
            orderId: 'ORD-1011',
            placed: '2025-08-11',
            amount: '$410.00',
            status: 'Confirmed',
        },
    ];


    return (
        <div>
            {/* row 1  */}
            <div className="d-flex flex-wrap gap-3 mb-4">
                <Card title={"Total Revenue"} val={'10,9333.00'} img={REVENUE} icon={<i className="fs-5 bi bi-database-fill dashboard-card-icon-pos"></i>} />
                <Card title={"Total Orders"} val={'10,9333.00'} img={ORDER} icon={<i className="fs-5 bi bi-bag-check-fill dashboard-card-icon-pos"></i>} />
                <Card title={"Total Products"} val={'10,9333.00'} img={PRODUCT} icon={<i className="fs-5 bi bi-house-door-fill dashboard-card-icon-pos"></i>} />
                <Card title={"Total Customers"} val={'10,9333.00'} img={CUSTOMERS} icon={<i className="fs-5 bi bi-people-fill dashboard-card-icon-pos"></i>} />
            </div>
            {/* row 2  */}
            <div className="outlet-container">
                <DataTableCustom
                    _tblColumns={columns}
                    _rowData={data}
                    _totalRows={payload.total}
                    pageSize={payload.pageSize}
                    setPayload={setPayload}
                    isLoading={isLoading}
                />

            </div>
        </div>
    )
}
export default Dashboard