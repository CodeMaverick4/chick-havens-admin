import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { STAFF_API_URL, ROLES_API_URL } from "../../utils/api-constants";
import { Input } from "../../components/common/Input";
import Button from "../../components/common/Button";
import axios from "axios";
import SelectCustom from "../../components/common/selectCustom";
import { toastEmitter } from "../../utils/toastEmitter";

const STATUS_OPTIONS = [
  { label: "Active", value: true },
  { label: "Inactive", value: false },
];

const AddStaff = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const staffId = location.state?.staffId;

  const [isLoading, setIsLoading] = useState(false);
  const [roleOptions, setRoleOptions] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    phone: "",
    username: "",
    password: "",
    status: true,
  });
  const [errors, setErrors] = useState({});

  // Fetch roles from API
  const loadRoles = async () => {
    try {
      const resp = await axios.get(`${ROLES_API_URL}.json`);
      let arr = [];
      for (let key in resp.data) {
        // Only show active roles
        if (resp.data[key].status) {
          arr.push({
            label: resp.data[key].name,
            value: key
          });
        }
      }
      console.log(arr);
      setRoleOptions(arr);
    } catch (err) {
      toastEmitter("error", "Failed to load roles");
      console.error("Error loading roles:", err);
    }
  };

  // Fetch staff data if edit mode
  const loadStaff = async () => {
    if (!staffId) return;
    setIsLoading(true);
    try {
      const resp = await axios.get(`${STAFF_API_URL}/${staffId}.json`);
      if (resp.data) {
        // Don't load password for security reasons
        setForm({ ...resp.data, password: "" });
      }
    } catch (err) {
      toastEmitter("error", "Failed to load staff data");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadRoles(); // Load roles on component mount
    loadStaff(); // Load staff data if editing
  }, [staffId]);

  // Input handler
  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Dropdown handler - updated to use name parameter
  const handleSelectChange = (value, name) => {
    setForm({ ...form, [name]: value });
  };

  // Validation
  const validate = () => {
    let err = {};
    if (!form.name) err.name = "Name is required";
    if (!form.email) err.email = "Email is required";
    if (!form.role) err.role = "Role is required";
    if (!form.phone) err.phone = "Phone is required";
    if (!form.username) err.username = "Username is required";
    
    // Password is required only when adding new staff
    if (!staffId && !form.password) {
      err.password = "Password is required";
    }
    
    // Password validation (if provided)
    if (form.password && form.password.length < 6) {
      err.password = "Password must be at least 6 characters";
    }
    
    return err;
  };

  // Save handler
  const handleSave = async () => {
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length) return;
    setIsLoading(true);
    try {
      // Create data object
      let dataToSave = { ...form };
      
      // If editing and password is empty, don't update password
      if (staffId && !form.password) {
        delete dataToSave.password;
      }
      
      if (staffId) {
        await axios.put(`${STAFF_API_URL}/${staffId}.json`, dataToSave);
        toastEmitter("success", "Staff updated successfully");
      } else {
        await axios.post(`${STAFF_API_URL}.json`, dataToSave);
        toastEmitter("success", "Staff created successfully");
      }
      navigate("/staff");
    } catch (err) {
      toastEmitter("error", "Failed to save staff");
    }
    setIsLoading(false);
  };

  return (
    <div className="outlet-container">
      <div className="pb-4 mb-3 border-bottom border-bottom-1 d-flex justify-content-between align-items-center">
        <h3>{staffId ? "Edit" : "Add New"} Staff</h3>
        <Button label="Back" onClick={() => navigate("/staff")} icon={<i className="bi bi-arrow-left"></i>} />
      </div>
      {isLoading ? (
        <p>Loading....</p>
      ) : (
        <>
          <div className="row">
            <div className="col-md-6">
              <Input
                name="name"
                type="text"
                placeholder="Enter Staff Name*"
                label="Staff Name"
                required={true}
                value={form.name}
                parentDivCss="mt-3"
                onChange={handleChange}
              />
              <span className="error-msg">{errors.name}</span>
              
              <Input
                name="email"
                type="email"
                placeholder="Enter Email*"
                label="Email"
                required={true}
                value={form.email}
                parentDivCss="mt-3"
                onChange={handleChange}
              />
              <span className="error-msg">{errors.email}</span>
              
              <Input
                name="phone"
                type="text"
                placeholder="Enter Phone*"
                label="Phone"
                required={true}
                value={form.phone}
                parentDivCss="mt-3"
                onChange={handleChange}
              />
              <span className="error-msg">{errors.phone}</span>
              
              <Input
                name="username"
                type="text"
                placeholder="Enter Username*"
                label="Username"
                required={true}
                value={form.username}
                parentDivCss="mt-3"
                onChange={handleChange}
              />
              <span className="error-msg">{errors.username}</span>
            </div>
            
            <div className="col-md-6">
              <SelectCustom
                name="role"
                options={roleOptions}
                label="Role*"
                required={true}
                value={roleOptions.find(opt => opt.value === form.role)}
                parentDivCss="mt-3"
                onChange={handleSelectChange}
              />
              <span className="error-msg">{errors.role}</span>
              
              <SelectCustom
                name="status"
                options={STATUS_OPTIONS}
                label="Status"
                required={true}
                value={STATUS_OPTIONS.find(opt => opt.value === form.status)}
                parentDivCss="mt-3"
                onChange={handleSelectChange}
              />
              
              <Input
                name="password"
                type="password"
                placeholder={staffId ? "Enter new password (leave blank to keep current)" : "Enter Password*"}
                label={staffId ? "Password (Optional)" : "Password"}
                required={!staffId}
                value={form.password}
                parentDivCss="mt-3"
                onChange={handleChange}
              />
              <span className="error-msg">{errors.password}</span>
              
              {staffId && (
                <small className="text-muted d-block mt-1">
                  Leave password blank to keep the current password
                </small>
              )}
            </div>
          </div>
          
          <div className="d-flex justify-content-center mt-4">
            <Button isLoading={isLoading} type="primary" label="Save" extraCss="w-25" onClick={handleSave} />
          </div>
        </>
      )}
    </div>
  );
};

export default AddStaff;
