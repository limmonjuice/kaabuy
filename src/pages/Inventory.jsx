import { useState, useEffect } from "react";
import { API_URL } from "../config/constants";
import { useAuth } from "../context/AuthContext";

function Inventory() {
    const { token } = useAuth();
    const [products, setProducts] = useState([]);
    const [stockRecords, setStockRecords] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [stockFilter, setStockFilter] = useState("");
    const [categories, setCategories] = useState([]);
    const [expandedProduct, setExpandedProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Reset to first page when filtering changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategory, stockFilter]);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/products`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Failed to fetch products");
            const data = await response.json();
            setProducts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_URL}/api/products/categories`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            }
        } catch (err) {
            console.error("Failed to fetch categories", err);
        }
    };

    const fetchStockRecordsForProduct = async (productId) => {
        try {
            const response = await fetch(`${API_URL}/api/stock-records/product/${productId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setStockRecords(prev => ({ ...prev, [productId]: data }));
            }
        } catch (err) {
            console.error("Failed to fetch stock records", err);
        }
    };

    const handleExpandProduct = (productId) => {
        if (expandedProduct === productId) {
            setExpandedProduct(null);
        } else {
            setExpandedProduct(productId);
            if (!stockRecords[productId]) {
                fetchStockRecordsForProduct(productId);
            }
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || product.category === selectedCategory;
        const matchesStock = !stockFilter ||
            (stockFilter === "out" && product.currentStock === 0) ||
            (stockFilter === "low" && product.currentStock > 0 && product.currentStock <= product.reorderLevel) ||
            (stockFilter === "ok" && product.currentStock > product.reorderLevel);
        return matchesSearch && matchesCategory && matchesStock;
    });

    const getStockStatus = (product) => {
        if (product.currentStock === 0) {
            return { label: "Out of Stock", color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400", barColor: "bg-red-500" };
        } else if (product.currentStock <= product.reorderLevel) {
            return { label: "Low Stock", color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400", barColor: "bg-yellow-500" };
        }
        return { label: "In Stock", color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400", barColor: "bg-green-500" };
    };

    const getStockPercentage = (product) => {
        const maxStock = Math.max(product.reorderLevel * 3, product.currentStock, 100);
        return Math.min((product.currentStock / maxStock) * 100, 100);
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
            'RECEIVED': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
            'WITHDRAWN': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
            // Legacy support
            'IN': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
            'OUT': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
        };
        return styles[type] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    };

    // Summary stats
    const totalProducts = products.length;
    const outOfStock = products.filter(p => p.currentStock === 0).length;
    const lowStock = products.filter(p => p.currentStock > 0 && p.currentStock <= p.reorderLevel).length;
    const totalStockValue = products.reduce((sum, p) => sum + (p.currentStock * (p.basePrice || 0)), 0);

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Monitor stock levels and inventory movement</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Products</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalProducts}</p>
                        </div>
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Out of Stock</p>
                            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{outOfStock}</p>
                        </div>
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Low Stock</p>
                            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{lowStock}</p>
                        </div>
                        <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                            <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Stock Value</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totalStockValue)}</p>
                        </div>
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>

                    {/* Category Filter */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat, index) => (
                            <option key={index} value={cat}>{cat}</option>
                        ))}
                    </select>

                    {/* Stock Filter */}
                    <select
                        value={stockFilter}
                        onChange={(e) => setStockFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                        <option value="">All Stock Levels</option>
                        <option value="out">Out of Stock</option>
                        <option value="low">Low Stock</option>
                        <option value="ok">In Stock</option>
                    </select>

                    {(searchTerm || selectedCategory || stockFilter) && (
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedCategory("");
                                setStockFilter("");
                            }}
                            className="px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-6">
                    {error}
                </div>
            )}

            {/* Inventory List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                        <span className="ml-3 text-gray-500 dark:text-gray-400">Loading inventory...</span>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <p className="text-gray-500 dark:text-gray-400">No products found</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {filteredProducts
                            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                            .map((product) => {
                                const status = getStockStatus(product);
                                const isExpanded = expandedProduct === product.productId;
                                const productRecords = stockRecords[product.productId] || [];

                                return (
                                    <div key={product.productId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        {/* Product Row */}
                                        <div
                                            className="p-4 cursor-pointer"
                                            onClick={() => handleExpandProduct(product.productId)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4 flex-1">
                                                    {/* Expand Icon */}
                                                    <svg
                                                        className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>

                                                    {/* Product Info */}
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3">
                                                            <h3 className="font-medium text-gray-900 dark:text-white">{product.productName}</h3>
                                                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${status.color}`}>
                                                                {status.label}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                            <span>{product.category || "Uncategorized"}</span>
                                                            <span>Unit: {product.unit}</span>
                                                            <span>Base Price: {formatCurrency(product.basePrice)}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Stock Info */}
                                                <div className="flex items-center gap-8">
                                                    {/* Backroom Stock */}
                                                    <div className="w-48">
                                                        <div className="flex items-center justify-between text-sm mb-1">
                                                            <span className="text-gray-500 dark:text-gray-400">Stock</span>
                                                            <span className="font-medium text-blue-600 dark:text-blue-400">
                                                                {product.currentStock} {product.unit}
                                                            </span>
                                                        </div>
                                                        <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full ${status.barColor} transition-all`}
                                                                style={{ width: `${getStockPercentage(product)}%` }}
                                                            />
                                                        </div>
                                                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                            Reorder at: {product.reorderLevel} {product.unit}
                                                        </div>
                                                    </div>


                                                    {/* Stock Value */}
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Stock Value</p>
                                                        <p className="font-semibold text-gray-900 dark:text-white">
                                                            {formatCurrency(product.currentStock * (product.basePrice || 0))}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expanded Stock Records */}
                                        {isExpanded && (
                                            <div className="px-4 pb-4 bg-gray-50 dark:bg-gray-900/50">
                                                <div className="ml-9 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                                    <div className="px-4 py-3 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                                                        <h4 className="font-medium text-gray-700 dark:text-gray-200">Stock Movement History</h4>
                                                    </div>
                                                    {productRecords.length === 0 ? (
                                                        <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                                                            No stock records found for this product
                                                        </div>
                                                    ) : (
                                                        <table className="w-full">
                                                            <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-500 dark:text-gray-400 uppercase">
                                                                <tr>
                                                                    <th className="text-left px-4 py-2">Date</th>
                                                                    <th className="text-center px-4 py-2">Type</th>
                                                                    <th className="text-center px-4 py-2">Quantity</th>
                                                                    <th className="text-left px-4 py-2">Supplier</th>
                                                                    <th className="text-right px-4 py-2">Unit Cost</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                                                                {productRecords.slice(0, 10).map((record) => (
                                                                    <tr key={record.recordId}>
                                                                        <td className="px-4 py-2 text-gray-600 dark:text-gray-300">
                                                                            {formatDate(record.deliveryDate)}
                                                                        </td>
                                                                        <td className="px-4 py-2 text-center">
                                                                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getRecordTypeBadge(record.recordType)}`}>
                                                                                {record.recordType}
                                                                            </span>
                                                                        </td>
                                                                        <td className="px-4 py-2 text-center">
                                                                            <span className={`font-medium ${record.recordType === 'RECEIVED' || record.recordType === 'IN' ? 'text-green-600 dark:text-green-400' :
                                                                                record.recordType === 'WITHDRAWN' || record.recordType === 'OUT' ? 'text-red-600 dark:text-red-400' :
                                                                                    'text-gray-600 dark:text-gray-300'
                                                                                }`}>
                                                                                {(record.recordType === 'RECEIVED' || record.recordType === 'IN') ? '+' : ''}
                                                                                {(record.recordType === 'WITHDRAWN' || record.recordType === 'OUT') ? '-' : ''}
                                                                                {Math.abs(record.stockQuantity)}
                                                                            </span>
                                                                        </td>
                                                                        <td className="px-4 py-2 text-gray-600 dark:text-gray-300">
                                                                            {record.supplierName || "-"}
                                                                        </td>
                                                                        <td className="px-4 py-2 text-right text-gray-600 dark:text-gray-300">
                                                                            {formatCurrency(record.priceSupplier)}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    )}
                                                    {productRecords.length > 10 && (
                                                        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700/50 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-600">
                                                            Showing 10 of {productRecords.length} records
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                    </div>
                )}


                {/* Pagination Controls */}
                {filteredProducts.length > itemsPerPage && (
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === 1
                                ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 shadow-sm'
                                }`}
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            Page <span className="font-semibold text-gray-900 dark:text-white">{currentPage}</span> of <span className="font-semibold text-gray-900 dark:text-white">{Math.ceil(filteredProducts.length / itemsPerPage)}</span>
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredProducts.length / itemsPerPage)))}
                            disabled={currentPage === Math.ceil(filteredProducts.length / itemsPerPage)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === Math.ceil(filteredProducts.length / itemsPerPage)
                                ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                : 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm shadow-orange-500/20'
                                }`}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* Product Count */}
            {
                !loading && filteredProducts.length > 0 && (
                    <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                            Showing {filteredProducts.length} results
                        </div>
                    </div>
                )
            }
        </div >
    );
}

export default Inventory;
