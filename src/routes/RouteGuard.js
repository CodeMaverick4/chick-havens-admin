import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import { ROUTES } from "./routes"

const ProtectedRoute = ({children})=>{    
    const isToken = useSelector(state=> state.auth?.token)
    // console.log(isToken)
    return isToken ? children : <Navigate to={ROUTES.LOGIN}/>
}

const PublicRoute = ({children})=>{
    const isToken = useSelector(state=> state.auth?.token)
    return !isToken ? children : <Navigate to={ROUTES.DASHBOARD}/>
} 

export default ProtectedRoute
export {PublicRoute}