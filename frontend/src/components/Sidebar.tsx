import { Link, useLocation } from "react-router-dom"

const Sidebar = () => {
    const location = useLocation();
    const links = [
        { title: 'Create Invoice', path: '/' },
        { title: 'Invoices List', path: '/invoices' },
    ]
    return (
        <div className='w-full h-screen bg-gray-100 p-4'>
            <div className="flex flex-col w-full items-center justify-center space-y-1">
                {links.map((link, index) =>
                    <Link to={link.path} className={`${location.pathname === link.path ? "bg-green-600/80 text-white" : "bg-white"} rounded w-full text-center py-1.5 px-4 text-lg`}>
                        <span
                            key={index}
                            className=""
                        >
                            {link.title}
                        </span>
                    </Link>
                )}
            </div>
        </div>
    )
}

export default Sidebar