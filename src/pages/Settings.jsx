import { useState, useEffect } from "react";
import { API_URL } from "../config/constants";
import { useAuth } from "../context/AuthContext";
function Settings() {
    const { token, user } = useAuth();
    const [activeTab, setActiveTab] = useState("profile");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    // Profile State
    const [profileData, setProfileData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        storeName: ""
    });
    // Password State
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    useEffect(() => {
        if (user) {
            setProfileData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                storeName: user.storeName || ""
            });
        }
    }, [user]);
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });
        try {
            const response = await fetch(`${API_URL}/api/staff/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(profileData)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update profile");
            }
            setMessage({ type: "success", text: "Profile updated successfully! Please re-login to see changes." });
        } catch (err) {
            setMessage({ type: "error", text: err.message });
        } finally {
            setLoading(false);
        }
    };
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
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab("profile")}
                        className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${activeTab === "profile"
                            ? "bg-orange-50 text-orange-600 border-b-2 border-orange-500"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                            }`}
                    >
                        Profile Information
                    </button>
                    <button
                        onClick={() => setActiveTab("security")}
                        className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${activeTab === "security"
                            ? "bg-orange-50 text-orange-600 border-b-2 border-orange-500"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                            }`}
                    >
                        Security & Password
                    </button>
                </div>
                <div className="p-6">
                    {/* Message Alert */}
                    {message.text && (
                        <div className={`mb-6 p-4 rounded-lg flex items-center ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                            }`}>
                            {message.type === "success" ? (
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                            {message.text}
                        </div>
                    )}
                    {activeTab === "profile" && (
                        <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-lg">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={profileData.firstName}
                                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={profileData.lastName}
                                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                />
                            </div>
                            {user?.role === "owner" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                                    <input
                                        type="text"
                                        value={profileData.storeName}
                                        onChange={(e) => setProfileData({ ...profileData, storeName: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">Visible on receipts and reports.</p>
                                </div>
                            )}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-medium rounded-lg shadow-sm hover:from-orange-500 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    )}
                    {activeTab === "security" && (
                        <form onSubmit={handlePasswordChange} className="space-y-6 max-w-lg">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordData.oldPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                />
                                <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters long.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                />
                            </div>
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-gray-800 text-white font-medium rounded-lg shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Updating..." : "Update Password"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
export default Settings;