import { useState } from "react";
import DataTableCustom from "../../components/common/DataTableCustom";
import { Input } from "../../components/common/Input";
import Slider from "../../components/common/Slider";

const columns = [
  { name: 'S.No', selector: row => row.id, sortable: true ,center:true },
  { name: 'Customer Full Name', selector: row => row.fullName, sortable: true },
  { name: 'Order Number', selector: row => row.orderNumber, sortable: true },
  { name: 'Comment', selector: row => row.comment },
  { 
    name: 'Active', 
    selector: row => <Slider/>,
    
  },
  {
    name: 'Action',
    cell: row => <i className="bi bi-eye fs-4 cursor-pointer"></i>
  },
];


const data = [
  {
    id: 1,
    fullName: "Aman Verma",
    orderNumber: "ORD12345",
    comment: "Great service, very satisfied!",
    active: true,
    action: "View",
  },
  {
    id: 2,
    fullName: "Priya Sharma",
    orderNumber: "ORD12346",
    comment: "Item delivered late.",
    active: false,
    action: "View",
  },
  {
    id: 3,
    fullName: "Rohan Mehta",
    orderNumber: "ORD12347",
    comment: "Wrong product received.",
    active: true,
    action: "View",
  },
  {
    id: 4,
    fullName: "Simran Kaur",
    orderNumber: "ORD12348",
    comment: "Excellent packaging!",
    active: true,
    action: "View",
  },
  {
    id: 5,
    fullName: "Kunal Joshi",
    orderNumber: "ORD12349",
    comment: "Product quality not up to mark.",
    active: false,
    action: "View",
  },
  {
    id: 6,
    fullName: "Neha Patel",
    orderNumber: "ORD12350",
    comment: "Fast delivery. Happy!",
    active: true,
    action: "View",
  },
  {
    id: 7,
    fullName: "Varun Desai",
    orderNumber: "ORD12351",
    comment: "Received damaged item.",
    active: false,
    action: "View",
  },
  {
    id: 8,
    fullName: "Sneha Roy",
    orderNumber: "ORD12352",
    comment: "Loved the product. Will buy again.",
    active: true,
    action: "View",
  },
  {
    id: 9,
    fullName: "Aakash Singh",
    orderNumber: "ORD12353",
    comment: "Average experience.",
    active: true,
    action: "View",
  },
  {
    id: 10,
    fullName: "Divya Iyer",
    orderNumber: "ORD12354",
    comment: "Customer support was helpful.",
    active: true,
    action: "View",
  },
];


const Feedbacks = ()=>{
    // table states
        const [sortColumn, setSortColumn] = useState("");
        const [sortDirection, setSortDirection] = useState("");
        const [page, setPage] = useState(1);
        const [pending, setPending] = useState(false);
        const [pageSize, setPageSize] = useState(5);
        // +---------------------+
    return(
        <>
            <h3 className=" mb-4">All Feedbacks</h3>
            <div>
              under development
            </div>
            {/* <div className="outlet-container">
                <div className="row mb-3">
                    <div className="col-3 offset-9">
                    <Input type={"text"} label={"Search"} placeholder={""} required={true} />
                    </div>
                </div>

                <DataTableCustom
                    _tblColumns={columns}
                    _rowData={data}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    setPage={setPage}
                    setSortColumn={setSortColumn}
                    setSortDirection={setSortDirection}
                    pending={pending}
                    setPending={setPending}
                />

            </div> */}
    </>
    )
}

export default Feedbacks