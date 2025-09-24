import {  useEffect, useMemo, useState } from "react";
import DataTableCustom from "../../components/common/DataTableCustom";
import { Input } from "../../components/common/Input";

import { toastEmitter } from "../../utils/toastEmitter";
import { useNavigate } from "react-router-dom";
import { CUSTOMERS_API_URL } from "../../utils/api-constants";
import axios from "axios";

const Customers = () => {
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    // +---------------------+
    const [isLoading, setIsLoading] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const navigate = useNavigate();

    const columns = useMemo(() => [
        { name: "S.No", cell: (row, index) => index + 1, center: true },
        { name: "Image", cell: (row) => (<img src={row.image} alt={"image"} width="40" height="40" style={{ borderRadius: "50%", objectFit: "cover" }} />), center: true },
        { name: "Full Name", cell: row => row.name },
        { name: 'Email', cell: row => row.mail },
        { name: 'Phone Number', cell: row => row.phone },
        {
            name: 'Action', cell: row =>
                <div className="d-flex gap-2 fs-5">
                    <i className="bi bi-pen datatable_edit_icon" onClick={() => {}}></i >
                    <i class="bi bi-trash-fill text-danger cursor-pointer" onClick={() =>{}}></i>
                </div>,
            center: true, 
        },
    ], [rows]);

    const loadCustomers = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${CUSTOMERS_API_URL}.json`);
            let arr = [];
            for (let key in response.data) {
                arr.push({ ...response.data[key], id: key })
            }
            console.log(arr)
            setRows(arr)
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            toastEmitter("error", err.message);
        }
    }

    useEffect(() => {
        loadCustomers();
    }, [])
    return (
        <>
            <h3 className=" mb-4">All Customers</h3>
            <div className="outlet-container">
                <div className="row mb-3">
                    <div className="col-md-3 offset-md-9 col-12">
                        <Input type={"text"} label={"Search"} placeholder={"Enter Customer Name"} required={true}  />
                    </div>
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
export default Customers