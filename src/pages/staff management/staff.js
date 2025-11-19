import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import DataTableCustom from "../../components/common/DataTableCustom";
import { useEffect, useState } from "react";
import { STAFF_API_URL } from "../../utils/api-constants";
import axios from "axios";
import { ROUTES } from "../../routes/routes";

const Staff = () => {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const columns = [
    { name: 'S.No', selector: (row, index) => index + 1, width: "60px" },
    { name: 'Name', selector: row => row.name, sortable: true },
    { name: 'Email', selector: row => row.email, sortable: true },
    { name: 'Role', selector: row => row.role, sortable: true },
    { name: 'Phone', selector: row => row.phone, sortable: true },
    { name: 'Status', selector: row => row.status ? 'Active' : 'Inactive', sortable: true },
    {
      name: 'Action', cell: row => (
        <div className="d-flex gap-2 fs-5">
          <i className="bi bi-pen datatable_edit_icon" onClick={() => handleNavigate(row.id)}></i>
          <i className="bi bi-trash-fill text-danger cursor-pointer" onClick={() => handleRemoveStaff(row.id)}></i>
        </div>
      ), center: true, width:'100px'
    }
  ];

  const handleNavigate = (id) => {
    navigate(ROUTES.ADDSTAFF, { state: { staffId: id } });
  };

  // GET STAFF
  const loadStaff = async () => {
    setIsLoading(true);
    // Use Firebase SDK or REST API appropriately
    try {
      const resp = await axios.get(`${STAFF_API_URL}.json`);
      let arr = [];
      for (let key in resp.data) {
        arr.push({ ...resp.data[key], id: key });
      }
      setRows(arr);
    } catch (err) {
      // handle error
    }
    setIsLoading(false);
  };

  // REMOVE STAFF
  const handleRemoveStaff = async (id) => {
    try {
      await axios.delete(`${STAFF_API_URL}/${id}.json`);
      setRows(rows.filter(staff => staff.id !== id));
    } catch (err) {
      // handle error
    }
  }

  useEffect(() => {
    loadStaff();
  }, []);

  return (
    <>
      <h4 className="mb-4">Staff Members</h4>
      <div className="outlet-container">
        <div className="d-flex justify-content-between mb-4">
          <input type="text" className="form-control w-25" placeholder="Search Staff..." onChange={e=>setSearchValue(e.target.value)} />
          <Button type="primary" label="Add Staff" onClick={() => navigate(ROUTES.ADDSTAFF)} />
        </div>
        <DataTableCustom
          tableHeading="All Staff"
          _tblColumns={columns}
          _rowData={rows}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};

export default Staff;
