import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ROLES_API_URL } from "../../utils/api-constants";
import Button from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { TextArea } from "../../components/common/Input";
import axios from "axios";
import { toastEmitter } from "../../utils/toastEmitter";
import SelectCustom from "../../components/common/selectCustom";

// Available permissions - customize as needed
const AVAILABLE_PERMISSIONS = [
  { label: "View Dashboard", value: "view_dashboard" },
  { label: "Manage Products", value: "manage_products" },
  { label: "Manage Staff", value: "manage_staff" },
  { label: "Manage Orders", value: "manage_orders" },
  { label: "Manage Customers", value: "manage_customers" },
  { label: "Manage Categories", value: "manage_categories" },
  { label: "View Reports", value: "view_reports" },
  { label: "Manage Settings", value: "manage_settings" },
];

const STATUS_OPTIONS = [
  { label: "Active", value: true },
  { label: "Inactive", value: false },
];

const AddRole = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const roleId = location.state?.roleId;

  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    permissions: [],
    status: true,
  });
  const [errors, setErrors] = useState({});

  // Fetch role data if edit mode
  const loadRole = async () => {
    if (!roleId) return;
    setIsLoading(true);
    try {
      const resp = await axios.get(`${ROLES_API_URL}/${roleId}.json`);
      if (resp.data) setForm(resp.data);
    } catch (err) {
      toastEmitter("error", "Failed to load role data");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadRole();
  }, [roleId]);

  // Input handler
  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Status handler
  const handleStatusChange = selectedOption => {
    setForm({ ...form, status: selectedOption.value });
  };

  // Permission checkbox handler
  const handlePermissionToggle = (permission) => {
    const currentPermissions = form.permissions || [];
    if (currentPermissions.includes(permission)) {
      setForm({ 
        ...form, 
        permissions: currentPermissions.filter(p => p !== permission) 
      });
    } else {
      setForm({ 
        ...form, 
        permissions: [...currentPermissions, permission] 
      });
    }
  };

  // Validation
  const validate = () => {
    let err = {};
    if (!form.name) err.name = "Role name is required";
    if (!form.description) err.description = "Description is required";
    if (!form.permissions || form.permissions.length === 0) {
      err.permissions = "At least one permission is required";
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
      if (roleId) {
        await axios.put(`${ROLES_API_URL}/${roleId}.json`, form);
        toastEmitter("success", "Role updated successfully");
      } else {
        await axios.post(`${ROLES_API_URL}.json`, form);
        toastEmitter("success", "Role created successfully");
      }
      navigate("/roles");
    } catch (err) {
      toastEmitter("error", "Failed to save role");
    }
    setIsLoading(false);
  };

  return (
    <div className="outlet-container">
      <div className="pb-4 mb-3 border-bottom border-bottom-1 d-flex justify-content-between align-items-center">
        <h3>{roleId ? "Edit" : "Add New"} Role</h3>
        <Button 
          label="Back" 
          onClick={() => navigate("/roles")} 
          icon={<i className="bi bi-arrow-left"></i>} 
        />
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
                placeholder="Enter Role Name*"
                label="Role Name"
                required={true}
                value={form.name}
                parentDivCss="mt-3"
                onChange={handleChange}
              />
              <span className="error-msg">{errors.name}</span>

              <TextArea
                name="description"
                label="Description*"
                placeholder="Enter role description"
                rows={4}
                value={form.description}
                parentDivCss="mt-3"
                onChange={handleChange}
              />
              <span className="error-msg">{errors.description}</span>

              <SelectCustom
                name="status"
                options={STATUS_OPTIONS}
                label="Status"
                required={true}
                value={STATUS_OPTIONS.find(opt => opt.value === form.status)}
                parentDivCss="mt-3"
                onChange={handleStatusChange}
              />
            </div>

            <div className="col-md-6">
              <div className="">
                <label className="form-label fw-semibold">
                  Permissions* <span className="text-danger">*</span>
                </label>
                <div className="border rounded p-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {AVAILABLE_PERMISSIONS.map((perm) => (
                    <div key={perm.value} className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={perm.value}
                        checked={form.permissions?.includes(perm.value)}
                        onChange={() => handlePermissionToggle(perm.value)}
                      />
                      <label className="form-check-label" htmlFor={perm.value}>
                        {perm.label}
                      </label>
                    </div>
                  ))}
                </div>
                <span className="error-msg">{errors.permissions}</span>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-center mt-4">
            <Button 
              isLoading={isLoading} 
              type="primary" 
              label="Save" 
              extraCss="w-25" 
              onClick={handleSave} 
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AddRole;
