import { ROUTES } from "../../routes/routes"

const sidebar_menu = [
    {
        section: "Dashboard",
        icon: <i className="bi bi-box fs-5"></i>,
        path: '/dashboard'
    },
    {
        section: "Customers",
        icon: <i className="bi bi-people fs-5" ></i>,
        items: [
            {
                label: 'All Customers',
                icon: '',
                path: ROUTES.CUSTOMERS,
            },
            {
                label: 'All Feedback',
                icon: '',
                path: ROUTES.FEEDBACKS,
            }
        ]
    },
    {
        section: "Products",
        icon: <i className="bi bi-archive fs-5" ></i>,
        // path:'/products',
        items: [
            {
                label: 'All products',
                icon: '',
                path: ROUTES.PRODUCTS,
            },
            {
                label: 'Categories',
                icon: '',
                path: ROUTES.CATEGORY,
            },
        ]

    },
    {
        section: "Orders",
        icon: <i className="bi bi-cart-dash-fill fs-5" ></i>,
        path: ROUTES.ORDERS,
        // items:[]
    },
    {
        section: "Staff Management",
        icon: <i className="bi bi-person-fill-gear fs-5" ></i>,
        items: [
            {
                label: 'Roles',
                icon: '',
                path: ROUTES.ROLES,
            },
            {
                label: 'Employee',
                icon: '',
                path: ROUTES.EMPLOYEES,
            }
        ]
    },
    {
        section: "Enquiry",
        icon: <i className="bi bi-pencil-square fs-5" ></i>,
        path: ROUTES.ENQUIRIES,
    },
    {
        section: "Settings",
        icon: <i className="bi bi-gear fs-5" ></i>,
        path: '/settings'
    }
]

export default sidebar_menu