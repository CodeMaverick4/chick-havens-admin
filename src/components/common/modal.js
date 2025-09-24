
const Modal = ({ show, onClose=()=>{}, title, children }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>        
        
        <span className="modal-close" onClick={onClose}>&times;</span>

        {title && <h3>{title}</h3>}
        
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
