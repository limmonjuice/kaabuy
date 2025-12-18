import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Profile() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAF9] dark:bg-gray-900 transition-colors duration-200">
            {/* Import Google Fonts */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Crimson+Pro:wght@400;600&display=swap" rel="stylesheet" />

            <style>{`
                .profile-container * {
                    font-family: 'DM Sans', -apple-system, sans-serif;
                }
                .profile-title {
                    font-family: 'Crimson Pro', Georgia, serif;
                }

                /* Subtle entrance animations */
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-slide-up {
                    animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }

                /* Custom scrollbar */
                .custom-scroll::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scroll::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scroll::-webkit-scrollbar-thumb {
                    background: #E0E0E0;
                    border-radius: 3px;
                }
                .custom-scroll::-webkit-scrollbar-thumb:hover {
                    background: #C0C0C0;
                }
                /* Dark mode scrollbar */
                @media (prefers-color-scheme: dark) {
                    .custom-scroll::-webkit-scrollbar-thumb {
                        background: #4B5563;
                    }
                    .custom-scroll::-webkit-scrollbar-thumb:hover {
                        background: #6B7280;
                    }
                }
            `}</style>

            <div className="profile-container flex min-h-screen">
                {/* Left Sidebar - Profile Summary */}
                <aside className="w-80 bg-white dark:bg-gray-800 border-r border-[#E8E8E7] dark:border-gray-700 p-8 flex flex-col animate-slide-up transition-colors duration-200" style={{ animationDelay: '0ms' }}>
                    <div className="flex-1">
                        {/* Avatar Section */}
                        <div className="mb-8">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#F97316] to-[#FB923C] flex items-center justify-center text-white text-2xl font-semibold tracking-tight mb-4 shadow-sm">
                                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                            </div>
                            <h1 className="profile-title text-2xl font-semibold text-[#1A1A1A] dark:text-white mb-1 leading-tight">
                                {user?.firstName} {user?.lastName}
                            </h1>
                            <p className="text-[#737373] dark:text-gray-400 text-sm">@{user?.username}</p>
                        </div>

                        {/* Role Badge */}
                        <div className="mb-8">
                            {user?.role === 'owner' ? (
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FFF7ED] dark:bg-orange-900/20 border border-[#FED7AA] dark:border-orange-800/50 rounded-lg">
                                    <svg className="w-3.5 h-3.5 text-[#EA580C] dark:text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-[#C2410C] dark:text-orange-400 text-xs font-medium uppercase tracking-wide">Owner</span>
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#EFF6FF] dark:bg-blue-900/20 border border-[#BFDBFE] dark:border-blue-800/50 rounded-lg">
                                    <svg className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                    </svg>
                                    <span className="text-[#1E40AF] dark:text-blue-400 text-xs font-medium uppercase tracking-wide">Staff</span>
                                </div>
                            )}
                        </div>

                        {/* Quick Stats */}
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center justify-between py-2 border-b border-[#F5F5F4] dark:border-gray-700">
                                <span className="text-sm text-[#737373] dark:text-gray-400">Store</span>
                                <span className="text-sm font-medium text-[#1A1A1A] dark:text-white">{user?.storeName}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-[#F5F5F4] dark:border-gray-700">
                                <span className="text-sm text-[#737373] dark:text-gray-400">Status</span>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></div>
                                    <span className="text-sm font-medium text-[#1A1A1A] dark:text-white">Active</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-sm text-[#737373] dark:text-gray-400">Member since</span>
                                <span className="text-sm font-medium text-[#1A1A1A] dark:text-white">Jan 2025</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="space-y-2">
                        <button
                            onClick={() => navigate('/settings')}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit Profile
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-700 hover:bg-[#FAFAF9] dark:hover:bg-gray-600 text-[#1A1A1A] dark:text-gray-200 text-sm font-medium rounded-xl transition-all duration-200 border border-[#E8E8E7] dark:border-gray-600"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign Out
                        </button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 p-12 custom-scroll overflow-y-auto">
                    <div className="max-w-4xl">
                        {/* Page Header */}
                        <div className="mb-12 animate-slide-up" style={{ animationDelay: '100ms' }}>
                            <h2 className="profile-title text-4xl font-semibold text-[#1A1A1A] dark:text-white mb-2">Profile</h2>
                            <p className="text-[#737373] dark:text-gray-400">Manage your account information and preferences</p>
                        </div>

                        {/* Information Sections */}
                        <div className="space-y-8">
                            {/* Personal Information */}
                            <section className="animate-slide-up" style={{ animationDelay: '200ms' }}>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] dark:bg-gray-800 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-[#1A1A1A] dark:text-white">Personal Information</h3>
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-[#E8E8E7] dark:border-gray-700 divide-y divide-[#F5F5F4] dark:divide-gray-700">
                                    <div className="flex items-center justify-between px-6 py-4 hover:bg-[#FAFAF9] dark:hover:bg-gray-700/50 transition-colors">
                                        <div>
                                            <div className="text-xs font-medium text-[#A3A3A3] dark:text-gray-500 uppercase tracking-wide mb-1">Full Name</div>
                                            <div className="text-[#1A1A1A] dark:text-gray-200 font-medium">{user?.firstName} {user?.lastName}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between px-6 py-4 hover:bg-[#FAFAF9] dark:hover:bg-gray-700/50 transition-colors">
                                        <div>
                                            <div className="text-xs font-medium text-[#A3A3A3] dark:text-gray-500 uppercase tracking-wide mb-1">Username</div>
                                            <div className="text-[#1A1A1A] dark:text-gray-200 font-medium">@{user?.username}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between px-6 py-4 hover:bg-[#FAFAF9] dark:hover:bg-gray-700/50 transition-colors">
                                        <div>
                                            <div className="text-xs font-medium text-[#A3A3A3] dark:text-gray-500 uppercase tracking-wide mb-1">Email Address</div>
                                            <div className="text-[#1A1A1A] dark:text-gray-200 font-medium">{user?.email || 'Not provided'}</div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Account Security */}
                            <section className="animate-slide-up" style={{ animationDelay: '300ms' }}>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] dark:bg-gray-800 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-[#1A1A1A] dark:text-white">Account Security</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => navigate('/settings')}
                                        className="group bg-white dark:bg-gray-800 rounded-2xl border border-[#E8E8E7] dark:border-gray-700 p-6 hover:border-[#F97316] dark:hover:border-[#F97316] hover:shadow-sm transition-all duration-200 text-left"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="w-10 h-10 rounded-xl bg-[#F5F5F4] dark:bg-gray-700 group-hover:bg-[#FFF7ED] dark:group-hover:bg-orange-900/20 flex items-center justify-center transition-colors">
                                                <svg className="w-5 h-5 text-[#737373] dark:text-gray-400 group-hover:text-[#F97316] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                            <svg className="w-5 h-5 text-[#D4D4D4] dark:text-gray-600 group-hover:text-[#F97316] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                        <div className="text-sm font-semibold text-[#1A1A1A] dark:text-white mb-1">Change Password</div>
                                        <div className="text-xs text-[#737373] dark:text-gray-400">Update your password</div>
                                    </button>

                                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-[#E8E8E7] dark:border-gray-700 p-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] dark:bg-green-900/20 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="text-sm font-semibold text-[#1A1A1A] dark:text-white mb-1">Last Login</div>
                                        <div className="text-xs text-[#737373] dark:text-gray-400">Today at {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                                    </div>
                                </div>
                            </section>

                            {/* Quick Actions */}
                            <section className="animate-slide-up" style={{ animationDelay: '400ms' }}>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] dark:bg-gray-800 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-[#8B5CF6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-[#1A1A1A] dark:text-white">Quick Links</h3>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <button
                                        onClick={() => navigate('/dashboard')}
                                        className="group bg-white dark:bg-gray-800 rounded-xl border border-[#E8E8E7] dark:border-gray-700 p-4 hover:border-[#F97316] dark:hover:border-[#F97316] hover:shadow-sm transition-all duration-200"
                                    >
                                        <svg className="w-6 h-6 text-[#737373] dark:text-gray-400 group-hover:text-[#F97316] transition-colors mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                        <div className="text-xs font-medium text-[#1A1A1A] dark:text-gray-200">Dashboard</div>
                                    </button>
                                    <button
                                        onClick={() => navigate('/settings')}
                                        className="group bg-white dark:bg-gray-800 rounded-xl border border-[#E8E8E7] dark:border-gray-700 p-4 hover:border-[#F97316] dark:hover:border-[#F97316] hover:shadow-sm transition-all duration-200"
                                    >
                                        <svg className="w-6 h-6 text-[#737373] dark:text-gray-400 group-hover:text-[#F97316] transition-colors mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <div className="text-xs font-medium text-[#1A1A1A] dark:text-gray-200">Settings</div>
                                    </button>
                                    <button
                                        onClick={() => navigate('/help')}
                                        className="group bg-white dark:bg-gray-800 rounded-xl border border-[#E8E8E7] dark:border-gray-700 p-4 hover:border-[#F97316] dark:hover:border-[#F97316] hover:shadow-sm transition-all duration-200"
                                    >
                                        <svg className="w-6 h-6 text-[#737373] dark:text-gray-400 group-hover:text-[#F97316] transition-colors mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div className="text-xs font-medium text-[#1A1A1A] dark:text-gray-200">Help</div>
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Profile;
