import { Link, useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import { Input, PasswordInput } from "../components/common/Input";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/slice/authSlicer";
import { ROUTES } from "../routes/routes";
import { toastEmitter } from "../utils/toastEmitter";
import { emailRegex, passwordRegex } from "../utils/regex-constant";
import { handleFormInput, handleFormPreRequisite, trimFormData } from "../utils/form-utils";
import axios from "axios";
import { ROLES_API_URL, STAFF_API_URL } from "../utils/api-constants";

const API_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyADlE9XtphNjvJg1YtSO3BU0DZ8MXwCQGE';

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
    const [isStaffLogin, setIsStaffLogin] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Staff Login Handler - UPDATED
    const handleStaffLogin = async () => {
        try {
            // Fetch all staff from Firebase
            const staffResponse = await axios.get(`${STAFF_API_URL}.json`);

            if (!staffResponse.data) {
                toastEmitter("error", "No staff records found");
                return false;
            }

            // Find staff by username or email and verify password
            let staffFound = null;
            let staffId = null;

            for (let key in staffResponse.data) {
                const staff = staffResponse.data[key];
                if ((staff.username === payload.email || staff.email === payload.email) &&
                    staff.password === payload.password) {

                    if (!staff.status) {
                        toastEmitter("error", "Your account is inactive. Contact administrator.");
                        return false;
                    }

                    staffFound = staff;
                    staffId = key;
                    break;
                }
            }

            if (!staffFound) {
                toastEmitter("error", "Invalid username/email or password");
                return false;
            }

            // Fetch role details with permissions
            let roleDetails = null;
            if (staffFound.role) {
                const roleResponse = await axios.get(`${ROLES_API_URL}/${staffFound.role}.json`);
                roleDetails = roleResponse.data;
            }

            // Staff login successful with full role details
            dispatch(login({
                user: {
                    displayName: staffFound.name,
                    email: staffFound.email,
                    roleId: staffFound.role,
                    roleName: roleDetails?.name || "Staff",
                    permissions: roleDetails?.permissions || [],
                    staffId: staffId,
                    isStaff: true
                },
                token: `staff_${staffId}` // Create a staff token identifier
            }));

            toastEmitter("success", `Welcome ${staffFound.name}!`);
            navigate(ROUTES.DASHBOARD);
            return true;

        } catch (err) {
            console.error("Staff login error:", err);
            toastEmitter("error", "Failed to authenticate staff");
            return false;
        }
    };


    // Regular Admin Login Handler
    const handleAdminLogin = async () => {
        try {
            const response = await axios.post(API_URL, payload);
            const token = response.data.idToken;

            dispatch(login({
                user: {
                    displayName: response.data.displayName,
                    email: response.data.email,
                    isStaff: false
                },
                token: token
            }));

            toastEmitter("success", "Login successful!");
            navigate(ROUTES.DASHBOARD);
            return true;

        } catch (err) {
            console.error("Admin login error:", err);
            toastEmitter("error", "Invalid email or password");
            return false;
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        // Checking for errors
        const updatedFormData = trimFormData(payload);
        setPayload(updatedFormData);
        const hasError = handleFormPreRequisite(payload, setPayload, formError, setFormError);
        if (hasError) return;

        setIsLoading(true);

        try {
            if (isStaffLogin) {
                // Staff login flow
                await handleStaffLogin();
            } else {
                // Admin login flow
                await handleAdminLogin();
            }
        } catch (err) {
            toastEmitter("error", "Unable to reach server");
            console.log("Login error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e, validate, errorMsg) => {
        const { updatedError, updatedValues } = handleFormInput(e, payload, formError, validate, errorMsg);
        setFormError(updatedError);
        setPayload(updatedValues);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="fw-bold">Login to account</h2>
                <h6 className="mt-2">
                    {isStaffLogin ? "Enter your username & password to login" : "Enter your email & password to login"}
                </h6>
                <form onSubmit={handleLogin}>
                    <div className="d-flex flex-column mt-4">
                        <Input
                            type={'text'}
                            name={'email'}
                            label={isStaffLogin ? "Username or Email" : "Email"}
                            value={payload.email}
                            onChange={(e) => handleInputChange(e, isStaffLogin ? null : emailRegex, isStaffLogin ? "" : "Email is invalid")}
                            parentDivCss={"mt-3"}
                            placeholder={isStaffLogin ? "Enter your username or email" : "Enter your email address"}
                        />
                        <span className="error-msg">{formError.email}</span>

                        <PasswordInput
                            label={"Password"}
                            name={"password"}
                            value={payload.password}
                            onChange={(e) => handleInputChange(e, passwordRegex, "Password is invalid")}
                            parentDivCss={"mt-4"}
                            placeholder={"Enter your password"}
                        />
                        <span className="error-msg">{formError.password}</span>

                        <div className="d-flex gap-2 align-items-center mt-3">
                            <input type="checkbox" id="remember_me" />
                            <label htmlFor="remember_me" className="cursor-pointer small">Keep me signed in</label>
                        </div>

                        <div className="d-flex gap-2 align-items-center mt-2">
                            <input
                                type="checkbox"
                                id="staff_login"
                                checked={isStaffLogin}
                                onChange={(e) => setIsStaffLogin(e.target.checked)}
                            />
                            <label htmlFor="staff_login" className="cursor-pointer small">
                                Login as Staff
                            </label>
                        </div>

                        <Link className="cursor-pointer align-self-end mt-2">Forget password?</Link>

                        <Button
                            isLoading={isLoading}
                            buttonType="submit"
                            type="primary"
                            label={"Login"}
                            extraCss={"mt-3"}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
