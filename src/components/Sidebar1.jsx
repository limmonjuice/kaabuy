import {Link, useLocation} from "react-router-dom"
function Sidebar({isOpen}){
    const location = useLocation();
    const menuItems = [
        {icon: "🏠", text: "Home", link: "/"},
        {icon: "👜", text: "Products", link: "/product"},
        // {icon: "⚙", text: "Settings", link: "/settings"}
    ]

    return  (
    <div className={`${isOpen ? 'w-64': 'w-0'} overflow-hidden bg-gray-900 text-white transition-all duration-300`}>
        <div className="p-4">
            <h2 className="text-2xl font-bold">KaaBUY</h2>
        </div>
        <nav className="mt-6">
            
            {
                menuItems.map((item, index) => (
                    <Link
                        key={index}
                        to={item.link}
                        className={`flex items-center px-6 py-3 transtition-colors ${location.pathname == item.link ? 'bg-gray-800 border-l-4 border-blue-500' : 'hover:bg-gray-800'}`}
                    >
                        <span className="text-xl mr-3">{item.icon}</span>
                        {item.text}
                    </Link>

                )) 
            }   
            
        </nav>
    </div>
    )
}

export default Sidebar;
