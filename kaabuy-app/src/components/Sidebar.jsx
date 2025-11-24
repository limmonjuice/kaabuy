function Sidebar({status}){
    const menuItems = [
        {icon: "🏠", text: "Home", link: "/"},
        {icon: "🛍", text: "Products", link: "/products"},
        {icon: "⚙", text: "Settings", link: "/settings"},
    ]

    return status ? (
    <div className="bg-gray-900">
        <div>
            <h2>KaaBUY</h2>
        </div>
        
        <nav>
            <ul>
            {
                menuItems.map((item, index) =>(<li key={index}><i>{item.icon}</i>{item.text}</li>))
            }
            </ul>
        </nav>
    </div>
    ) : null
}

export default Sidebar;