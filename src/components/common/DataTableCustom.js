import DataTable from 'react-data-table-component';
import ButtonLoader, { TableLoader } from './Loader';
import React from 'react';

const DataTableCustom = ({
  tableHeading = "",
  isLoading = true,
  _tblColumns = [],
  _rowData = [],
  // _totalRows,
  // _paginationPerPage = 10,
  // paginationServer = true,
  // setPayload = () => { },
  
}) => {

  const tableCustomStyles = {
    table: {
      style: {
        borderSpacing: "0",
        borderCollapse: "separate",
        borderRadius: "12px",        
        fontFamily: "'Inter', sans-serif",        
      },
    },
    headRow: {
      style: {
        backgroundColor: "#f6f9fc",
        fontWeight: "600",
        fontSize: "14px",
        color: "#000",
        borderRadius: "12px",
        marginBottom: '10px'
      },
    },
    headCells: {
      style: {
        padding: "11px 12px",
      },
    },
    rows: {
      style: {
        fontSize: "14px",
        fontWeight: '400',
        backgroundColor: "#fff",
        minHeight: "40px",
        borderRadius: "12px",
        boxShadow: "none",
        border: 'none !important',
        marginBottom: '1px',
        '&:nth-of-type(odd)': {
          backgroundColor: "#f5f9fd",
        },        
      },
    },
    cells: {
      style: {
        padding: "11px 12px",
      },
    },
  };

  // const handleOnChangePage = (page) => {
  //   setPayload(prev => ({ ...prev, pageIndex: page }))
  // }

  // const handleOnRowsPerPage = (newPerPage, page) => {    
  //   setPayload(prev => ({ ...prev, pageSize: newPerPage, pageIndex: page }))
  // }

  // const handleSort = (column, sortDirection) => {
  //   console.log("in row",column,sortDirection)
  //   setPayload(prev => ({ ...prev, direction: sortDirection, filterByFieldName: column.sortField || 'id'}))
  // }

  console.log("data table rendring....");
  return (
    <div className="">
      {tableHeading && <h4 className='pb-4 border-bottom mb-3'>{tableHeading}</h4>}
      <DataTable        
        columns={_tblColumns}
        data={_rowData}
        pagination={true}
        // paginationServer={paginationServer}
        // paginationComponent={customPagination}
        // paginationTotalRows={_totalRows}
        // paginationPerPage={_paginationPerPage}
        // onChangePage={handleOnChangePage}
        // onChangeRowsPerPage={handleOnRowsPerPage}

        responsive={true}
        customStyles={tableCustomStyles}
        // sorting 

        // sortIcon={<i className="bi bi-arrow-down-up ms-2"></i>}
        // sortServer 
        // onSort={handleSort}

        // loading spinner
        progressPending={isLoading}
        progressComponent={<TableLoader />}
      />
    </div>
  )
}

// const customPagination = ({ rowsPerPage, rowCount, onChangePage, currentPage ,onChangeRowsPerPage}) => {
//   const totalPages = Math.ceil(rowCount / rowsPerPage)
//   const start = (currentPage - 1) * rowsPerPage + 1;
// const end = Math.min(currentPage * rowsPerPage, rowCount);

//   const handleBack = () => {
//     if (currentPage > 1) onChangePage(currentPage - 1);
//   };

//   const handleNext = () => {
//     if (currentPage < totalPages) onChangePage(currentPage + 1);
//   };
//   return (
//     <div className='custom_pagination'>
//       <div className='d-flex align-items-center gap-3'>
//         <label className='d-md-block d-none'>Showing {start} - {end} of {rowCount} records</label>
//         {/* <label htmlFor="" className='d-md-block d-none'>of {rowCount} records</label> */}
//         {rowCount > 5 && <select name="" id="" value={rowsPerPage} onChange={(e)=>onChangeRowsPerPage(Number(e.target.value),1)}>          
//           <option value={5}>5</option>
//           <option value={10}>10</option>
//           <option value={25}>25</option>
//           <option value={50}>50</option>
//           <option value={100}>100</option>
//         </select>}
        
//       </div>

//       <div className='page_number'>
//         <div onClick={handleBack}><i className="bi bi-chevron-left"></i></div>
//         <div className={` ${currentPage - 1 === 0 && 'd-none'}`}>{currentPage - 1}</div>
//         <div className={`current_page_number `}>{currentPage}</div>
//         <div className={` ${currentPage + 1 >= totalPages && 'd-none'}`}>{currentPage + 1}</div>
//         <div onClick={handleNext}><i className="bi bi-chevron-right"></i></div>
//       </div>
//     </div>
//   )
// }
export default React.memo(DataTableCustom);