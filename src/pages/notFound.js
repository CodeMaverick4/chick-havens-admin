import { Link } from "react-router-dom"
import { ROUTES } from "../routes/routes"

const NotFound = ()=>{
    return(
        <div>
            page not found

            <Link to={ROUTES.LOGIN}>Navigate to login</Link>
        </div>
    )
}

export default NotFound