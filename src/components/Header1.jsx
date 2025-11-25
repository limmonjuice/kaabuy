function Header({onSidebarToggle}){
    return (
    <header className="h-8 bg-orange-100">
        <button onClick = {onSidebarToggle}>Toggle</button>
    </header>
    )
}

export default Header