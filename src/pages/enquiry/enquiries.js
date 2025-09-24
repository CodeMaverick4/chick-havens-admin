import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DataTableCustom from "../../components/common/DataTableCustom";
import { Input } from "../../components/common/Input";
import Slider from "../../components/common/Slider";
import { toastEmitter } from "../../utils/toastEmitter";
import { debounce } from "lodash";
import { ROUTES } from "../../routes/routes";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ENQUIRES_API_URL } from "../../utils/api-constants";

const Enquiries = () => {
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    // +---------------------+
    const [isLoading, setIsLoading] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();

    const columns = useMemo(() => [
        { name: "S.No", cell: (row, index) => index + 1, width: "80px", center: "true" },
        { name: "Full Name", cell: (row) => row.full_name },
        { name: 'Email', cell: row => row.email, width: "250px" },
        { name: 'Phone', cell: row => row.description },
        { name: 'Issue', cell: row => row.description },
        { name: 'Status', cell: row => row.status, center: "true" },
        { name: 'Action', cell: row => <i className="bi bi-pen datatable_edit_icon" onClick={() => navigate(`${ROUTES.CUSTOMERDETAIL}${row.id}`)}></i>, center: "true" }
    ], []);

    const loadEnquries = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${ENQUIRES_API_URL}.json`);
            setRows(response.data.data)
            setTotal(response.data.total);
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            toastEmitter("error", err.response.data.message);
            console.log("err -->", err);
        }
    };


    useEffect(() => {
        loadEnquries();
    }, [])

    return (
        <>
            <h3 className=" mb-4">All Enquries</h3>
            <div className="outlet-container">
                <div className="row mb-3">
                    <div className="col-md-3 offset-md-9 col-12">
                        <Input type={"text"} label={"Search"} placeholder={"Enter Customer Name"} required={true} />
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
export default Enquiries