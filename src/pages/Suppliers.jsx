import { useState, useEffect } from "react";
import { API_URL } from "../config/constants";
import { useAuth } from "../context/AuthContext";

function Suppliers() {
    const { token } = useAuth();
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showPreferredOnly, setShowPreferredOnly] = useState(false);
    const [summary, setSummary] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [formData, setFormData] = useState({
        supplierName: "",
        contactPerson: "",
        contactNumber: "",
        address: ""
    });
    const [formError, setFormError] = useState("");
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        fetchSuppliers();
        fetchSummary();
    }, []);

    const fetchSuppliers = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/suppliers`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setSuppliers(data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchSummary = async () => {
        try {
            const response = await fetch(`${API_URL}/api/suppliers/summary`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setSummary(data);
            }
        } catch (err) {
            console.error("Failed to fetch summary", err);
        }
    };

    const fetchPreferredSuppliers = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/suppliers/preferred`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setSuppliers(data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (keyword) => {
        if (!keyword.trim()) {
            fetchSuppliers();
            return;
        }
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/suppliers/search?keyword=${encodeURIComponent(keyword)}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setSuppliers(data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePreferredFilter = (checked) => {
        setShowPreferredOnly(checked);
        setSearchTerm("");
        if (checked) {
            fetchPreferredSuppliers();
        } else {
            fetchSuppliers();
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddNew = () => {
        setEditingSupplier(null);
        setFormData({
            supplierName: "",
            contactPerson: "",
            contactNumber: "",
            address: ""
        });
        setFormError("");
        setShowModal(true);
    };

    const handleEdit = (supplier) => {
        setEditingSupplier(supplier);
        setFormData({
            supplierName: supplier.supplierName,
            contactPerson: supplier.contactPerson || "",
            contactNumber: supplier.contactNumber || "",
            address: supplier.address || ""
        });
        setFormError("");
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");
        setFormLoading(true);

        if (!formData.supplierName.trim()) {
            setFormError("Supplier name is required");
            setFormLoading(false);
            return;
        }

        try {
            const url = editingSupplier
                ? `${API_URL}/api/suppliers/${editingSupplier.supplierId}`
                : `${API_URL}/api/suppliers`;

            const response = await fetch(url, {
                method: editingSupplier ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to save supplier");
            }

            setShowModal(false);
            fetchSuppliers();
            fetchSummary();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (supplierId) => {
        if (!confirm("Are you sure you want to delete this supplier?")) return;

        try {
            const response = await fetch(`${API_URL}/api/suppliers/${supplierId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Failed to delete supplier");
            fetchSuppliers();
            fetchSummary();
        } catch (err) {
            alert(err.message);
        }
    };

    const togglePreferred = async (supplierId) => {
        try {
            const response = await fetch(`${API_URL}/api/suppliers/${supplierId}/preferred`, {
                method: "PATCH",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Failed to toggle preferred status");
            fetchSuppliers();
            fetchSummary();
        } catch (err) {
            alert(err.message);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Never";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="p-6">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
                <p className="text-gray-500 text-sm mt-1">Manage supplier information and track orders</p>
            </div>

            {/* Summary Cards */}
            {summary && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Suppliers</p>
                                <p className="text-2xl font-bold text-gray-900">{summary.totalSuppliers || 0}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Preferred Suppliers</p>
                                <p className="text-2xl font-bold text-green-600">{summary.preferredSuppliers || 0}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Orders</p>
                                <p className="text-2xl font-bold text-purple-600">{summary.totalOrders || 0}</p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    handleSearch(e.target.value);
                                }}
                                placeholder="Search suppliers..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>

                        {/* Preferred Filter */}
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showPreferredOnly}
                                onChange={(e) => handlePreferredFilter(e.target.checked)}
                                className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                            />
                            <span className="text-sm text-gray-700">Preferred Only</span>
                        </label>
                    </div>

                    {/* Add Supplier Button */}
                    <button
                        onClick={handleAddNew}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all shadow-sm hover:shadow-md"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Supplier
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                    {error}
                </div>
            )}

            {/* Suppliers Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                        <span className="ml-3 text-gray-500">Loading suppliers...</span>
                    </div>
                ) : suppliers.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p className="text-gray-500">No suppliers found</p>
                        <button onClick={handleAddNew} className="mt-4 text-orange-500 hover:text-orange-600 font-medium">
                            Add your first supplier
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Supplier</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</th>
                                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Orders</th>
                                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Order</th>
                                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {suppliers.map((supplier) => (
                                    <tr key={supplier.supplierId} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                                                    {supplier.supplierName?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{supplier.supplierName}</div>
                                                    {supplier.contactPerson && (
                                                        <div className="text-xs text-gray-500">Contact: {supplier.contactPerson}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{supplier.contactNumber || "-"}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600 max-w-xs truncate">{supplier.address || "-"}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="font-medium text-gray-900">{supplier.totalOrders || 0}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm text-gray-600">{formatDate(supplier.lastOrderDate)}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => togglePreferred(supplier.supplierId)}
                                                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                                                    supplier.isPreferred
                                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                            >
                                                {supplier.isPreferred ? '★ Preferred' : 'Standard'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(supplier)}
                                                    className="p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(supplier.supplierId)}
                                                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Supplier Count */}
            {!loading && suppliers.length > 0 && (
                <div className="mt-4 text-sm text-gray-500">
                    Showing {suppliers.length} suppliers
                </div>
            )}

            {/* Add/Edit Supplier Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingSupplier ? "Edit Supplier" : "Add New Supplier"}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {formError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                    {formError}
                                </div>
                            )}

                            {/* Supplier Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Supplier Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="supplierName"
                                    value={formData.supplierName}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="Enter supplier name"
                                />
                            </div>

                            {/* Contact Person */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                                <input
                                    type="text"
                                    name="contactPerson"
                                    value={formData.contactPerson}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="Contact person name"
                                />
                            </div>

                            {/* Contact Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                <input
                                    type="text"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="Phone number"
                                />
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                    placeholder="Supplier address"
                                />
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
                                    className="px-6 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {formLoading ? "Saving..." : (editingSupplier ? "Update" : "Add Supplier")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Suppliers;
