import DataTable from "react-data-table-component";
import { TableLoader } from "./Loader";
import React from "react";

const DataTableCustom = ({
  tableHeading = "",
  isLoading = true,
  _tblColumns = [],
  _rowData = [],
  expandableRows = false,
  expandableRowsComponent = null,
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
      },
    },
    headCells: { style: { padding: "11px 12px" } },
    rows: {
      style: {
        fontSize: "14px",
        backgroundColor: "#fff",
        minHeight: "45px",
        borderBottom: "1px solid #eaeaea",
      },
      highlightOnHoverStyle: {
        backgroundColor: "#f3f8ff",
        borderBottomColor: "#d0e2ff",
        outline: "1px solid #c8defc",
      },
    },
    cells: { style: { padding: "11px 12px" } },
  };

  return (
    <div className="">
      {tableHeading && <h4 className="pb-4 border-bottom mb-3">{tableHeading}</h4>}
      <DataTable
        columns={_tblColumns}
        data={_rowData}
        pagination
        responsive
        customStyles={tableCustomStyles}
        progressPending={isLoading}
        progressComponent={<TableLoader />}
        expandableRows={expandableRows}
        expandableRowsComponent={expandableRowsComponent}
        highlightOnHover
      />
    </div>
  );
};

export default React.memo(DataTableCustom);
