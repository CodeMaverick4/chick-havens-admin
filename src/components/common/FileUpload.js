import { useRef, useState } from "react"
import { toastEmitter } from "../../utils/toastEmitter";
import { uploadFile } from "../../services/api-service";
import { API_URL } from "../../services/api-url-constant";
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const FileUpload = ({ setImageUrl = () => { }, name = "", imageurl = null, folderName = "", clearFormError = () => { } }) => {

    const inputRef = useRef(null)

    const handleClick = () => {
        inputRef.current?.click();
    }
    const handleFileUpload = async (e) => {
        const file = e.target.files[0]
        if (file?.size > MAX_FILE_SIZE) {
            toastEmitter("error", "Please upload image of size less than 10MB");
            e.target.value = "";
            return
        }

        if (file) {

            const formData = new FormData();
            if (imageurl) {
                formData.append("old_image", imageurl);
            }            
            formData.append("image", file);

            try {
                const response = await uploadFile(formData,folderName);
                setImageUrl(response.data.data)
                toastEmitter("success", response.data.message)
                clearFormError();
            } catch (err) {
                toastEmitter("error", err.response.message)
                console.log("error", err.response.message)
            }
        }
        
    }

    return (
        <div className={`file_upload_field cursor-pointer ${imageurl ? 'py-3' : 'py-2 px-3'}`} onClick={handleClick}>
            {imageurl ? <img src={`${API_URL.imageUrl}${imageurl}`} width={100} height={100} /> : <i className="bi bi-cloud-arrow-up-fill fs-1"></i>}
            {!imageurl && 
                <p className="text-center">Drop your images here or select <span>click to browse</span></p>
            }            
            <input name={name} ref={inputRef} type="file" id="" hidden onChange={handleFileUpload} accept=".png,.jpg.jpeg" />
        </div>
    )

}
export default FileUpload