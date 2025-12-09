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

    useEffect(() => {
        fetchTransactions();
        fetchPaymentMethods();
        fetchSummary();
    }, []);

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

    const getPaymentMethodBadge = (method) => {
        const colors = {
            'Cash': 'bg-green-100 text-green-700',
            'Credit Card': 'bg-blue-100 text-blue-700',
            'Debit Card': 'bg-purple-100 text-purple-700',
            'GCash': 'bg-indigo-100 text-indigo-700',
            'Maya': 'bg-teal-100 text-teal-700',
            'Bank Transfer': 'bg-orange-100 text-orange-700'
        };
        return colors[method] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="p-6">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
                <p className="text-gray-500 text-sm mt-1">View and manage sales transactions</p>
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

                        {/* Add Transaction Button */}
                        <button
                            onClick={handleAddNew}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all shadow-sm hover:shadow-md"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Transaction
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
                        <button onClick={handleAddNew} className="mt-4 text-orange-500 hover:text-orange-600 font-medium">
                            Record your first transaction
                        </button>
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
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {transactions.map((transaction) => (
                                    <tr key={transaction.transactionId} className="hover:bg-gray-50 transition-colors">
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
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Transaction Count */}
            {!loading && transactions.length > 0 && (
                <div className="mt-4 text-sm text-gray-500">
                    Showing {transactions.length} transactions
                </div>
            )}

            {/* Add Transaction Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">Add New Transaction</h2>
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

                            {/* Amount */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Amount <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₱</span>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleInputChange}
                                        step="0.01"
                                        min="0.01"
                                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Payment Method <span className="text-red-500">*</span>
                                </label>
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

                            {/* Order ID */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Order ID (Optional)</label>
                                <input
                                    type="number"
                                    name="orderId"
                                    value={formData.orderId}
                                    onChange={handleInputChange}
                                    min="1"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="Enter order ID"
                                />
                            </div>

                            {/* Customer ID */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID (Optional)</label>
                                <input
                                    type="number"
                                    name="customerId"
                                    value={formData.customerId}
                                    onChange={handleInputChange}
                                    min="1"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="Enter customer ID"
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
                                    {formLoading ? "Saving..." : "Add Transaction"}
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
