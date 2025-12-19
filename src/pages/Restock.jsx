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
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [itemsPerPage] = useState(10);
    const [showModal, setShowModal] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [formRows, setFormRows] = useState([]);
    const [formError, setFormError] = useState("");
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        if (!filterProduct && !filterSupplier) {
            fetchStockRecords(currentPage);
        } else if (filterProduct) {
            fetchByProduct(filterProduct);
        } else if (filterSupplier) {
            fetchBySupplier(filterSupplier);
        }
        fetchProducts();
        fetchSuppliers();
    }, [currentPage]);

    // Reset page when filters change
    useEffect(() => {
        if (!filterProduct && !filterSupplier) {
            setCurrentPage(0);
            fetchStockRecords(0);
        }
    }, [filterProduct, filterSupplier]);

    const fetchStockRecords = async (page = 0) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/stock-records?page=${page}&size=${itemsPerPage}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                // Check if response is paginated (has content field)
                if (data.content) {
                    setStockRecords(data.content);
                    setTotalPages(data.totalPages);
                } else {
                    // Fallback for filtered endpoints if they are not yet paginated
                    setStockRecords(data);
                    setTotalPages(1);
                }
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
        setFilterProduct("");
        setFilterSupplier("");
        setCurrentPage(0);
        // fetchStockRecords(0) will be triggered by useEffect due to state change, or we call it explicitly
        // Logic simplified: Filter states trigger the fetch
    };

    const handleAddNew = (preselectedProductId = null) => {
        setEditingRecord(null);
        setFormRows([{
            productId: preselectedProductId || "",
            supplierId: "",
            stockQuantity: "",
            priceSupplier: "",
            recordType: "RECEIVED",
            deliveryDate: new Date().toISOString().split('T')[0]
        }]);
        setFormError("");
        setShowModal(true);
    };

    const handleEdit = (record) => {
        setEditingRecord(record);
        setFormRows([{
            productId: record.productId,
            supplierId: record.supplierId || "",
            stockQuantity: Math.abs(record.stockQuantity),
            priceSupplier: record.priceSupplier || "",
            recordType: record.recordType || "RECEIVED",
            deliveryDate: record.deliveryDate ? record.deliveryDate.split('T')[0] : new Date().toISOString().split('T')[0]
        }]);
        setFormError("");
        setShowModal(true);
    };

    const handleRowChange = (index, field, value) => {
        const newRows = [...formRows];
        newRows[index] = { ...newRows[index], [field]: value };
        setFormRows(newRows);
    };

    const addRow = () => {
        setFormRows([...formRows, {
            productId: "",
            supplierId: "",
            stockQuantity: "",
            priceSupplier: "",
            recordType: "RECEIVED",
            deliveryDate: new Date().toISOString().split('T')[0]
        }]);
    };

    const removeRow = (index) => {
        if (formRows.length === 1) return;
        const newRows = formRows.filter((_, i) => i !== index);
        setFormRows(newRows);
    };

    const getSelectedProduct = (productId) => {
        if (!productId) return null;
        return products.find(p => p.productId === parseInt(productId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");
        setFormLoading(true);

        // Validate all rows
        for (let i = 0; i < formRows.length; i++) {
            const row = formRows[i];
            if (!row.productId || !row.stockQuantity) {
                setFormError(`Row ${i + 1}: Product and quantity are required`);
                setFormLoading(false);
                return;
            }

            const selectedProduct = getSelectedProduct(row.productId);
            // Stock availability check logic for withdrawals
            if (row.recordType === 'WITHDRAWN' || row.recordType === 'OUT') {
                let availableStock = selectedProduct ? selectedProduct.currentStock : 0;

                // If editing, adjust available stock
                if (editingRecord) {
                    const originalType = editingRecord.recordType.toUpperCase();
                    const originalQty = Math.abs(editingRecord.stockQuantity);
                    if (originalType === 'RECEIVED' || originalType === 'IN' || originalType === 'RESTOCK') {
                        availableStock -= originalQty;
                    } else if (originalType === 'WITHDRAWN' || originalType === 'OUT') {
                        availableStock += originalQty;
                    }
                }

                if (parseInt(row.stockQuantity) > availableStock) {
                    setFormError(`Row ${i + 1}: Insufficient stock. Max withdraw: ${availableStock} for "${selectedProduct.productName}".`);
                    setFormLoading(false);
                    return;
                }
            }
        }

        try {
            if (editingRecord) {
                // Edit Single Record
                const row = formRows[0];
                const response = await fetch(`${API_URL}/api/stock-records/${editingRecord.recordId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        productId: parseInt(row.productId),
                        supplierId: row.supplierId ? parseInt(row.supplierId) : null,
                        stockQuantity: parseInt(row.stockQuantity),
                        priceSupplier: row.priceSupplier ? parseFloat(row.priceSupplier) : null,
                        recordType: row.recordType,
                        deliveryDate: row.deliveryDate ? `${row.deliveryDate}T00:00:00` : null
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to update record");
                }
            } else {
                // Batch Create
                const requests = formRows.map(row => ({
                    productId: parseInt(row.productId),
                    supplierId: row.supplierId ? parseInt(row.supplierId) : null,
                    stockQuantity: parseInt(row.stockQuantity),
                    priceSupplier: row.priceSupplier ? parseFloat(row.priceSupplier) : null,
                    recordType: row.recordType,
                    deliveryDate: row.deliveryDate ? `${row.deliveryDate}T00:00:00` : null
                }));

                const response = await fetch(`${API_URL}/api/stock-records/batch`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(requests)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to save records");
                }
            }

            setShowModal(false);
            if (!filterProduct && !filterSupplier) {
                fetchStockRecords(currentPage);
            } else if (filterProduct) {
                fetchByProduct(filterProduct);
            } else if (filterSupplier) {
                fetchBySupplier(filterSupplier);
            }
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
            if (!filterProduct && !filterSupplier) {
                fetchStockRecords(currentPage);
            } else {
                if (filterProduct) fetchByProduct(filterProduct);
                if (filterSupplier) fetchBySupplier(filterSupplier);
            }
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
            'RECEIVED': 'bg-green-100 text-green-700',
            'WITHDRAWN': 'bg-red-100 text-red-700',
            // Legacy support
            'IN': 'bg-green-100 text-green-700',
            'OUT': 'bg-red-100 text-red-700'
        };
        return styles[type] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Restock</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage warehouse inventory and stock records</p>
                <p className="text-blue-600 dark:text-blue-400 text-xs mt-1">Note: Stock records update warehouse inventory. Use Products page to refill display stock.</p>
            </div>

            {/* Low Stock Alert */}
            {lowStockProducts.length > 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-yellow-100 dark:bg-yellow-800 rounded-lg">
                            <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-yellow-800 dark:text-yellow-300">Low Stock Alert</h3>
                            <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">{lowStockProducts.length} product(s) need restocking</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {lowStockProducts.slice(0, 5).map(product => (
                                    <button
                                        key={product.productId}
                                        onClick={() => handleAddNew(product.productId)}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-white dark:bg-gray-800 border border-yellow-300 dark:border-yellow-600 rounded-full text-sm text-yellow-800 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition-colors"
                                    >
                                        <span>{product.productName}</span>
                                        <span className="text-xs text-yellow-600 dark:text-yellow-400">({product.currentStock}/{product.reorderLevel})</span>
                                    </button>
                                ))}
                                {lowStockProducts.length > 5 && (
                                    <span className="text-sm text-yellow-600 dark:text-yellow-400 self-center">+{lowStockProducts.length - 5} more</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Records</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stockRecords.length}</p>
                        </div>
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Stock Received</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stockRecords.filter(r => r.recordType === 'RECEIVED' || r.recordType === 'IN').length}</p>
                        </div>
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Low Stock Items</p>
                            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{lowStockProducts.length}</p>
                        </div>
                        <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                            <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Products</p>
                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{products.length}</p>
                        </div>
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Product Filter */}
                        <select
                            value={filterProduct}
                            onChange={(e) => handleProductFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
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
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
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
                                className="px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm"
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
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-6">
                    {error}
                </div>
            )}

            {/* Stock Records Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                        <span className="ml-3 text-gray-500 dark:text-gray-400">Loading stock records...</span>
                    </div>
                ) : stockRecords.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <p className="text-gray-500 dark:text-gray-400">No stock records found</p>
                        <button onClick={() => handleAddNew()} className="mt-4 text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 font-medium">
                            Add your first stock record
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                                <tr>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Supplier</th>
                                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quantity</th>
                                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Unit Cost</th>
                                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Cost</th>
                                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {stockRecords.map((record) => (
                                    <tr key={record.recordId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 dark:text-white">{formatDate(record.deliveryDate)}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900 dark:text-white">{record.productName}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600 dark:text-gray-400">{record.supplierName || "-"}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRecordTypeBadge(record.recordType)}`}>
                                                {record.recordType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`font-semibold ${record.recordType === 'RECEIVED' || record.recordType === 'IN' ? 'text-green-600 dark:text-green-400' :
                                                record.recordType === 'WITHDRAWN' || record.recordType === 'OUT' ? 'text-red-600 dark:text-red-400' :
                                                    'text-gray-900 dark:text-white'
                                                }`}>
                                                {(record.recordType === 'RECEIVED' || record.recordType === 'IN') ? '+' : ''}
                                                {(record.recordType === 'WITHDRAWN' || record.recordType === 'OUT') ? '-' : ''}
                                                {Math.abs(record.stockQuantity)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-400">
                                            {formatCurrency(record.priceSupplier)}
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-gray-900 dark:text-white">
                                            {record.priceSupplier ? formatCurrency(record.priceSupplier * Math.abs(record.stockQuantity)) : "-"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(record)}
                                                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(record.recordId)}
                                                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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

            {/* Pagination Controls */}
            {!loading && !filterProduct && !filterSupplier && totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                        disabled={currentPage === 0}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        Page {currentPage + 1} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                        disabled={currentPage === totalPages - 1}
                        className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Record Count */}
            {!loading && stockRecords.length > 0 && (
                <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    Showing {stockRecords.length} stock records
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {editingRecord ? "Edit Stock Record" : "Batch Restock"}
                                </h2>
                                {!editingRecord && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add multiple items at once</p>
                                )}
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {formError && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm mb-4">
                                    {formError}
                                </div>
                            )}

                            <div className="space-y-4">
                                {formRows.map((row, index) => (
                                    <div key={index} className="p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 relative group">
                                        {/* Remove Row Button (Only for batch mode and > 1 row) */}
                                        {!editingRecord && formRows.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeRow(index)}
                                                className="absolute -top-2 -right-2 bg-red-100 dark:bg-red-900/50 text-red-500 dark:text-red-400 p-1 rounded-full shadow-sm hover:bg-red-200 dark:hover:bg-red-900 opacity-0 group-hover:opacity-100 transition-all"
                                                title="Remove row"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {/* Product Selection */}
                                            <div className="lg:col-span-2">
                                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Product <span className="text-red-500">*</span></label>
                                                <select
                                                    value={row.productId}
                                                    onChange={(e) => handleRowChange(index, 'productId', e.target.value)}
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 dark:text-white"
                                                >
                                                    <option value="">Select Product...</option>
                                                    {products.map(product => (
                                                        <option key={product.productId} value={product.productId}>
                                                            {product.productName} (Stock: {product.currentStock})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Quantity */}
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Quantity <span className="text-red-500">*</span></label>
                                                <input
                                                    type="number"
                                                    value={row.stockQuantity}
                                                    onChange={(e) => handleRowChange(index, 'stockQuantity', e.target.value)}
                                                    min="1"
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 dark:text-white"
                                                    placeholder="0"
                                                />
                                            </div>

                                            {/* Unit Cost */}
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Unit Cost</label>
                                                <div className="relative">
                                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-xs">₱</span>
                                                    <input
                                                        type="number"
                                                        value={row.priceSupplier}
                                                        onChange={(e) => handleRowChange(index, 'priceSupplier', e.target.value)}
                                                        step="0.01"
                                                        className="w-full pl-6 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 dark:text-white"
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                            </div>

                                            {/* Row 2: Supplier, Type, Date */}
                                            <div className="lg:col-span-2">
                                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Supplier</label>
                                                <select
                                                    value={row.supplierId}
                                                    onChange={(e) => handleRowChange(index, 'supplierId', e.target.value)}
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 dark:text-white"
                                                >
                                                    <option value="">Select Supplier (Optional)</option>
                                                    {suppliers.map(supplier => (
                                                        <option key={supplier.supplierId} value={supplier.supplierId}>
                                                            {supplier.supplierName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Type</label>
                                                <select
                                                    value={row.recordType}
                                                    onChange={(e) => handleRowChange(index, 'recordType', e.target.value)}
                                                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium ${row.recordType === 'RECEIVED' ? 'text-green-600 dark:text-green-400 border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/30' : 'text-red-600 dark:text-red-400 border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/30'
                                                        }`}
                                                >
                                                    <option value="RECEIVED">RECEIVED (+)</option>
                                                    <option value="WITHDRAWN">WITHDRAWN (-)</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Date</label>
                                                <input
                                                    type="date"
                                                    value={row.deliveryDate}
                                                    onChange={(e) => handleRowChange(index, 'deliveryDate', e.target.value)}
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 dark:text-white"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add Row Button */}
                            {!editingRecord && (
                                <button
                                    type="button"
                                    onClick={addRow}
                                    className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 hover:border-orange-500 dark:hover:border-orange-400 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all flex items-center justify-center gap-2 font-medium"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add Another Item
                                </button>
                            )}

                            {/* Modal Footer */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="px-6 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                                >
                                    {formLoading ? "Saving..." : (editingRecord ? "Update Record" : `Save ${formRows.length} Records`)}
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
