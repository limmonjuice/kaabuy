import { useState, useEffect } from "react";
import { API_URL } from "../config/constants";
import { useAuth } from "../context/AuthContext";
function Transactions() {
    const { token } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [summary, setSummary] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [dateFilter, setDateFilter] = useState({ startDate: "", endDate: "" });
    const [formData, setFormData] = useState({
        amount: "",
        paymentMethod: "Cash",
        orderId: "",
        customerId: ""
    });
    const [formError, setFormError] = useState("");
    const [formLoading, setFormLoading] = useState(false);
    // NEW: State for expanded row
    const [expandedRow, setExpandedRow] = useState(null);
    // NEW: Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    useEffect(() => {
        fetchTransactions();
        fetchPaymentMethods();
        fetchSummary();
    }, []);
    // Reset to first page when transactions change (e.g. filtering)
    useEffect(() => {
        setCurrentPage(1);
    }, [transactions]);
    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/transactions`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error("Failed to fetch transactions");
            const data = await response.json();
            setTransactions(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    const fetchPaymentMethods = async () => {
        try {
            const response = await fetch(`${API_URL}/api/transactions/payment-methods`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setPaymentMethods(data);
            }
        } catch (err) {
            console.error("Failed to fetch payment methods", err);
        }
    };
    const fetchSummary = async () => {
        try {
            const response = await fetch(`${API_URL}/api/transactions/summary`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setSummary(data);
            }
        } catch (err) {
            console.error("Failed to fetch summary", err);
        }
    };
    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            fetchTransactions();
            return;
        }
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/transactions/search?keyword=${encodeURIComponent(searchTerm)}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setTransactions(data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    const handleDateFilter = async () => {
        if (!dateFilter.startDate || !dateFilter.endDate) {
            fetchTransactions();
            return;
        }
        try {
            setLoading(true);
            const response = await fetch(
                `${API_URL}/api/transactions/filter/date?startDate=${dateFilter.startDate}&endDate=${dateFilter.endDate}`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            if (response.ok) {
                const data = await response.json();
                setTransactions(data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    const handlePaymentMethodFilter = async (method) => {
        setSelectedPaymentMethod(method);
        if (!method) {
            fetchTransactions();
            return;
        }
        try {
            setLoading(true);
            const response = await fetch(
                `${API_URL}/api/transactions/filter/payment-method?method=${encodeURIComponent(method)}`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            if (response.ok) {
                const data = await response.json();
                setTransactions(data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleAddNew = () => {
        setFormData({
            amount: "",
            paymentMethod: "Cash",
            orderId: "",
            customerId: ""
        });
        setFormError("");
        setShowModal(true);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");
        setFormLoading(true);
        if (!formData.amount || !formData.paymentMethod) {
            setFormError("Amount and payment method are required");
            setFormLoading(false);
            return;
        }
        try {
            const response = await fetch(`${API_URL}/api/transactions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: parseFloat(formData.amount),
                    paymentMethod: formData.paymentMethod,
                    orderId: formData.orderId ? parseInt(formData.orderId) : null,
                    customerId: formData.customerId ? parseInt(formData.customerId) : null
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create transaction");
            }
            setShowModal(false);
            fetchTransactions();
            fetchSummary();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setFormLoading(false);
        }
    };
    const clearFilters = () => {
        setSearchTerm("");
        setSelectedPaymentMethod("");
        setDateFilter({ startDate: "", endDate: "" });
        fetchTransactions();
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(amount);
    };
    const getPaymentMethodBadge = (method) => {
        const colors = {
            'Cash': 'bg-green-100 text-green-700',
            'Credit Card': 'bg-blue-100 text-blue-700',
            'Debit Card': 'bg-purple-100 text-purple-700',
            'GCash': 'bg-indigo-100 text-indigo-700',
            'Maya': 'bg-teal-100 text-teal-700',
            'Bank Transfer': 'bg-orange-100 text-orange-700',
            'UTANG': 'bg-red-100 text-red-700',
            'CREDIT': 'bg-red-100 text-red-700'
        };
        return colors[method] || 'bg-gray-100 text-gray-700';
    };
    // NEW: Toggle Row Function
    const toggleRow = (transactionId) => {
        if (expandedRow === transactionId) {
            setExpandedRow(null);
        } else {
            setExpandedRow(transactionId);
        }
    };
    return (
        <div className="p-6">
            {/* Page Header */}
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
                    <p className="text-gray-500 text-sm mt-1">View and manage sales transactions</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg shadow-sm hover:from-orange-500 hover:to-orange-600 transition-colors"
                >
                    + New Transaction
                </button>
            </div>
            {/* Summary Cards */}
            {summary && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Transactions</p>
                                <p className="text-2xl font-bold text-gray-900">{summary.totalTransactions || 0}</p>
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
                                <p className="text-sm text-gray-500">Total Revenue</p>
                                <p className="text-2xl font-bold text-green-600">₱{(summary.totalRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Today's Sales</p>
                                <p className="text-2xl font-bold text-orange-600">₱{(summary.todaySales || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                            </div>
                            <div className="p-3 bg-orange-100 rounded-lg">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Average Transaction</p>
                                <p className="text-2xl font-bold text-purple-600">₱{(summary.averageTransaction || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Action Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Search */}
                    <div className="flex items-center gap-2 flex-1 max-w-md">
                        <div className="relative flex-1">
                            <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search by customer..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Search
                        </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Date Filter */}
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                value={dateFilter.startDate}
                                onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                            />
                            <span className="text-gray-500">to</span>
                            <input
                                type="date"
                                value={dateFilter.endDate}
                                onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                            />
                            <button
                                onClick={handleDateFilter}
                                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                            >
                                Filter
                            </button>
                        </div>
                        {/* Payment Method Filter */}
                        <select
                            value={selectedPaymentMethod}
                            onChange={(e) => handlePaymentMethodFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                        >
                            <option value="">All Payment Methods</option>
                            {paymentMethods.map((method, index) => (
                                <option key={index} value={method}>{method}</option>
                            ))}
                        </select>
                        {/* Clear Filters */}
                        <button
                            onClick={clearFilters}
                            className="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </div>
            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                    {error}
                </div>
            )}
            {/* Transactions Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                        <span className="ml-3 text-gray-500">Loading transactions...</span>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className="text-gray-500">No transactions found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Transaction ID</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment Method</th>
                                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {transactions
                                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                    .map((transaction) => (
                                        <>
                                            <tr
                                                key={transaction.transactionId}
                                                onClick={() => toggleRow(transaction.transactionId)}
                                                className={`hover:bg-slate-50 transition-colors cursor-pointer group ${expandedRow === transaction.transactionId ? 'bg-slate-50' : ''}`}
                                            >
                                                <td className="px-6 py-4">
                                                    <span className="font-mono text-sm text-gray-900">#{transaction.transactionId}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">{formatDate(transaction.transactionDate)}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900">{transaction.customerName || "Walk-in Customer"}</div>
                                                    {transaction.customerId && (
                                                        <div className="text-xs text-gray-500">ID: {transaction.customerId}</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {transaction.orderId ? (
                                                        <span className="font-mono text-sm text-blue-600">#{transaction.orderId}</span>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPaymentMethodBadge(transaction.paymentMethod)}`}>
                                                        {transaction.paymentMethod}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="font-semibold text-gray-900">
                                                        ₱{parseFloat(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center text-gray-400">
                                                    <svg
                                                        className={`w-5 h-5 transition-transform duration-200 ${expandedRow === transaction.transactionId ? 'rotate-180 text-orange-500' : 'group-hover:text-gray-600'}`}
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </td>
                                            </tr>
                                            {/* Expanded Row Detail */}
                                            {expandedRow === transaction.transactionId && (
                                                <tr className="bg-slate-50 ring-1 ring-gray-200 ring-inset">
                                                    <td colSpan="7" className="px-6 pb-6 pt-2">
                                                        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm animate-fadeIn">
                                                            <h4 className="text-sm font-bold text-gray-700 mb-3 border-b border-gray-100 pb-2">Order Details</h4>
                                                            {transaction.items && transaction.items.length > 0 ? (
                                                                <div className="overflow-x-auto">
                                                                    <table className="w-full text-xs">
                                                                        <thead>
                                                                            <tr className="text-gray-500 border-b border-gray-100">
                                                                                <th className="text-left py-2 pl-2">Product Name</th>
                                                                                <th className="text-center py-2">Quantity</th>
                                                                                <th className="text-right py-2">Unit Price</th>
                                                                                <th className="text-right py-2 pr-2">Subtotal</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {transaction.items.map((item, idx) => (
                                                                                <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                                                                                    <td className="py-2 pl-2 text-gray-800 font-medium">{item.productName}</td>
                                                                                    <td className="py-2 text-center text-gray-600">x{item.quantity}</td>
                                                                                    <td className="py-2 text-right text-gray-600">{formatCurrency(item.unitPrice)}</td>
                                                                                    <td className="py-2 pr-2 text-right font-medium text-gray-800">{formatCurrency(item.subtotal)}</td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                        <tfoot className="bg-gray-50">
                                                                            <tr>
                                                                                <td colSpan="3" className="py-2 text-right font-bold text-gray-700">Total:</td>
                                                                                <td className="py-2 pr-2 text-right font-bold text-orange-600">{formatCurrency(transaction.amount)}</td>
                                                                            </tr>
                                                                        </tfoot>
                                                                    </table>
                                                                </div>
                                                            ) : (
                                                                <p className="text-sm text-gray-500 italic text-center py-2">No item details available for this transaction.</p>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    ))}
                            </tbody>
                        </table>
                        {/* Pagination Controls */}
                        {transactions.length > itemsPerPage && (
                            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${currentPage === 1
                                        ? 'text-gray-300 cursor-not-allowed'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Previous
                                </button>
                                <span className="text-sm text-gray-600">
                                    Page <span className="font-semibold text-gray-900">{currentPage}</span> of <span className="font-semibold text-gray-900">{Math.ceil(transactions.length / itemsPerPage)}</span>
                                </span>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(transactions.length / itemsPerPage)))}
                                    disabled={currentPage === Math.ceil(transactions.length / itemsPerPage)}
                                    className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${currentPage === Math.ceil(transactions.length / itemsPerPage)
                                        ? 'text-gray-300 cursor-not-allowed'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    Next
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {/* Transaction Count */}
            {!loading && transactions.length > 0 && (
                <div className="mt-4 text-sm text-gray-500">
                    Showing {transactions.length} transactions
                </div>
            )}
            {/* Add New Transaction Modal (Restored) */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">New Transaction</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                                <input
                                    type="number"
                                    name="amount"
                                    step="0.01"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                                <select
                                    name="paymentMethod"
                                    value={formData.paymentMethod}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                                >
                                    <option value="Cash">Cash</option>
                                    <option value="Credit Card">Credit Card</option>
                                    <option value="Debit Card">Debit Card</option>
                                    <option value="GCash">GCash</option>
                                    <option value="Maya">Maya</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
                                    <input
                                        type="number"
                                        name="orderId"
                                        value={formData.orderId}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="Optional"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
                                    <input
                                        type="number"
                                        name="customerId"
                                        value={formData.customerId}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="Optional"
                                    />
                                </div>
                            </div>
                            {formError && (
                                <p className="text-sm text-red-600">{formError}</p>
                            )}
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                                >
                                    {formLoading ? "Creating..." : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
export default Transactions;