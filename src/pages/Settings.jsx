import { useState, useEffect } from "react";
import { API_URL } from "../config/constants";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function Settings() {
    const { token, user } = useAuth();
    const { theme, setTheme } = useTheme();
    const [activeTab, setActiveTab] = useState("security");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    // Password State
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    // Store Settings State (Owner only)
    const [storeSettings, setStoreSettings] = useState({
        storeName: "",
        storeAddress: "",
        contactNumber: "",
        operatingHours: "",
        taxRate: "",
        currencyFormat: "PHP",
        receiptFooter: ""
    });

    useEffect(() => {
        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        // Load store settings from localStorage
        const savedStoreSettings = localStorage.getItem("storeSettings");
        if (savedStoreSettings) {
            setStoreSettings(JSON.parse(savedStoreSettings));
        } else if (user) {
            // Initialize with user's store name
            setStoreSettings(prev => ({
                ...prev,
                storeName: user.storeName || ""
            }));
        }

        // Cleanup: restore body scroll when component unmounts
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [user]);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: "error", text: "New passwords do not match" });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setMessage({ type: "error", text: "New password must be at least 6 characters" });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/staff/password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    oldPassword: passwordData.oldPassword,
                    newPassword: passwordData.newPassword
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to change password");
            }

            setMessage({ type: "success", text: "Password changed successfully!" });
            setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            setMessage({ type: "error", text: err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleAppearanceSave = (e) => {
        e.preventDefault();
        // Theme is already saved by ThemeContext effect when changed
        setMessage({ type: "success", text: "Appearance settings saved successfully!" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const handleStoreSettingsSave = (e) => {
        e.preventDefault();
        localStorage.setItem("storeSettings", JSON.stringify(storeSettings));
        setMessage({ type: "success", text: "Store settings saved successfully!" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    const tabs = [
        { id: "security", label: "Security & Password", icon: "🔒" },
        { id: "appearance", label: "Appearance", icon: "🎨" },
    ];

    if (user?.role === "owner") {
        tabs.push({ id: "store", label: "Store Settings", icon: "🏪" });
    }

    return (
        <div className="h-screen bg-[#FAFAF9] dark:bg-gray-900 p-4 flex justify-center overflow-hidden transition-colors duration-200">
            <div className="inline-block min-w-[800px] max-h-[85vh] flex flex-col">
                <h1 className="text-4xl font-semibold text-[#1A1A1A] dark:text-white mb-8 tracking-tight">Settings</h1>

                {/* Tab Navigation */}
                <div className="bg-white dark:bg-gray-800 border border-[#E8E8E7] dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm transition-colors duration-200">
                    <div className="flex border-b border-[#E8E8E7] dark:border-gray-700 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setMessage({ type: "", text: "" });
                                }}
                                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id
                                    ? "bg-gradient-to-r from-[#F97316] to-[#FBBF24] text-white"
                                    : "text-[#737373] dark:text-gray-400 hover:text-[#1A1A1A] dark:hover:text-white hover:bg-[#FAFAF9] dark:hover:bg-gray-700"
                                    }`}
                            >
                                <span className="text-lg">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-8">
                        {/* Message Alert */}
                        {message.text && (
                            <div
                                className={`mb-6 p-4 rounded-xl flex items-center ${message.type === "success"
                                    ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-700"
                                    : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-700"
                                    }`}
                            >
                                {message.type === "success" ? (
                                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                                {message.text}
                            </div>
                        )}


                        {/* Security Tab */}
                        {activeTab === "security" && (
                            <div>
                                <h2 className="text-2xl font-semibold text-[#1A1A1A] dark:text-white mb-6">Change Password</h2>
                                <form onSubmit={handlePasswordChange} className="space-y-6 w-full">
                                    <div>
                                        <label className="block text-sm font-medium text-[#1A1A1A] dark:text-gray-300 mb-2">Current Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={passwordData.oldPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                            className="w-full px-4 py-3 border border-[#E8E8E7] dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] transition-all bg-white dark:bg-gray-700 text-[#1A1A1A] dark:text-white"
                                            placeholder="Enter current password"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#1A1A1A] dark:text-gray-300 mb-2">New Password</label>
                                        <input
                                            type="password"
                                            required
                                            minLength={6}
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            className="w-full px-4 py-3 border border-[#E8E8E7] dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] transition-all bg-white dark:bg-gray-700 text-[#1A1A1A] dark:text-white"
                                            placeholder="Enter new password"
                                        />
                                        <p className="mt-2 text-sm text-[#737373] dark:text-gray-400">Must be at least 6 characters long</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#1A1A1A] dark:text-gray-300 mb-2">Confirm New Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            className="w-full px-4 py-3 border border-[#E8E8E7] dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] transition-all bg-white dark:bg-gray-700 text-[#1A1A1A] dark:text-white"
                                            placeholder="Confirm new password"
                                        />
                                    </div>
                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-8 py-3 bg-[#1A1A1A] dark:bg-gray-700 text-white font-medium rounded-xl shadow-sm hover:bg-[#2A2A2A] dark:hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? "Updating..." : "Update Password"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Appearance Tab */}
                        {activeTab === "appearance" && (
                            <div>
                                <h2 className="text-2xl font-semibold text-[#1A1A1A] dark:text-white mb-6">Appearance Preferences</h2>
                                <form onSubmit={handleAppearanceSave} className="space-y-8 w-full">
                                    <div>
                                        <h3 className="text-lg font-semibold text-[#1A1A1A] dark:text-white mb-4">Theme</h3>
                                        <div className="space-y-3">
                                            {[
                                                { value: "light", label: "Light Mode", desc: "Clean and bright interface", icon: "☀️" },
                                                { value: "dark", label: "Dark Mode", desc: "Easy on the eyes at night", icon: "🌙" },
                                                { value: "system", label: "System Default", desc: "Match your device settings", icon: "💻" }
                                            ].map((option) => (
                                                <label
                                                    key={option.value}
                                                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${theme === option.value
                                                        ? "border-[#F97316] bg-orange-50 dark:bg-orange-900/20"
                                                        : "border-[#E8E8E7] dark:border-gray-700 hover:border-[#F97316]/50 dark:hover:border-[#F97316]/50"
                                                        }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="theme"
                                                        value={option.value}
                                                        checked={theme === option.value}
                                                        onChange={(e) => setTheme(e.target.value)}
                                                        className="w-4 h-4 text-[#F97316] focus:ring-[#F97316]"
                                                    />
                                                    <span className="text-2xl ml-3 mr-2">{option.icon}</span>
                                                    <div>
                                                        <p className="font-medium text-[#1A1A1A] dark:text-white">{option.label}</p>
                                                        <p className="text-sm text-[#737373] dark:text-gray-400">{option.desc}</p>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            className="px-8 py-3 bg-gradient-to-r from-[#F97316] to-[#FBBF24] text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all"
                                        >
                                            Save Preferences
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Store Settings Tab (Owner Only) */}
                        {activeTab === "store" && user?.role === "owner" && (
                            <div>
                                <h2 className="text-2xl font-semibold text-[#1A1A1A] dark:text-white mb-6">Store Configuration</h2>
                                <form onSubmit={handleStoreSettingsSave} className="space-y-8 w-full max-w-3xl">
                                    <div>
                                        <h3 className="text-lg font-semibold text-[#1A1A1A] dark:text-white mb-4 pb-2 border-b border-[#E8E8E7] dark:border-gray-700">Store Information</h3>
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium text-[#1A1A1A] dark:text-gray-300 mb-2">Store Name</label>
                                                <input
                                                    type="text"
                                                    value={storeSettings.storeName}
                                                    onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                                                    className="w-full px-4 py-3 border border-[#E8E8E7] dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] transition-all bg-white dark:bg-gray-700 text-[#1A1A1A] dark:text-white"
                                                    placeholder="Enter store name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-[#1A1A1A] dark:text-gray-300 mb-2">Store Address</label>
                                                <input
                                                    type="text"
                                                    value={storeSettings.storeAddress}
                                                    onChange={(e) => setStoreSettings({ ...storeSettings, storeAddress: e.target.value })}
                                                    className="w-full px-4 py-3 border border-[#E8E8E7] dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] transition-all bg-white dark:bg-gray-700 text-[#1A1A1A] dark:text-white"
                                                    placeholder="Enter store address"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-[#1A1A1A] dark:text-gray-300 mb-2">Contact Number</label>
                                                    <input
                                                        type="tel"
                                                        value={storeSettings.contactNumber}
                                                        onChange={(e) => setStoreSettings({ ...storeSettings, contactNumber: e.target.value })}
                                                        className="w-full px-4 py-3 border border-[#E8E8E7] dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] transition-all bg-white dark:bg-gray-700 text-[#1A1A1A] dark:text-white"
                                                        placeholder="+63 123 456 7890"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-[#1A1A1A] dark:text-gray-300 mb-2">Operating Hours</label>
                                                    <input
                                                        type="text"
                                                        value={storeSettings.operatingHours}
                                                        onChange={(e) => setStoreSettings({ ...storeSettings, operatingHours: e.target.value })}
                                                        className="w-full px-4 py-3 border border-[#E8E8E7] dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] transition-all bg-white dark:bg-gray-700 text-[#1A1A1A] dark:text-white"
                                                        placeholder="Mon-Fri: 9AM-6PM"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            className="px-8 py-3 bg-gradient-to-r from-[#F97316] to-[#FBBF24] text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all"
                                        >
                                            Save Store Settings
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;
