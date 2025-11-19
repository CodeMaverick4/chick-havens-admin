// import { useState } from "react";
// import sidebar_menu from "./menu-constant";
// import { LOGO, SIDEBARMENU } from "../../utils/image-constants";
// import { useLocation, useNavigate } from "react-router-dom";

// export default function Sidebar({ sidebarCollapse, setSidebarCollapse }) {
//   const [openMenu, setOpenMenu] = useState('');
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleToggleDropdown = (menuToOpen,path) => {
//     if(path){
//       navigate(path);
//       return
//     }
//     if (openMenu === menuToOpen) {
//       setOpenMenu('')
//       return
//     }
//     setOpenMenu(menuToOpen)
//   }

//   const handleNavigate = (e, path) => {
//     e.stopPropagation();
//     navigate(path);
//   }


//   return (
//     <div className={`px-0 vh-100 sidebar ${sidebarCollapse ? "hide" : ""}`} onClick={(e) => e.stopPropagation()}>
//       <div className="d-flex justify-content-between align-items-center px-2 mt-3 mb-4 ">
//         {/* <img src={LOGO} alt="Profile" /> */}
//         <h4>Ecommers</h4>
//         <div onClick={() => setSidebarCollapse(prev => !prev)}><SIDEBARMENU /></div>
//       </div>
//       <div className="ps-3 pe-2 pb-2">
//         {sidebar_menu.map((menu, index) => (
//           <div key={`sidebar_key${index}`} className="mb-2" onClick={() => handleToggleDropdown(menu.section,menu?.path)}>
//             {/* section div  */}
//             <div className={`sidebar_item position-relative  ${openMenu === menu.section ? 'sidebar_item_active' : ''}  ${location.pathname.includes(menu.section.toLowerCase()) ? "active" : ""}`}>
//               <div className="d-flex align-items-center gap-3">
//                 {menu.icon}
//                 <span>{menu.section}</span>
//               </div>
//               {menu.path ? '': <i className={` ${openMenu === menu.section ? "rotate-up" : "rotate-down"} bi bi-chevron-down`}></i> }
//             </div>
//             {/* sub menu  */}
//             {menu?.items && <ul className={`sidebar_submenu ms-3 ${openMenu === menu.section ? 'show' : 'hide'}`}>
//               {menu.items.map((subMenu, index) => (
//                 <li key={`${index}`} className={` cursor-pointer ${location.pathname.includes(subMenu.path) ? 'active' : ""} `} onClick={(e) => handleNavigate(e, subMenu.path)}>{subMenu.label}</li>
//               ))}
//             </ul>}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }



import { useState } from "react";
import { useSelector } from "react-redux";
import sidebar_menu from "./menu-constant";
import { LOGO, SIDEBARMENU } from "../../utils/image-constants";
import { useLocation, useNavigate } from "react-router-dom";

export default function Sidebar({ sidebarCollapse, setSidebarCollapse }) {
  const [openMenu, setOpenMenu] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(state => state.auth.user);

  // Check if user can see a menu item
  const canSeeMenuItem = (menuItem) => {
    // Admin sees everything
    if (!user?.isStaff) return true;

    // Check admin-only items
    if (menuItem.adminOnly) return false;

    // Check permission
    if (menuItem.permission) {
      return user?.permissions?.includes(menuItem.permission);
    }

    return true;
  };

  // Check submenu items
  const canSeeSubItem = (subItem) => {
    if (!user?.isStaff) return true;
    if (subItem.adminOnly) return false;
    if (subItem.permission) {
      return user?.permissions?.includes(subItem.permission);
    }
    return true;
  };

  const handleToggleDropdown = (menuToOpen, path) => {
    if (path) {
      navigate(path);
      return;
    }
    if (openMenu === menuToOpen) {
      setOpenMenu('');
      return;
    }
    setOpenMenu(menuToOpen);
  }

  const handleNavigate = (e, path) => {
    e.stopPropagation();
    navigate(path);
  }

  // Filter sidebar menu based on permissions
  const filteredMenu = sidebar_menu.filter(menuItem => {
    // Check if user can see this menu item
    if (!canSeeMenuItem(menuItem)) return false;

    // If has subitems, check if any subitem is visible
    if (menuItem.items) {
      const visibleSubItems = menuItem.items.filter(item => canSeeSubItem(item));
      return visibleSubItems.length > 0;
    }

    return true;
  });

  return (
    <div className={`px-0 vh-100 sidebar ${sidebarCollapse ? "hide" : ""}`} onClick={(e) => e.stopPropagation()}>
      <div className="d-flex justify-content-between align-items-center px-2 mt-3 mb-4 ">
        <h4>Chic Havens</h4>
        <div onClick={() => setSidebarCollapse(prev => !prev)}><SIDEBARMENU /></div>
      </div>
      <div className="ps-3 pe-2 pb-2">
        {filteredMenu.map((menu, index) => {
          // Filter visible sub-items
          const visibleSubItems = menu.items 
            ? menu.items.filter(item => canSeeSubItem(item))
            : [];

          return (
            <div key={`sidebar_key${index}`} className="mb-2" onClick={() => handleToggleDropdown(menu.section, menu?.path)}>
              {/* section div  */}
              <div className={`sidebar_item position-relative  ${openMenu === menu.section ? 'sidebar_item_active' : ''}  ${location.pathname.includes(menu.section.toLowerCase()) ? "active" : ""}`}>
                <div className="d-flex align-items-center gap-3">
                  {menu.icon}
                  <span>{menu.section}</span>
                </div>
                {menu.path ? '' : <i className={` ${openMenu === menu.section ? "rotate-up" : "rotate-down"} bi bi-chevron-down`}></i>}
              </div>
              
              {/* sub menu  */}
              {visibleSubItems.length > 0 && (
                <ul className={`sidebar_submenu ms-3 ${openMenu === menu.section ? 'show' : 'hide'}`}>
                  {visibleSubItems.map((subMenu, subIndex) => (
                    <li 
                      key={`${subIndex}`} 
                      className={`cursor-pointer ${location.pathname.includes(subMenu.path) ? 'active' : ""}`} 
                      onClick={(e) => handleNavigate(e, subMenu.path)}
                    >
                      {subMenu.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
