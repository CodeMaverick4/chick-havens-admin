const Card = ({ title, val, img, icon }) => {
    return (
        <div className="dashboard-card cmn-shadow">
            <div className="position-relative">
                {img}
                {icon}
            </div>
            <div className="d-flex flex-column">
                {/* <h5>{title}</h5> */}
                <span>{title}</span>
                <h4>{val}</h4>
            </div>
        </div>
    )
}

export default Card