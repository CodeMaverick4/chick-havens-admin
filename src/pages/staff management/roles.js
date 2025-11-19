import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import DataTableCustom from "../../components/common/DataTableCustom";
import { useEffect, useState } from "react";
import { ROLES_API_URL } from "../../utils/api-constants";
import axios from "axios";
import { toastEmitter } from "../../utils/toastEmitter";
import { ROUTES } from "../../routes/routes";

const Roles = () => {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const columns = [
    { name: 'S.No', selector: (row, index) => index + 1, width: "60px" },
    { name: 'Role Name', selector: row => row.name, sortable: true },
    { name: 'Description', selector: row => row.description, sortable: true },
    { 
      name: 'Permissions', 
      selector: row => row.permissions ? row.permissions.join(", ") : "None", 
      sortable: false,
      wrap: true 
    },
    { 
      name: 'Status', 
      selector: row => row.status ? 'Active' : 'Inactive', 
      sortable: true,
      width: '100px',
      center: true 
    },
    {
      name: 'Action', 
      cell: row => (
        <div className="d-flex gap-2 fs-5">
          <i className="bi bi-pen datatable_edit_icon" onClick={() => handleNavigate(row.id)}></i>
          <i className="bi bi-trash-fill text-danger cursor-pointer" onClick={() => handleRemoveRole(row.id)}></i>
        </div>
      ), 
      center: true, 
      width:'100px'
    }
  ];

  const handleNavigate = (id) => {
    navigate(ROUTES.ADDROLES, { state: { roleId: id } });
  };

  // GET ROLES
  const loadRoles = async () => {
    setIsLoading(true);
    try {
      const resp = await axios.get(`${ROLES_API_URL}.json`);
      let arr = [];
      for (let key in resp.data) {
        arr.push({ ...resp.data[key], id: key });
      }
      setRows(arr);
    } catch (err) {
      toastEmitter("error", "Unable to load roles");
    }
    setIsLoading(false);
  };

  // REMOVE ROLE
  const handleRemoveRole = async (id) => {
    try {
      await axios.delete(`${ROLES_API_URL}/${id}.json`);
      setRows(rows.filter(role => role.id !== id));
      toastEmitter("success", "Role removed successfully");
    } catch (err) {
      toastEmitter("error", "Failed to remove role");
    }
  }

  useEffect(() => {
    loadRoles();
  }, []);

  return (
    <>
      <h4 className="mb-4">Roles Management</h4>
      <div className="outlet-container">
        <div className="d-flex justify-content-between mb-4">
          <input 
            type="text" 
            className="form-control w-25" 
            placeholder="Search Roles..." 
            onChange={e=>setSearchValue(e.target.value)} 
          />
          <Button type="primary" label="Add Role" onClick={() => navigate(ROUTES.ADDROLES)} />
        </div>
        <DataTableCustom
          tableHeading="All Roles"
          _tblColumns={columns}
          _rowData={rows}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};

export default Roles;
