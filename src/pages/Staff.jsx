import { useState, useEffect } from "react";
import { API_URL } from "../config/constants";
import { useAuth } from "../context/AuthContext";

function Staff() {

    const { token, user } = useAuth();

    // DEBUG: Check JWT token contents
    useEffect(() => {
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                console.log('=== JWT TOKEN DEBUG ===');
                console.log('Full Payload:', payload);
                console.log('Role:', payload.role);
                console.log('Scope:', payload.scope);
                console.log('Subject (username):', payload.sub);
                console.log('Token:', token);
                console.log('=======================');
            } catch (e) {
                console.error('Token parse error:', e);
            }
        } else {
            console.warn('No token found!');
        }
    }, [token]);

    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        storeName: "",
        role: "staff"
    });
    const [formError, setFormError] = useState("");
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/staff`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setStaff(data);
            } else {
                console.error('Fetch staff failed:', response.status, response.statusText);
            }
        } catch (err) {
            setError("Failed to fetch staff");
            console.error('Fetch staff error:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredStaff = staff.filter(s =>
        (s.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.lastName.toLowerCase().includes(searchTerm.toLowerCase())) &&
        s.username !== user?.username
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddNew = () => {
        setEditingStaff(null);
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            storeName: user?.storeName || "",
            role: "staff"
        });
        setFormError("");
        setShowModal(true);
    };

    const handleEdit = (staffMember) => {
        setEditingStaff(staffMember);
        setFormData({
            firstName: staffMember.firstName,
            lastName: staffMember.lastName,
            email: staffMember.email || "",
            storeName: staffMember.storeName || "",
            role: staffMember.role
        });
        setFormError("");
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");
        setFormLoading(true);

        if (!formData.firstName || !formData.lastName || !formData.role || !formData.email) {
            setFormError("Please fill in all required fields");
            setFormLoading(false);
            return;
        }

        try {
            const url = editingStaff
                ? `${API_URL}/api/staff/${editingStaff.staffId}`
                : `${API_URL}/api/staff`;

            const payload = { ...formData }; // No username/password needed for invite

            console.log('=== STAFF REQUEST DEBUG ===');
            console.log('URL:', url);
            console.log('Method:', editingStaff ? 'PUT' : 'POST');
            console.log('Payload:', payload);
            console.log('Token:', token);
            console.log('=================================');

            const response = await fetch(url, {
                method: editingStaff ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                throw new Error(errorData.error || errorData.message || "Failed to save staff");
            }

            const result = await response.json();
            console.log('Success response:', result);

            fetchStaff();
            setShowModal(false);
        } catch (err) {
            console.error('Submit error:', err);
            setFormError(err.message);
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (staffId) => {
        if (!confirm("Are you sure you want to delete this staff member?")) return;

        try {
            const response = await fetch(`${API_URL}/api/staff/${staffId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Failed to delete staff");
            fetchStaff();
        } catch (err) {
            alert(err.message);
        }
    };

    const getRoleBadge = (role) => {
        const roleColors = {
            'owner': 'bg-purple-100 text-purple-700',
            'staff': 'bg-green-100 text-green-700'
        };
        return roleColors[role] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="p-6">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
                <p className="text-gray-500 text-sm mt-1">Create staff accounts and manage login credentials for your team</p>
            </div>

            {/* Action Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search staff..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>

                    {/* Add Button */}
                    <button
                        onClick={handleAddNew}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Staff
                    </button>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                    {error}
                </div>
            )}

            {/* Staff Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                        <span className="ml-3 text-gray-500">Loading staff...</span>
                    </div>
                ) : filteredStaff.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p className="text-gray-500">No staff members found</p>
                        <button
                            onClick={handleAddNew}
                            className="mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                        >
                            Add your first staff member
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Staff Member</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Store</th>
                                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredStaff.map((staffMember) => (
                                    <tr key={staffMember.staffId} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{staffMember.firstName} {staffMember.lastName}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {staffMember.email}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {staffMember.storeName || "-"}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadge(staffMember.role)}`}>
                                                {staffMember.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(staffMember)}
                                                    className="p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                {user?.username !== staffMember.username && (
                                                    <button
                                                        onClick={() => handleDelete(staffMember.staffId)}
                                                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Staff Count */}
            {!loading && filteredStaff.length > 0 && (
                <div className="mt-4 text-sm text-gray-500">
                    Showing {filteredStaff.length} of {staff.length} staff members
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                {editingStaff ? "Edit Staff" : "Add New Staff"}
                            </h2>

                            {formError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                                    {formError}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="john@example.com"
                                        required
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        An invite with login credentials will be sent to this email.
                                    </p>
                                </div>

                                {/* First Name & Last Name */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            First Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            placeholder="John"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Last Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            placeholder="Doe"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Store Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                                    <input
                                        type="text"
                                        name="storeName"
                                        value={formData.storeName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="Main Store"
                                    />
                                </div>

                                {/* Role */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Role <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                                        required
                                    >
                                        <option value="staff">Staff (Limited Access)</option>
                                        <option value="owner">Owner (Full Access)</option>
                                    </select>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Staff have limited access. Owners have full access to all features.
                                    </p>
                                </div>

                                {/* Modal Footer */}
                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={formLoading}
                                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        {formLoading ? "Saving..." : (editingStaff ? "Update Staff" : "Add Staff")}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Staff;