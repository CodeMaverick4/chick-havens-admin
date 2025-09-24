import { useState } from 'react'
import Sidebar from '../components/sidebar/sidebar';
import { Topbar } from '../components/topbar';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  const [sidebarCollapse, setSidebarCollapse] = useState(false)

  return (
      <div className="d-flex justify-content-end ">
          <Sidebar sidebarCollapse={sidebarCollapse} setSidebarCollapse={setSidebarCollapse} />                
          <div className={`main-content ${sidebarCollapse && "expand"}`}>
            <Topbar sidebarCollapse={sidebarCollapse} setSidebarCollapse={setSidebarCollapse}/>
            <div className='py-md-3 px-md-4 px-3 py-4 overflow-y-auto'>                
                <Outlet />
            </div>
          </div>
      </div> 

  )
}