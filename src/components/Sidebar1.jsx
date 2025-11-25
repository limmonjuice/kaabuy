function Sidebar({isOpen}){
    const menuItems = [
        {icon: "🏠", text: "Home", link: "/"},
        {icon: "🛍", text: "Products", link: "/product"},
        {icon: "⚙", text: "Settings", link: "/settings"}
    ]

    return  (
    <div className={`${isOpen ? 'w-36 p-4': 'w-0 p-0'} overflow-hidden bg-gray-900 text-white transition-all duration-300`}>
        <div className="p-4">
            <h2>KaaBUY</h2>
        </div>
        <nav className="p-4">
            <ul>
            {
                menuItems.map((item, index) => (<li key={index}><i>{item.icon}</i>{item.text}</li>)) 
            }   
            </ul>
        </nav>
    </div>
    )
}

export default Sidebar;
