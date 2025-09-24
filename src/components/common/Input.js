import React, { useState } from "react"

const Input = ({ value, type, placeholder, label, name, parentDivCss = "", onChange = () => { }, required = false }) => {
    return (
        <div className={`input_container ${parentDivCss}`}>
            <span className="input_label_pos">{label}{required && <span className="required-star"> * </span>}</span>
            <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} />
        </div>
    )
}

const PasswordInput = ({ value, placeholder, label, parentDivCss = "", name, onChange = () => { }, required = false }) => {
    const [showPassword, setShowPassword] = useState(false);    
    return (
        <div className={`input_container ${parentDivCss}`}>
            <span className="input_label_pos">{label}{required && <span className="required-star"> * </span>}</span>
            <div className="d-flex ">
                <input type={showPassword ? "text" : "password"} value={value} name={name} onChange={onChange} placeholder={placeholder} autoComplete="current-password" />
                <div className="input_field_right_icon" onClick={() => setShowPassword(prev => !prev)}>
                    <i className={`bi  fs-4 ${showPassword ? "bi-eye-fill" : "bi-eye-slash-fill"}`}></i>
                </div>
            </div>
        </div>
    )
}

const TextArea = ({value,name, placeholder, label, parentDivCss = "", onChange = () => { }, required = false }) => {
    return (
        <div className={`input_container ${parentDivCss}`}>
            <span className="input_label_pos">{label}{required && <span className="required-star"> * </span>}</span>
            <textarea rows={3} onChange={onChange} name={name} placeholder={placeholder} value={value} />
        </div>
    )
}

const MemoizedInput = React.memo(Input)
export { PasswordInput, MemoizedInput as Input, TextArea }