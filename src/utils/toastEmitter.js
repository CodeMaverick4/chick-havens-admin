import { toast } from "react-toastify";

export const toastEmitter = (type = "info", message = "") => {
  let customClass = "toast-custom-size";
  switch (type) {
    case "success":
      toast.success(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: "light",
        className: "toast_base toast_success",
      });
      break;
    case "warn":
      toast.warn(message, {
        icon: <i className="bi bi-exclamation-octagon fs-4"></i>,
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: "light",        
        className: "toast_base toast_info",
      });
      break;

    case "error":
      toast.error(message, {
        icon: <i className="bi bi-exclamation-octagon fs-4"></i>,
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: "light",        
        className: "toast_base toast_error",
      });
      break;
    case "info":
      toast.info(message, {
        icon: <i className="bi bi-exclamation-octagon fs-4"></i>,
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        // theme: "light",        
        className: "toast_base toast_info",
        
      });
      break;
    default:
      toast(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: "light",        
        className: "toast_base",
      });
      break;
  }
};

