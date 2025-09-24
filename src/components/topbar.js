import { useEffect, useState } from "react"
import { BELL, SIDEBARMENU, USER } from "../utils/image-constants"
import { useDispatch } from "react-redux"
import { logout } from "../redux/slice/authSlicer"

export const Topbar = ({ sidebarCollapse, setSidebarCollapse }) => {
    const [showDropmenu, setShowDropmenu] = useState(false)
    const dispatch = useDispatch();

    useEffect(() => {
        const clickOutside = () => {
            setShowDropmenu(false);
        }
        document.addEventListener('click', clickOutside);
        return () => document.removeEventListener('click', clickOutside);
    }, []);

    const handleLogout = ()=>{
        dispatch(logout())
    }

    // console.log("topbar render..")
    return (
        <div className={`topbar ${sidebarCollapse ? 'expand' : ''} cmn-shadow `}>
            <div onClick={() => setSidebarCollapse(prev => !prev)}>
                {sidebarCollapse ? <SIDEBARMENU right={true} /> : ""}
            </div>
            <div className="position-relative d-flex align-items-center gap-2 cursor-pointer" onClick={(e) => {
                e.stopPropagation()
                setShowDropmenu(prev => !prev)
            }
            }>
                <img src="/assets/test-user.jpg" alt="" height={52} width={54} className="rounded-circle" />
                <div className="d-md-block d-none">
                    <p className="fw-bold">Parag Sharma</p>
                    <span className="text-body-secondary small fw-light">Admin</span>
                </div>

                {showDropmenu &&
                    <div className="topbar_dropmenu cmn-shadow" onClick={(e) => e.stopPropagation()}>
                        <li><i class="bi bi-person-fill fs-5"></i> Account</li>
                        <li><i class="bi bi-gear-fill fs-5"></i> Setting</li>
                        <li onClick={handleLogout}><i class="bi bi-box-arrow-left fs-5"></i> Logout</li>
                    </div>}
            </div>
        </div>
    )
} 