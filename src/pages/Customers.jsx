import { useState, useEffect } from "react";
import { API_URL } from "../config/constants";
import { useAuth } from "../context/AuthContext";
import { useRole } from "../hooks/useRole";

function Customers() {
    const { token } = useAuth();
    const { isOwner } = useRole();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showUtangOnly, setShowUtangOnly] = useState(false);
    const [summary, setSummary] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [expandedCustomer, setExpandedCustomer] = useState(null);
    const [customerTransactions, setCustomerTransactions] = useState({});
    const [paymentMethodFilters, setPaymentMethodFilters] = useState({});
    const [formData, setFormData] = useState({
        customerName: "",
        contactNumber: "",
        email: "",
        address: ""
    });
    const [paymentAmount, setPaymentAmount] = useState("");
    const [formError, setFormError] = useState("");
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        fetchCustomers();
        fetchSummary();
    }, []);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/customers`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error("Failed to fetch customers");
            const data = await response.json();
            setCustomers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchSummary = async () => {
        try {
            const response = await fetch(`${API_URL}/api/customers/summary`, {
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

    const fetchCustomersWithUtang = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/customers/with-utang`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setCustomers(data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            showUtangOnly ? fetchCustomersWithUtang() : fetchCustomers();
            return;
        }
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/customers/search?keyword=${encodeURIComponent(searchTerm)}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setCustomers(data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUtangFilter = (checked) => {
        setShowUtangOnly(checked);
        setSearchTerm("");
        if (checked) {
            fetchCustomersWithUtang();
        } else {
            fetchCustomers();
        }
    };

    const fetchTransactionsForCustomer = async (customerId) => {
        try {
            const response = await fetch(`${API_URL}/api/transactions/customer/${customerId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setCustomerTransactions(prev => ({ ...prev, [customerId]: data }));
            }
        } catch (err) {
            console.error("Failed to fetch transactions", err);
        }
    };

    const handleExpandCustomer = (customerId) => {
        if (expandedCustomer === customerId) {
            setExpandedCustomer(null);
        } else {
            setExpandedCustomer(customerId);
            if (!customerTransactions[customerId]) {
                fetchTransactionsForCustomer(customerId);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddNew = () => {
        setEditingCustomer(null);
        setFormData({
            customerName: "",
            contactNumber: "",
            email: "",
            address: ""
        });
        setFormError("");
        setShowModal(true);
    };

    const handleEdit = (customer) => {
        setEditingCustomer(customer);
        setFormData({
            customerName: customer.customerName,
            contactNumber: customer.contactNumber || "",
            email: customer.email || "",
            address: customer.address || ""
        });
        setFormError("");
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");
        setFormLoading(true);

        if (!formData.customerName.trim()) {
            setFormError("Customer name is required");
            setFormLoading(false);
            return;
        }

        try {
            const url = editingCustomer
                ? `${API_URL}/api/customers/${editingCustomer.customerId}`
                : `${API_URL}/api/customers`;

            const response = await fetch(url, {
                method: editingCustomer ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to save customer");
            }

            setShowModal(false);
            fetchCustomers();
            fetchSummary();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (customerId) => {
        if (!confirm("Are you sure you want to delete this customer?")) return;

        try {
            const response = await fetch(`${API_URL}/api/customers/${customerId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("Failed to delete customer");
            fetchCustomers();
            fetchSummary();
        } catch (err) {
            alert(err.message);
        }
    };

    const openPaymentModal = (customer) => {
        setSelectedCustomer(customer);
        setPaymentAmount("");
        setFormError("");
        setShowPaymentModal(true);
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setFormError("");
        setFormLoading(true);

        if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
            setFormError("Please enter a valid payment amount");
            setFormLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/customers/${selectedCustomer.customerId}/pay`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ amount: parseFloat(paymentAmount) })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to record payment");
            }

            setShowPaymentModal(false);
            fetchCustomers();
            fetchSummary();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setFormLoading(false);
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

    const getUtangBadge = (totalUtang) => {
        const amount = parseFloat(totalUtang) || 0;
        if (amount === 0) {
            return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Paid</span>;
        } else if (amount > 1000) {
            return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">High</span>;
        }
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">Has Utang</span>;
    };

    const getPaymentMethodBadge = (method) => {
        const styles = {
            'CASH': 'bg-green-100 text-green-700',
            'UTANG': 'bg-red-100 text-red-700',
            'PAYMENT': 'bg-emerald-100 text-emerald-700',
            'GCASH': 'bg-blue-100 text-blue-700',
            'CARD': 'bg-purple-100 text-purple-700'
        };
        return styles[method] || 'bg-gray-100 text-gray-700';
    };

    const formatCurrency = (amount) => {
        if (!amount) return "₱0.00";
        return `₱${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    };

    return (
        <div className="p-6">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
                <p className="text-gray-500 text-sm mt-1">Manage your customers and track utang</p>
            </div>

            {/* Summary Cards */}
            {summary && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Customers</p>
                                <p className="text-2xl font-bold text-gray-900">{summary.totalCustomers || 0}</p>
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
                                <p className="text-sm text-gray-500">With Utang</p>
                                <p className="text-2xl font-bold text-orange-600">{summary.customersWithUtang}</p>
                            </div>
                            <div className="p-3 bg-orange-100 rounded-lg">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Utang</p>
                                <p className="text-2xl font-bold text-red-600">₱{(summary.totalUtang || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                            </div>
                            <div className="p-3 bg-red-100 rounded-lg">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Transactions</p>
                                <p className="text-2xl font-bold text-green-600">{summary.totalTransactions || 0}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Search */}
                    <div className="flex items-center gap-2 flex-1 max-w-md">
                        <div className="relative flex-1">
                            <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search customers..."
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

                    <div className="flex items-center gap-4">
                        {/* Utang Filter */}
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showUtangOnly}
                                onChange={(e) => handleUtangFilter(e.target.checked)}
                                className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                            />
                            <span className="text-sm text-gray-700">With Utang Only</span>
                        </label>

                        {/* Add Customer Button */}
                        <button
                            onClick={handleAddNew}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all shadow-sm hover:shadow-md"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Customer
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

            {/* Customers Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                        <span className="ml-3 text-gray-500">Loading customers...</span>
                    </div>
                ) : customers.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p className="text-gray-500">No customers found</p>
                        <button onClick={handleAddNew} className="mt-4 text-orange-500 hover:text-orange-600 font-medium">
                            Add your first customer
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {customers.map((customer) => {
                            const isExpanded = expandedCustomer === customer.customerId;
                            const transactions = customerTransactions[customer.customerId] || [];
                            const currentFilter = paymentMethodFilters[customer.customerId] || "";
                            const filteredTransactions = currentFilter
                                ? transactions.filter(t => t.paymentMethod && t.paymentMethod.toUpperCase() === currentFilter.toUpperCase())
                                : transactions;

                            return (
                                <div key={customer.customerId} className="hover:bg-gray-50 transition-colors">
                                    {/* Customer Row */}
                                    <div className="p-4 cursor-pointer" onClick={() => handleExpandCustomer(customer.customerId)}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 flex-1">
                                                {/* Expand Icon */}
                                                <svg
                                                    className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>

                                                {/* Customer Info */}
                                                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                    {customer.customerName?.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-900">{customer.customerName}</div>
                                                    <div className="text-xs text-gray-500">
                                                        {customer.contactNumber || "No contact"} • {customer.email || "No email"}
                                                    </div>
                                                </div>

                                                {/* Transaction Count */}
                                                <div className="text-center px-4">
                                                    <p className="text-sm text-gray-500">Transactions</p>
                                                    <p className="font-medium text-gray-900">{customer.transactionCount || 0}</p>
                                                </div>

                                                {/* Utang */}
                                                <div className="text-right px-4">
                                                    <p className="text-sm text-gray-500">Utang</p>
                                                    <p className={`font-semibold ${parseFloat(customer.totalUtang) > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                                                        {formatCurrency(customer.totalUtang)}
                                                    </p>
                                                </div>

                                                {/* Status Badge */}
                                                <div>
                                                    {getUtangBadge(customer.totalUtang)}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-1 ml-4" onClick={(e) => e.stopPropagation()}>
                                                {parseFloat(customer.totalUtang) > 0 && (
                                                    <button
                                                        onClick={() => openPaymentModal(customer)}
                                                        className="p-2 text-green-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Record Payment"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                        </svg>
                                                    </button>
                                                )}
                                                {isOwner && (
                                                    <>
                                                        <button
                                                            onClick={() => handleEdit(customer)}
                                                            className="p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(customer.customerId)}
                                                            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Transactions */}
                                    {isExpanded && (
                                        <div className="px-4 pb-4 bg-gray-50">
                                            <div className="ml-9 bg-white rounded-lg border border-gray-200 overflow-hidden">
                                                <div className="px-4 py-3 bg-gray-100 border-b border-gray-200 flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-medium text-gray-700">Transaction History</h4>
                                                        {currentFilter && (
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                Showing {filteredTransactions.length} of {transactions.length} transactions
                                                            </p>
                                                        )}
                                                    </div>
                                                    {/* Payment Method Filter */}
                                                    <select
                                                        value={currentFilter}
                                                        onChange={(e) => setPaymentMethodFilters({
                                                            ...paymentMethodFilters,
                                                            [customer.customerId]: e.target.value
                                                        })}
                                                        className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <option value="">All Transactions</option>
                                                        <option value="CASH">Cash Purchases</option>
                                                        <option value="UTANG">Utang (Credit)</option>
                                                        <option value="PAYMENT">Utang Payments</option>
                                                        <option value="GCASH">GCash</option>
                                                        <option value="CARD">Card</option>
                                                    </select>
                                                </div>
                                                {filteredTransactions.length === 0 ? (
                                                    <div className="p-4 text-center text-gray-500 text-sm">
                                                        {currentFilter
                                                            ? `No ${currentFilter} transactions found for this customer`
                                                            : "No transactions found for this customer"
                                                        }
                                                    </div>
                                                ) : (
                                                    <table className="w-full">
                                                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                                                            <tr>
                                                                <th className="text-left px-4 py-2">Date</th>
                                                                <th className="text-left px-4 py-2">Transaction ID</th>
                                                                <th className="text-center px-4 py-2">Payment Method</th>
                                                                <th className="text-center px-4 py-2">Items</th>
                                                                <th className="text-right px-4 py-2">Total Amount</th>
                                                                <th className="text-right px-4 py-2">Amount Paid</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-100 text-sm">
                                                            {filteredTransactions.slice(0, 10).map((transaction) => (
                                                                <tr key={transaction.transactionId}>
                                                                    <td className="px-4 py-2 text-gray-600">
                                                                        {formatDate(transaction.transactionDate)}
                                                                    </td>
                                                                    <td className="px-4 py-2 text-gray-600">
                                                                        #{transaction.transactionId}
                                                                    </td>
                                                                    <td className="px-4 py-2 text-center">
                                                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPaymentMethodBadge(transaction.paymentMethod)}`}>
                                                                            {transaction.paymentMethod}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-4 py-2 text-center text-gray-600">
                                                                        {transaction.itemCount || 0}
                                                                    </td>
                                                                    <td className="px-4 py-2 text-right font-medium text-gray-900">
                                                                        {formatCurrency(transaction.totalAmount)}
                                                                    </td>
                                                                    <td className="px-4 py-2 text-right text-gray-600">
                                                                        {formatCurrency(transaction.amountPaid)}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                )}
                                                {filteredTransactions.length > 10 && (
                                                    <div className="px-4 py-2 bg-gray-50 text-center text-sm text-gray-500 border-t border-gray-200">
                                                        Showing 10 of {filteredTransactions.length} transactions
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
            </div>

            {/* Customer Count */}
            {!loading && customers.length > 0 && (
                <div className="mt-4 text-sm text-gray-500">
                    Showing {customers.length} customers
                </div>
            )}

            {/* Add/Edit Customer Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingCustomer ? "Edit Customer" : "Add New Customer"}
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

                            {/* Customer Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Customer Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="customerName"
                                    value={formData.customerName}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="Enter customer name"
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
                                    placeholder="e.g., 09123456789"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="customer@email.com"
                                />
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                    placeholder="Enter address"
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
                                    {formLoading ? "Saving..." : (editingCustomer ? "Update" : "Add Customer")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && selectedCustomer && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">Record Payment</h2>
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handlePayment} className="p-6 space-y-4">
                            {formError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                    {formError}
                                </div>
                            )}

                            {/* Customer Info */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center mb-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                                        {selectedCustomer.customerName?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{selectedCustomer.customerName}</div>
                                        <div className="text-xs text-gray-500">{selectedCustomer.contactNumber || "No contact"}</div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                                    <span className="text-sm text-gray-500">Current Utang:</span>
                                    <span className="text-lg font-bold text-red-600">
                                        ₱{parseFloat(selectedCustomer.totalUtang || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>

                            {/* Payment Amount */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Payment Amount <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₱</span>
                                    <input
                                        type="number"
                                        value={paymentAmount}
                                        onChange={(e) => setPaymentAmount(e.target.value)}
                                        step="0.01"
                                        min="0.01"
                                        max={parseFloat(selectedCustomer.totalUtang)}
                                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="0.00"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setPaymentAmount(parseFloat(selectedCustomer.totalUtang).toString())}
                                    className="mt-2 text-sm text-orange-500 hover:text-orange-600"
                                >
                                    Pay full amount
                                </button>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setShowPaymentModal(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {formLoading ? "Processing..." : "Record Payment"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Customers;
