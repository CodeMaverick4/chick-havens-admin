import { useLocation, useNavigate, useParams } from "react-router-dom"
import Button from "../../components/common/Button"
import { Input, TextArea } from "../../components/common/Input"
import SelectCustom from "../../components/common/selectCustom"
import { ROUTES } from "../../routes/routes"
import { useEffect, useRef, useState } from "react"
// import { getProductDetail } from "../../services/api-service"
import { toastEmitter } from "../../utils/toastEmitter"
import axios from "axios"
import { CATEGORIES_API_URL, PRODUCT_API_URL } from "../../utils/api-constants"
import { checkError } from "../../utils/form-utils"
import validateForm from "../../hook/validateForm"

const options = [
    { value: "active", label: 'Active' },
    { value: "inactive", label: 'Inactive' },
];

const AddProduct = () => {
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const [options, setOptions] = useState([]);
    // const [category]
    const [productData, setProductData] = useState({
        "brand": "",
        "category": "",
        "description": "",
        "images": [],
        "name": "",
        "price": "",
        "discount": '',        
        "stock": "",
    });
    const [errors, setErrors] = useState({
        "brand": "",
        "category": "",
        "description": "",
        "name": "",
        "price": "",
        "discount": '',        
        "stock": "",
    });
    const productId = location.state?.productId

    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    const inputRef = useRef(null);
    const navigate = useNavigate();

    console.log("env ...", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME)
    const handleFileSubmit = async () => {
        try {
            setIsLoading(true);
            let urls = [];

            for (let img of images) {
                // Skip if it's already a URL (existing image)
                if (!(img instanceof File)) {
                    urls.push(img);
                    continue;
                }

                const formData = new FormData();
                formData.append("file", img);
                formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
                formData.append("folder", "chic_havens");

                const response = await axios.post(
                    `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
                    formData
                );

                urls.push(response.data.secure_url);
            }

            toastEmitter("success", "Files uploaded successfully");
            setIsLoading(false);
            return urls;

        } catch (err) {
            setIsLoading(false);
            console.error(err);
            toastEmitter("error", "Error while uploading files");
        }
    };

    const handleAddProduct = async () => {
        const ifError = checkError(errors)
        if (ifError) return
        const { updatedErrors, updatedFormData, hasError } = validateForm({
            formData: productData,
            skipFields: ['images']
        });

        setErrors(prev => ({ ...prev, ...updatedErrors }));
        setProductData(prev => ({ ...prev, ...updatedFormData }));

        if (hasError) return

        try {
            setIsLoading(true);
            const urls = await handleFileSubmit();
            if (productId) {
                await axios.put(`${PRODUCT_API_URL}/${productId}.json`, { ...productData, images: urls });
            } else {
                await axios.post(`${PRODUCT_API_URL}.json`, { ...productData, images: urls });
            }

            await loadProductDetails()
            setIsLoading(false);
            navigate('/products')
        } catch (err) {
            setIsLoading(false);
            toastEmitter("error", "Unable to reach server.")
            console.log("err -->", err);
        }
    }

    const loadCategory = async () => {

        try {
            setIsLoading(true);
            const response = await axios.get(`${CATEGORIES_API_URL}.json`);
            let opt = []
            for (let key in response.data) {
                // opt[key] = response.data[key].categoryName;
                let val = response.data[key].categoryName
                opt.push({ value: val, label: val })
            }
            console.log(opt)
            setOptions(opt)
            // for(let category of response.data)
            // selectAllBarPositions()
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            toastEmitter("error", "Unable to reach server.")
            console.log("err -->", err);
        }
    }

    const loadProductDetails = async () => {
        if (!productId) return
        try {
            setIsLoading(true);
            const response = await axios.get(`${PRODUCT_API_URL}/${productId}.json`);
            console.log(response.data)
            setProductData(response.data)
            setImages(response.data.images ? response.data.images : [])
            setSelectedImage(response.data.images[0])
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            toastEmitter("error", "Unable to reach server.")
            console.log("err -->", err);
        }
    }

    const handleChange = (e, name) => {
        if (name === 'category') {
            setProductData(prev => ({ ...prev, [name]: e }))
        } else {
            console.log(e.target.name)
            setProductData(prev => ({ ...prev, [e.target.name]: e.target.value }))
            setErrors(prev=> ({ ...prev, [e.target.name]: '' }))
        }
    }

    // const handleFileUpload = (e) => {
    //     if (images?.length >= 4) {
    //         toastEmitter('error', "you can only upload 4 images.");
    //         return
    //     }

    //     const file = e.target.files[0];
    //     setImages(prev => [...prev, file]);
    //     setSelectedImage(file)
    // }
    const handleFileUpload = (e) => {
        const selectedFiles = Array.from(e.target.files); 

        if ((images?.length || 0) + selectedFiles.length > 4) {
            toastEmitter('error', "You can only upload 4 images.");
            return;
        }

        setImages(prev => [...(prev || []), ...selectedFiles]);
        setSelectedImage(selectedFiles[0]); 
    };

    const handleAddImage = (e) => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    }

    const handleRemoveImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setSelectedImage(images[0]);
    }

    useEffect(() => {
        loadCategory();
        loadProductDetails();
    }, []);
    return (
        <div className="outlet-container">
            <div className="pb-4 mb-3 border-bottom border-bottom-1 d-flex justify-content-between align-items-center">
                <h3> {productId ? "Edit" : "Add New"} Product</h3>
                <Button label="Back" onClick={() => navigate(ROUTES.PRODUCTS)} icon={<i className="bi bi-arrow-left"></i>} />
            </div>

            {isLoading ?
                <p>Loading....</p>
                :
                <>
                    <div className="row">
                        {/* Product Unlock / Status */}
                        <div className="col-6">

                            {/* Main Image */}
                            <div className="d-flex flex-column justify-content-between h-100">
                                <div className="main-image mb-3 " style={{ maxHeight: '310px' }}>
                                    <img
                                        src={selectedImage ? (selectedImage instanceof File ? URL.createObjectURL(selectedImage) : selectedImage) : "/assets/Image_Placeholder.svg"}
                                        alt="Product"
                                        style={{ width: "100%", height: "100%", borderRadius: "8px", objectFit: 'contain' }}
                                    />
                                </div>

                                {/* Thumbnails */}
                                <div className=" d-flex gap-2 overflow-auto">
                                    {images ? images.map((img, index) => (
                                        <div className="product-preview-img">
                                            <img
                                                key={index}
                                                src={img instanceof File ? URL.createObjectURL(img) : img}
                                                alt={`Thumbnail`}
                                                style={{
                                                    width: "80px",
                                                    height: "80px",
                                                    objectFit: "cover",
                                                    borderRadius: "8px",
                                                    cursor: "pointer",
                                                    border: img === selectedImage ? "2px solid #007bff" : "1px solid #ddd"
                                                }}

                                            />
                                            <div>
                                                <i class="bi bi-eye-fill text-primary cursor-pointer" onClick={() => setSelectedImage(img instanceof File ? URL.createObjectURL(img) : img)}></i>
                                                <i class="bi bi-trash-fill text-danger cursor-pointer" onClick={() => handleRemoveImage(index)}></i>
                                            </div>
                                        </div>

                                    )) : <p>No Image Found</p>}

                                    <div className="cursor-pointer border rounded-3 d-flex justify-content-center align-items-center bg-primary text-white shadow-lg" style={{ height: '80px', width: '80px' }} onClick={handleAddImage}>
                                        <i class="bi bi-patch-plus"></i>
                                        <input ref={inputRef} type="file" name="" id="" hidden='True' onChange={handleFileUpload} multiple />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 ">

                            <Input
                                name={'name'}
                                type="text"
                                placeholder="Enter Product Name*"
                                label="Product Name"
                                required={true}
                                value={productData?.name}
                                parentDivCss="mt-3"
                                onChange={handleChange}
                            />
                            <span className="error-msg">{errors.name}</span>
                            <Input
                                name={'brand'}
                                type="text"
                                placeholder="Enter Brand Name*"
                                label="Brand"
                                required={true}
                                value={productData?.brand}
                                parentDivCss="mt-3"
                                onChange={handleChange}
                            />
                            <span className="error-msg">{errors.brand}</span>
                            <SelectCustom
                                name={'category'}
                                options={options}
                                label="Category*"
                                required={true}                                
                                value={options.find(opt => opt.value === productData?.category)}
                                parentDivCss="mt-3"
                                onChange={handleChange}
                            />
                            <span className="error-msg">{errors.category}</span>
                            <div className="d-flex gap-2 align-items-center">
                                <Input
                                    name={'price'}
                                    type="number"
                                    placeholder="Enter Price"
                                    label="Price"
                                    required={true}
                                    value={productData?.price}
                                    parentDivCss="mt-3"
                                    onChange={handleChange}
                                />
                                <span className="error-msg">{errors.price}</span>
                                <Input
                                    name={'discount'}
                                    type="number"
                                    placeholder="Enter discount in %"
                                    label="Discount"
                                    required={true}
                                    value={productData?.discount}
                                    parentDivCss="mt-3"
                                    onChange={handleChange}
                                />
                                <span className="error-msg">{errors.discount}</span>
                                {/* <Input
                                    name={'discounted_price'}
                                    type="number"
                                    // placeholder="Enter Price*"
                                    label="Actual Price"
                                    required={true}
                                    value={productData?.discounted_price}
                                    parentDivCss="mt-3"
                                    onChange={handleChange}
                                />
                                <span className="error-msg">{errors.discounted_price}</span> */}
                            </div>

                            <Input
                                name={'stock'}
                                type="number"
                                placeholder="Enter Stock Quantity*"
                                label="Stock"
                                required={true}
                                value={productData?.stock}
                                parentDivCss="mt-3"
                                onChange={handleChange}
                            />
                            <span className="error-msg">{errors.stock}</span>
                            <TextArea
                                name={'description'}
                                label="Full Description"
                                placeholder="Enter full product description"
                                rows={5}
                                value={productData?.description}
                                parentDivCss="mt-3"
                                onChange={handleChange}
                            />
                            <span className="error-msg">{errors.description}</span>
                        </div>
                    </div>

                    <div className="d-flex justify-content-center mt-4">
                        <Button isLoading={isLoading} type="primary" label="Save" extraCss={"w-25"} onClick={handleAddProduct} />
                    </div>
                </>}
        </div>
    )
}
export default AddProduct