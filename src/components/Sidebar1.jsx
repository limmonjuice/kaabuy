import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import logo from "../assets/primary_logo.jpg";

function Sidebar({ isOpen, onToggle }) {
    const location = useLocation();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const mainMenuItems = [
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
            text: "Dashboard",
            link: "/"
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            text: "Point of Sale",
            link: "/pos"
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            text: "Inventory",
            link: "/inventory"
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            ),
            text: "Products",
            link: "/products"
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            ),
            text: "Restock",
            link: "/restock"
        }
    ];

    const managementItems = [
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
            ),
            text: "Suppliers",
            link: "/suppliers"
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            text: "Customers",
            link: "/customers"
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            text: "Transactions",
            link: "/transactions"
        }
    ];

    const settingsItems = [
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            text: "Settings",
            link: "/settings"
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            text: "Help & Support",
            link: "/help"
        }
    ];

    return (
        <div className={`${isOpen ? 'w-64' : 'w-16'} h-screen bg-white transition-all duration-300 shadow-lg border-r border-gray-200`}>
            {/* Hamburger/Close Button and Store Name */}
            <div className={`p-4 border-b border-gray-100 ${isOpen ? 'px-6' : 'px-3'} flex items-center justify-between`}>
                <div className="flex items-center space-x-3 flex-1">
                    {isOpen && (
                        <div className="overflow-hidden">
                            <h2 className="text-lg font-bold text-gray-900 whitespace-nowrap">Kaabuy</h2>
                            <p className="text-xs text-gray-500 whitespace-nowrap">{user?.storeName || 'Store Name'}</p>
                        </div>
                    )}
                </div>

                {/* Hamburger/X Toggle Button */}
                <button
                    onClick={onToggle}
                    className={`p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 ${!isOpen ? 'mx-auto' : ''}`}
                    aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
                >
                    <div className="relative w-6 h-6">
                        {/* Hamburger Icon - visible when closed */}
                        <div className={`absolute inset-0 transition-all duration-300 ${isOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </div>

                        {/* X Icon - visible when open */}
                        <div className={`absolute inset-0 transition-all duration-300 ${isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    </div>
                </button>
            </div>

            {/* Navigation */}
            <nav className="py-4 overflow-y-auto h-[calc(100vh-200px)]">
                {/* Main Menu Section */}
                <div className="mb-6">
                    {isOpen && (
                        <h3 className="px-6 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Main Menu
                        </h3>
                    )}
                    {mainMenuItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.link}
                            className={`flex items-center ${isOpen ? 'px-6 mx-4' : 'px-3 mx-2 justify-center'} py-3 rounded-lg transition-all duration-300 ease-in-out transform ${
                                location.pathname === item.link
                                    ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md scale-105'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:scale-102'
                            }`}
                            title={!isOpen ? item.text : ''}
                        >
                            <span className={`${isOpen ? 'mr-3' : ''}`}>{item.icon}</span>
                            {isOpen && <span className="text-sm font-medium whitespace-nowrap">{item.text}</span>}
                        </Link>
                    ))}
                </div>

                {/* Management Section */}
                <div className="mb-6">
                    {isOpen && (
                        <h3 className="px-6 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Management
                        </h3>
                    )}
                    {managementItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.link}
                            className={`flex items-center ${isOpen ? 'px-6 mx-4' : 'px-3 mx-2 justify-center'} py-3 rounded-lg transition-all duration-300 ease-in-out transform ${
                                location.pathname === item.link
                                    ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md scale-105'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:scale-102'
                            }`}
                            title={!isOpen ? item.text : ''}
                        >
                            <span className={`${isOpen ? 'mr-3' : ''}`}>{item.icon}</span>
                            {isOpen && <span className="text-sm font-medium whitespace-nowrap">{item.text}</span>}
                        </Link>
                    ))}
                </div>

                {/* Settings Section */}
                <div>
                    {isOpen && (
                        <h3 className="px-6 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Settings
                        </h3>
                    )}
                    {settingsItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.link}
                            className={`flex items-center ${isOpen ? 'px-6 mx-4' : 'px-3 mx-2 justify-center'} py-3 rounded-lg transition-all duration-300 ease-in-out transform ${
                                location.pathname === item.link
                                    ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md scale-105'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:scale-102'
                            }`}
                            title={!isOpen ? item.text : ''}
                        >
                            <span className={`${isOpen ? 'mr-3' : ''}`}>{item.icon}</span>
                            {isOpen && <span className="text-sm font-medium whitespace-nowrap">{item.text}</span>}
                        </Link>
                    ))}
                </div>
            </nav>

            {/* Bottom Section - Dark Mode & Logout */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white py-3 px-3">
                {/* Dark Mode Toggle */}
                <div className={`flex items-center ${isOpen ? 'justify-between px-2' : 'justify-center'} mb-2`}>
                    {isOpen && (
                        <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                            <span className="text-xs font-medium text-gray-700">Light Mode</span>
                        </div>
                    )}
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${
                            darkMode ? 'bg-orange-500' : 'bg-gray-300'
                        }`}
                        title={!isOpen ? (darkMode ? 'Dark Mode' : 'Light Mode') : ''}
                    >
                        <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                darkMode ? 'translate-x-5' : 'translate-x-1'
                            }`}
                        />
                    </button>
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className={`w-full flex items-center ${isOpen ? 'px-3' : 'justify-center'} py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-colors duration-200`}
                    title={!isOpen ? 'Logout' : ''}
                >
                    <svg className={`w-4 h-4 ${isOpen ? 'mr-2' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    {isOpen && <span className="text-xs font-medium">Logout</span>}
                </button>
            </div>
        </div>
    );
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