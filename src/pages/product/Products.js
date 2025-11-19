import { useNavigate } from "react-router-dom"
import Button from "../../components/common/Button"
import { ROUTES } from "../../routes/routes"
import DataTableCustom from "../../components/common/DataTableCustom";
import Slider from "../../components/common/Slider";
import { useEffect, useRef, useState } from "react";
// import { getProducts, setProductStatus } from "../../services/api-service";
import { toastEmitter } from "../../utils/toastEmitter";
import { Input } from "../../components/common/Input";
import { debounce } from "lodash";
import { PRODUCT_API_URL } from "../../utils/api-constants";
import axios from "axios";

const Products = () => {
    const [rows, setRows] = useState([]);
    // +---------------------+
    const [isLoading, setIsLoading] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [payload, setPayload] = useState({
        pageIndex: 1,
        pageSize: 10,
        searchText: "",
        direction: "asc",
        filterByFieldName: "product_name"
    });

    const navigate = useNavigate();

    const handleNavigate = (id) => {
        navigate(ROUTES.ADDPRODUCT, { state: { productId: id } });
    };

    const columns = [
        { name: 'S.No', selector: (row, index) => index + 1, sortable: false, width: "60px" },
        { name: 'Image', cell: row => <img src={row.images ? row.images[0] : []} alt="product" width={40} height={40} style={{ borderRadius: "50%" }} />, width: "80px" },
        { name: 'Product Name', selector: row => row.name, sortable: true },
        { name: 'Brand', selector: row => row.brand, sortable: true ,width:'120px'},
        { name: 'Category', selector: row => row.category, sortable: true ,width:'180px'},
        { name: 'Price', selector: row => `$${Number(row.price).toFixed(2)}`, sortable: true ,width:'100px'},
        { name: 'Stock', selector: row => row.stock, sortable: true ,width:'100px', center:true},
        {
            name: 'Action', cell: row =>
                <div className="d-flex gap-2 fs-5">
                    <i className="bi bi-pen datatable_edit_icon" onClick={() => handleNavigate(row.id)}></i >
                    <i class="bi bi-trash-fill text-danger cursor-pointer" onClick={()=>handleRemoveProducts(row.id)}></i>
                </div>,
            center: true,width:'100px'
        },
        { name: 'Description', selector: row => row.description.length > 50 ? row.description.substring(0, 50) + "..." : row.description, sortable: false },        
    ];


    const handleStatusChange = async (id, status) => {
        try {
            const response = await axios.put(PRODUCT_API_URL)
            toastEmitter("success", response.data.message);
            await loadProducts();
        } catch (err) {
            console.log("error");
            toastEmitter("error", "Unable to change the status");
        }
    }

    const loadProducts = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${PRODUCT_API_URL}.json`);
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

    const handleRemoveProducts = async (id)=>{
        try{
            const response = await axios.delete(`${PRODUCT_API_URL}/${id}.json`)
            setRows(rows.filter(product=>product.id === id));
            toastEmitter('success',"Product removed successfully..");
        }catch(err){
            toastEmitter('error',"Failed to remove product..");
        }        
    }

    useEffect(() => {
        loadProducts()
    }, [payload]);

    return (
        <>
            <h4 className="mb-4">All Products</h4>
            <div className="outlet-container">
                <div className="d-flex justify-content-between mb-4">
                    <div><Input type={"text"} placeholder={"Search"} value={searchValue} label={"Search"} /></div>
                    <Button type="primary" label="Create New Product" onClick={() => navigate(ROUTES.ADDPRODUCT)} />
                </div>
                <DataTableCustom
                    _tblColumns={columns}
                    _rowData={rows}
                    _totalRows={payload.total}
                    pageSize={payload.pageSize}
                    setPayload={setPayload}
                    isLoading={isLoading}
                />
            </div>
        </>
    )
}
export default Products