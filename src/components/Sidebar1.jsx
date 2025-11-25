import {Link, useLocation} from "react-router-dom"

function Sidebar({isOpen}){
    const location = useLocation();
    const menuItems = [
        {icon: "🏠", text: "Home", link: "/"},
        {icon: "👜", text: "Products", link: "/product"},
        // {icon: "⚙", text: "Settings", link: "/settings"}
    ]

    return (
    <div className={`${isOpen ? 'w-64': 'w-0'} h-screen overflow-hidden bg-gray-900 text-white transition-all duration-300 shadow-xl border-r border-gray-800`}>
        <div className="p-6 border-b border-gray-800">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">KaaBUY</h2>
        </div>
        <nav className="mt-6">
            {menuItems.map((item, index) => (
                <Link
                    key={index}
                    to={item.link}
                    className={`flex items-center px-6 py-3.5 transition-all duration-200 ${
                        location.pathname === item.link 
                        ? 'bg-gray-800 border-l-4 border-orange-500 text-white' 
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white hover:border-l-4 hover:border-gray-700'
                    }`}
                >
                    <span className="text-xl mr-3">{item.icon}</span>
                    <span>{item.text}</span>
                </Link>
            ))}
        </nav>
    </div>
    )
}

function Header({onSidebarToggle}){
    return (
    <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
            <button 
                onClick={onSidebarToggle}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                aria-label="Toggle sidebar"
            >
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#163b42">
                    <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
                </svg>
            </button>
            
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input 
                        type="text" 
                        placeholder="Search anything..."
                        className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-200"
                    />
                </div>
                
                <button 
                    className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    aria-label="Notifications"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-medium">
                        3
                    </span>
                </button>
                
                <button 
                    className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold shadow-sm hover:shadow-md transition-shadow duration-200"
                    aria-label="User profile"
                >
                    AD
                </button>
            </div>
        </div>
    </header>
    )
}

export default Sidebar