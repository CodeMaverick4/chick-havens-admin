import React from "react"

const ButtonLoader = () => {
    return (
        <div className="spinner-border text-primary" role="status">
            {/* <span class="sr-only">Loading...</span> */}
        </div>
    )
}
const TableLoader = (isLoading) => {
    return (
         <div
      className={`loader-wrapper ${isLoading ? "fade-in" : "fade-out"}`}
      style={{ height: "300px" }}
    >
            <div className="spinner-border text-primary" role="status">                
            </div>
        </div>
    )
}
export default React.memo(ButtonLoader)
export { TableLoader }