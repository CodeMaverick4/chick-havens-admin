
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import { Input, PasswordInput } from "../components/common/Input";
import { useState } from "react";
import { useDispatch} from "react-redux";
import { login } from "../redux/slice/authSlicer";

import { ROUTES } from "../routes/routes";
import { toastEmitter } from "../utils/toastEmitter";
import { emailRegex, passwordRegex } from "../utils/regex-constant";
import { handleFormInput, handleFormPreRequisite, trimFormData } from "../utils/form-utils";
import axios from "axios";

const API_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyADlE9XtphNjvJg1YtSO3BU0DZ8MXwCQGE'

const Login = () => {    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [payload, setPayload] = useState({
        email: "",
        password: "",
        returnSecureToken: true
    });
    const [formError, setFormError] = useState({
        email: "",
        password: ""
    });

    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault();
        // checking for erros 
        const updatedFormData = trimFormData(payload);
        setPayload(updatedFormData);
        const hasError = handleFormPreRequisite(payload,setPayload,formError,setFormError);
        if(hasError) return;
        // calling api 
        try {
            setIsLoading(true);            
            const response = await axios.post(API_URL,payload);            
            const token = response.data.idToken;            
            dispatch(login({
                user: {displayName:response.data.displayName, email:response.data.email}, token: token
            }));            
            navigate(ROUTES.DASHBOARD);            
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            toastEmitter("error","Unable to reach server.")
            console.log("err -->", err.message);
        }
    }

    const handleInputChange = (e, validate, errorMsg) => {
        const { updatedError, updatedValues } = handleFormInput(e, payload, formError, validate, errorMsg);     
        setFormError(updatedError);
        setPayload(updatedValues);
    }
    
    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="fw-bold">Login to account</h2>
                <h6 className="mt-2">Enter your email & password to login</h6>
                <form onSubmit={handleLogin}>
                <div className="d-flex flex-column mt-4">                                    
                    <Input type={'text'} name={'email'} label={"Email"} value={payload.email} onChange={(e) => handleInputChange(e, emailRegex, "Email is invalid")} parentDivCss={"mt-3"} placeholder={"Enter your email address"} />
                    <span className="error-msg">{formError.email}</span>

                    <PasswordInput label={"Password"} name={"password"} value={payload.password} onChange={(e) => handleInputChange(e, passwordRegex, "Password is invalid")} parentDivCss={"mt-4"} placeholder={"Enter your password"} />
                    <span className="error-msg">{formError.password}</span>

                    <div className="d-flex gap-2 align-items-center mt-3">
                        <input type="checkbox" id="remember_me" />
                        <label htmlFor="remember_me" className="cursor-pointer small">Keep me signed in</label>
                    </div>
                    <Link className="cursor-pointer align-self-end">Forget password?</Link>
                    <Button isLoading={isLoading} buttonType="submit" type="primary" label={"Login"} extraCss={"mt-3"} />
                </div>
                </form>
            </div>
        </div>
    )
}

export default Login