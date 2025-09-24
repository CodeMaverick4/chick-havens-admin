import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import axios from "axios";
import { CATEGORIES_API_URL } from "../utils/api-constants";
import DataTableCustom from "../components/common/DataTableCustom";
import Button from "../components/common/Button";
import { Input, TextArea } from "../components/common/Input";
import { ROUTES } from "../routes/routes";
import { toastEmitter } from "../utils/toastEmitter";
import { onlyAlphaWithSpace } from "../utils/regex-constant";
import { checkEmpty, checkError } from "../utils/form-utils";
import useForm from "../hook/validateForm";
import validateForm from "../hook/validateForm";

const Categories = () => {
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [edit, setEdit] = useState(false);
    const [categoryData, setCategoryData] = useState({
        categoryName: '',
        categoryDescription: ''
    });
    const [errors, setErrors] = useState({
        categoryName: '',
        categoryDescription: ''
    });
    const navigate = useNavigate();

    const handleNavigate = (id) => {
        navigate(ROUTES.ADDPRODUCT, { state: { productId: id } });
    };

    const columns = [
        { name: 'S.No', selector: (row, index) => index + 1, sortable: false, width: "60px" },
        { name: 'Category Name', cell: row => row.categoryName, sortable: true },
        { name: 'Description', selector: row => row.categoryDescription },
        {
            name: 'Action', cell: row =>
                <div className="d-flex gap-2 fs-5">
                    <i className="bi bi-pen datatable_edit_icon" onClick={() => handeEdit(row)}></i >
                    <i class="bi bi-trash-fill text-danger cursor-pointer" onClick={() => handleRemoveCategories(row.id)}></i>
                </div>,
            center: true
        },
    ];

    const handeEdit = (category) => {
        setCategoryData({
            id: category.id,
            categoryName: category.categoryName,
            categoryDescription: category.categoryDescription
        })
        setEdit(true)
    }

    const loadCategories = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${CATEGORIES_API_URL}.json`);
            let arr = [];
            for (let key in response.data) {
                arr.push({ ...response.data[key], id: key })
            }
            setRows(arr)
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            toastEmitter("error", "Unable to reach server.")
        }
    }

    const handleRemoveCategories = async (id) => {
        try {
            await axios.delete(`${CATEGORIES_API_URL}/${id}.json`)
            setRows(rows.filter(category => category.id !== id));
            toastEmitter('success', "Category removed successfully..");
        } catch (err) {
            toastEmitter('error', "Failed to remove product..");
        }
    }

    const handleAddCategory = async () => {
        const ifError = checkError(errors)
        if (ifError) return
        const { updatedErrors, updatedFormData, hasError } = validateForm({
            formData: categoryData,            
            skipFields: []
        });
        
        setErrors(prev=> ({ ...prev, ...updatedErrors }));
        setCategoryData(prev => ({ ...prev, ...updatedFormData }));
        console.log(updatedErrors, updatedFormData)
        if (hasError) return
        
        try {
            if (edit) {
                await axios.put(`${CATEGORIES_API_URL}/${categoryData.id}.json`, { categoryName: categoryData.categoryName, categoryDescription: categoryData.categoryDescription })
            } else {
                await axios.post(`${CATEGORIES_API_URL}.json`, categoryData)
            }
            await loadCategories();
            toastEmitter('success', "Category added successfully..");
            setEdit(false);
            setCategoryData({
                categoryName: '',
                categoryDescription: ''
            })
        } catch (err) {
            toastEmitter('error', "Failed to remove product..");
        }
    }

    const handleChange = (e) => {
        if (e.target.name === 'categoryName' && !onlyAlphaWithSpace.test(e.target.value)) {
            setErrors(prev => ({ ...prev, categoryName: "Invalid Text.." }));
        }
        else {
            setErrors(prev => ({ ...prev, categoryName: "" }));
        }

        if (e.target.name === 'categoryDescription' && !onlyAlphaWithSpace.test(e.target.value))
            setErrors(prev => ({ ...prev, categoryDescription: "Invalid Text.." }));
        else setErrors(prev => ({ ...prev, categoryDescription: "" }));

        setCategoryData(prev => ({ ...prev, [e.target.name]: e.target.value }))

    }

    useEffect(() => {
        loadCategories()
    }, []);

    return (
        <>
            <h4 className="mb-4">All Categories</h4>
            <div className="outlet-container">
                <div className="d-flex justify-content-between mb-4">
                    <div><Input type={"text"} placeholder={"Search"} value={searchValue} label={"Search"} /></div>
                </div>
                <div className="row">
                    <div className="col-8">
                        <DataTableCustom
                            _tblColumns={columns}
                            _rowData={rows}
                            isLoading={isLoading}
                        />
                    </div>
                    <div className="col-4">
                        <h4 className="mb-4">{edit ? "Edit " : "Add New "}Category</h4>
                        <Input
                            name={'categoryName'}
                            type="text"
                            placeholder="Enter Category Name*"
                            label="Category Name"
                            required={true}
                            value={categoryData?.categoryName}
                            parentDivCss="mt-4"
                            onChange={handleChange}
                        />
                        <span className="error-msg">{errors.categoryName}</span>
                        <TextArea
                            name={'categoryDescription'}
                            label="Description"
                            placeholder="Enter category description"
                            rows={5}
                            value={categoryData?.categoryDescription}
                            parentDivCss="mt-3"
                            onChange={handleChange}
                        />

                        <span className="error-msg">{errors.categoryDescription}</span>

                        <div className="mt-3 d-flex justify-content-center">
                            <Button isLoading={isLoading} type="primary" label={edit ? "Edit" : "Save"} extraCss={"w-50"} onClick={handleAddCategory} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Categories