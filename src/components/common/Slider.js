import { useState } from "react"

const Slider = ({status,onClick}) => {
        // console.log(status)
//     const [status,setStatus ] = useState(false)
    return (        
        <div className={`switch ${status ? 'on' : ""} cursor-pointer`} title="Toggle status" onClick={onClick}>            
                <div ></div>                        
                <span>{status ? "Active": "Inactive"}</span>                            
        </div>
        )
}

export default Slider