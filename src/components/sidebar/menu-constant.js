import { ROUTES } from "../../routes/routes"

const sidebar_menu = [
    {
        section: "Dashboard",
        icon: <i className="bi bi-box fs-5"></i>,
        path: '/dashboard',
        permission: 'view_dashboard', // Everyone can see dashboard
        adminOnly: false
    },
    {
        section: "Customers",
        icon: <i className="bi bi-people fs-5"></i>,
        permission: 'manage_customers',
        adminOnly: false,
        items: [
            {
                label: 'All Customers',
                icon: '',
                path: ROUTES.CUSTOMERS,
                permission: 'manage_customers'
            },
            {
                label: 'All Feedback',
                icon: '',
                path: ROUTES.FEEDBACKS,
                permission: 'manage_customers'
            }
        ]
    },
    {
        section: "Products",
        icon: <i className="bi bi-archive fs-5"></i>,
        permission: 'manage_products',
        adminOnly: false,
        items: [
            {
                label: 'All products',
                icon: '',
                path: ROUTES.PRODUCTS,
                permission: 'manage_products'
            },
            {
                label: 'Categories',
                icon: '',
                path: ROUTES.CATEGORY,
                permission: 'manage_categories'
            },
        ]
    },
    {
        section: "Orders",
        icon: <i className="bi bi-cart-dash-fill fs-5"></i>,
        path: ROUTES.ORDERS,
        permission: 'manage_orders',
        adminOnly: false
    },
    {
        section: "Staff Management",
        icon: <i className="bi bi-person-fill-gear fs-5"></i>,
        adminOnly: true, // Only admin can see this
        items: [
            {
                label: 'Roles',
                icon: '',
                path: ROUTES.ROLES,
                adminOnly: true
            },
            {
                label: 'Staff',
                icon: '',
                path: ROUTES.STAFF,
                adminOnly: true
            }
        ]
    },
    {
        section: "Enquiry",
        icon: <i className="bi bi-pencil-square fs-5"></i>,
        path: ROUTES.ENQUIRIES,
        permission: 'manage_enquiries',
        adminOnly: false
    },
]

export default sidebar_menu;
