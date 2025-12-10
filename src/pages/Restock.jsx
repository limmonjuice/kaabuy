import { useState, useEffect } from "react";
import { API_URL } from "../config/constants";
import { useAuth } from "../context/AuthContext";

function Restock() {
    const { token } = useAuth();
    const [stockRecords, setStockRecords] = useState([]);
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filterProduct, setFilterProduct] = useState("");
    const [filterSupplier, setFilterSupplier] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [formData, setFormData] = useState({
        productId: "",
        supplierId: "",
        stockQuantity: "",
        priceSupplier: "",
        recordType: "IN",
        adjustmentDirection: "add",
        deliveryDate: new Date().toISOString().split('T')[0]
    });
    const [formError, setFormError] = useState("");
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        fetchStockRecords();
        fetchProducts();
        fetchSuppliers();
    }, []);

    const fetchStockRecords = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/stock-records`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setStockRecords(data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_URL}/api/products`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
                // Filter low stock products
                setLowStockProducts(data.filter(p => p.isLowStock || p.currentStock <= p.reorderLevel));
            }
        } catch (err) {
            console.error("Failed to fetch products", err);
        }
    };

    const fetchSuppliers = async () => {
        try {
            const response = await fetch(`${API_URL}/api/suppliers`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setSuppliers(data);
            }
        } catch (err) {
            console.error("Failed to fetch suppliers", err);
        }
    };

    const fetchByProduct = async (productId) => {
        if (!productId) {
            fetchStockRecords();
            return;
        }
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/stock-records/product/${productId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setStockRecords(data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchBySupplier = async (supplierId) => {
        if (!supplierId) {
            fetchStockRecords();
            return;
        }
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/stock-records/supplier/${supplierId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setStockRecords(data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleProductFilter = (productId) => {
        setFilterProduct(productId);
        setFilterSupplier("");
        fetchByProduct(productId);
    };

    const handleSupplierFilter = (supplierId) => {
        setFilterSupplier(supplierId);
        setFilterProduct("");
        fetchBySupplier(supplierId);
    };

    const clearFilters = () => {
        setFilterProduct("");
        setFilterSupplier("");
        fetchStockRecords();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddNew = (preselectedProductId = null) => {
        setEditingRecord(null);
        setFormData({
            productId: preselectedProductId || "",
            supplierId: "",
            stockQuantity: "",
            priceSupplier: "",
            recordType: "IN",
            adjustmentDirection: "add",
            deliveryDate: new Date().toISOString().split('T')[0]
        });
        setFormError("");
        setShowModal(true);
    };

    const handleEdit = (record) => {
        setEditingRecord(record);
        // For ADJUSTMENT, detect direction from quantity sign
        const isNegativeAdjustment = record.recordType === 'ADJUSTMENT' && record.stockQuantity < 0;
        setFormData({
            productId: record.productId,
            supplierId: record.supplierId || "",
            stockQuantity: Math.abs(record.stockQuantity),
            priceSupplier: record.priceSupplier || "",
            recordType: record.recordType || "IN",
            adjustmentDirection: isNegativeAdjustment ? "remove" : "add",
            deliveryDate: record.deliveryDate ? record.deliveryDate.split('T')[0] : new Date().toISOString().split('T')[0]
        });
        setFormError("");
        setShowModal(true);
    };

    const getSelectedProduct = () => {
        if (!formData.productId) return null;
        return products.find(p => p.productId === parseInt(formData.productId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");
        setFormLoading(true);

        if (!formData.productId || !formData.stockQuantity) {
            setFormError("Product and quantity are required");
            setFormLoading(false);
            return;
        }

        const selectedProduct = getSelectedProduct();
        let availableStock = selectedProduct ? selectedProduct.currentStock : 0;

        // When editing, add back the original record's effect to get the true available stock
        if (editingRecord) {
            const originalType = editingRecord.recordType;
            const originalQty = editingRecord.stockQuantity;
            if (originalType === 'IN' || (originalType === 'ADJUSTMENT' && originalQty > 0)) {
                availableStock -= Math.abs(originalQty);
            } else if (originalType === 'OUT' || originalType === 'RETURN' || (originalType === 'ADJUSTMENT' && originalQty < 0)) {
                availableStock += Math.abs(originalQty);
            }
        }

        const quantityToCheck = parseInt(formData.stockQuantity);
        const isSubtracting = formData.recordType === 'OUT' || formData.recordType === 'RETURN' ||
            (formData.recordType === 'ADJUSTMENT' && formData.adjustmentDirection === 'remove');

        if (isSubtracting && quantityToCheck > availableStock) {
            setFormError(`Insufficient stock. You can only subtract up to ${availableStock} units for "${selectedProduct.productName}".`);
            setFormLoading(false);
            return;
        }

        try {
            const url = editingRecord
                ? `${API_URL}/api/stock-records/${editingRecord.recordId}`
                : `${API_URL}/api/stock-records`;

            // For ADJUSTMENT type, apply direction to quantity
            let finalQuantity = parseInt(formData.stockQuantity);
            if (formData.recordType === 'ADJUSTMENT' && formData.adjustmentDirection === 'remove') {
                finalQuantity = -Math.abs(finalQuantity);
            }

            const response = await fetch(url, {
                method: editingRecord ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    productId: parseInt(formData.productId),
                    supplierId: formData.supplierId ? parseInt(formData.supplierId) : null,
                    stockQuantity: finalQuantity,
                    priceSupplier: formData.priceSupplier ? parseFloat(formData.priceSupplier) : null,
                    recordType: formData.recordType,
                    deliveryDate: formData.deliveryDate ? `${formData.deliveryDate}T00:00:00` : null
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to save stock record");
            }

            setShowModal(false);
            fetchStockRecords();
            fetchProducts();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (recordId) => {
        if (!confirm("Are you sure you want to delete this stock record?")) return;

        try {
            const response = await fetch(`${API_URL}/api/stock-records/${recordId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Failed to delete stock record");
            fetchStockRecords();
            fetchProducts();
        } catch (err) {
            alert(err.message);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        if (!amount) return "-";
        return `₱${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    };

    const getRecordTypeBadge = (type) => {
        const styles = {
            'IN': 'bg-green-100 text-green-700',
            'OUT': 'bg-red-100 text-red-700',
            'ADJUSTMENT': 'bg-blue-100 text-blue-700',
            'RETURN': 'bg-yellow-100 text-yellow-700'
        };
        return styles[type] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="p-6">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Restock</h1>
                <p className="text-gray-500 text-sm mt-1">Manage warehouse inventory and stock records</p>
                <p className="text-blue-600 text-xs mt-1">Note: Stock records update warehouse inventory. Use Products page to refill display stock.</p>
            </div>

            {/* Low Stock Alert */}
            {lowStockProducts.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-yellow-800">Low Stock Alert</h3>
                            <p className="text-sm text-yellow-700 mt-1">{lowStockProducts.length} product(s) need restocking</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {lowStockProducts.slice(0, 5).map(product => (
                                    <button
                                        key={product.productId}
                                        onClick={() => handleAddNew(product.productId)}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-yellow-300 rounded-full text-sm text-yellow-800 hover:bg-yellow-100 transition-colors"
                                    >
                                        <span>{product.productName}</span>
                                        <span className="text-xs text-yellow-600">({product.currentStock}/{product.reorderLevel})</span>
                                    </button>
                                ))}
                                {lowStockProducts.length > 5 && (
                                    <span className="text-sm text-yellow-600 self-center">+{lowStockProducts.length - 5} more</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Records</p>
                            <p className="text-2xl font-bold text-gray-900">{stockRecords.length}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Stock In</p>
                            <p className="text-2xl font-bold text-green-600">{stockRecords.filter(r => r.recordType === 'IN').length}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-lg">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Low Stock Items</p>
                            <p className="text-2xl font-bold text-yellow-600">{lowStockProducts.length}</p>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-lg">
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Products</p>
                            <p className="text-2xl font-bold text-purple-600">{products.length}</p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Product Filter */}
                        <select
                            value={filterProduct}
                            onChange={(e) => handleProductFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                        >
                            <option value="">All Products</option>
                            {products.map(product => (
                                <option key={product.productId} value={product.productId}>
                                    {product.productName}
                                </option>
                            ))}
                        </select>

                        {/* Supplier Filter */}
                        <select
                            value={filterSupplier}
                            onChange={(e) => handleSupplierFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                        >
                            <option value="">All Suppliers</option>
                            {suppliers.map(supplier => (
                                <option key={supplier.supplierId} value={supplier.supplierId}>
                                    {supplier.supplierName}
                                </option>
                            ))}
                        </select>

                        {(filterProduct || filterSupplier) && (
                            <button
                                onClick={clearFilters}
                                className="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Add Restock Button */}
                    <button
                        onClick={() => handleAddNew()}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all shadow-sm hover:shadow-md"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Stock Record
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                    {error}
                </div>
            )}

            {/* Stock Records Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                        <span className="ml-3 text-gray-500">Loading stock records...</span>
                    </div>
                ) : stockRecords.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <p className="text-gray-500">No stock records found</p>
                        <button onClick={() => handleAddNew()} className="mt-4 text-orange-500 hover:text-orange-600 font-medium">
                            Add your first stock record
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Supplier</th>
                                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
                                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Unit Cost</th>
                                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Cost</th>
                                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stockRecords.map((record) => (
                                    <tr key={record.recordId} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{formatDate(record.deliveryDate)}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{record.productName}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600">{record.supplierName || "-"}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRecordTypeBadge(record.recordType)}`}>
                                                {record.recordType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`font-semibold ${
                                                record.recordType === 'IN' ? 'text-green-600' :
                                                record.recordType === 'OUT' || record.recordType === 'RETURN' ? 'text-red-600' :
                                                record.recordType === 'ADJUSTMENT' ? (record.stockQuantity >= 0 ? 'text-green-600' : 'text-red-600') :
                                                'text-gray-900'
                                            }`}>
                                                {record.recordType === 'IN' ? '+' : ''}
                                                {record.recordType === 'OUT' || record.recordType === 'RETURN' ? '-' : ''}
                                                {record.recordType === 'ADJUSTMENT' ? (record.stockQuantity >= 0 ? '+' : '') : ''}
                                                {record.recordType === 'ADJUSTMENT' ? record.stockQuantity : Math.abs(record.stockQuantity)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-600">
                                            {formatCurrency(record.priceSupplier)}
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-gray-900">
                                            {record.priceSupplier ? formatCurrency(record.priceSupplier * Math.abs(record.stockQuantity)) : "-"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(record)}
                                                    className="p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(record.recordId)}
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

            {/* Record Count */}
            {!loading && stockRecords.length > 0 && (
                <div className="mt-4 text-sm text-gray-500">
                    Showing {stockRecords.length} stock records
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingRecord ? "Edit Stock Record" : "Add Stock Record"}
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

                            {/* Product */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Product <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="productId"
                                    value={formData.productId}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                                >
                                    <option value="">Select a product</option>
                                    {products.map(product => (
                                        <option key={product.productId} value={product.productId}>
                                            {product.productName} (Stock: {product.currentStock})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Supplier */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                                <select
                                    name="supplierId"
                                    value={formData.supplierId}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                                >
                                    <option value="">Select a supplier (optional)</option>
                                    {suppliers.map(supplier => (
                                        <option key={supplier.supplierId} value={supplier.supplierId}>
                                            {supplier.supplierName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Record Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Record Type</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {['IN', 'OUT', 'ADJUSTMENT', 'RETURN'].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, recordType: type }))}
                                            className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                                                formData.recordType === type
                                                    ? 'bg-orange-500 text-white border-orange-500'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300'
                                            }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Adjustment Direction - Only show when ADJUSTMENT is selected */}
                            {formData.recordType === 'ADJUSTMENT' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Adjustment Direction</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, adjustmentDirection: 'add' }))}
                                            className={`px-3 py-2 text-sm rounded-lg border transition-all flex items-center justify-center gap-2 ${
                                                formData.adjustmentDirection === 'add'
                                                    ? 'bg-green-500 text-white border-green-500'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:border-green-300'
                                            }`}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Add Stock
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, adjustmentDirection: 'remove' }))}
                                            className={`px-3 py-2 text-sm rounded-lg border transition-all flex items-center justify-center gap-2 ${
                                                formData.adjustmentDirection === 'remove'
                                                    ? 'bg-red-500 text-white border-red-500'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:border-red-300'
                                            }`}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                            </svg>
                                            Remove Stock
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Quantity and Price Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Quantity <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="stockQuantity"
                                        value={formData.stockQuantity}
                                        onChange={handleInputChange}
                                        min="1"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit Cost</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₱</span>
                                        <input
                                            type="number"
                                            name="priceSupplier"
                                            value={formData.priceSupplier}
                                            onChange={handleInputChange}
                                            step="0.01"
                                            min="0"
                                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Total Cost Display */}
                            {formData.stockQuantity && formData.priceSupplier && (
                                <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Total Cost:</span>
                                    <span className="font-bold text-gray-900">
                                        {formatCurrency(parseFloat(formData.stockQuantity) * parseFloat(formData.priceSupplier))}
                                    </span>
                                </div>
                            )}

                            {/* Date Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {formData.recordType === 'IN' ? 'Delivery Date' :
                                     formData.recordType === 'OUT' ? 'Stock Out Date' :
                                     formData.recordType === 'RETURN' ? 'Return Date' :
                                     'Adjustment Date'}
                                </label>
                                <input
                                    type="date"
                                    name="deliveryDate"
                                    value={formData.deliveryDate}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                                    {formLoading ? "Saving..." : (editingRecord ? "Update" : "Add Record")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Restock;
