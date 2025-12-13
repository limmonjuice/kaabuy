import { useState, useEffect } from "react";
import { API_URL } from "../config/constants";
import { useAuth } from "../context/AuthContext";
import ViewOnlyBanner from "../components/ViewOnlyBanner";

function Dashboard() {
    const { token, user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedPeriod, setSelectedPeriod] = useState("week");
    const [salesData, setSalesData] = useState([]);
    const [hoveredPoint, setHoveredPoint] = useState(null);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    useEffect(() => {
        if (stats) {
            fetchSalesChartData();
        }
    }, [selectedPeriod, stats]);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/dashboard`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setStats(data);
            } else {
                setError("Failed to load dashboard data");
            }
        } catch (err) {
            setError("Error connecting to server");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchSalesChartData = async () => {
        try {
            const response = await fetch(`${API_URL}/api/dashboard/sales-chart?period=${selectedPeriod}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setSalesData(data);
            } else {
                console.error("Failed to load sales chart data");
            }
        } catch (err) {
            console.error("Error loading sales chart data:", err);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getMaxValue = () => {
        if (salesData.length === 0) return 1000;
        const max = Math.max(...salesData.map(d => d.value));
        return Math.ceil(max / 1000) * 1000;
    };

    const getYAxisLabels = () => {
        const max = getMaxValue();
        return [max, max * 0.75, max * 0.5, max * 0.25, 0];
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-sm">
                    <div className="flex items-center">
                        <svg className="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex flex-col">
            {/* View Only Banner for Staff */}
            {user?.role === 'staff' && (
                <div className="flex-shrink-0 px-6 pt-6">
                    <ViewOnlyBanner message="Dashboard is view-only for staff. Contact owner for more access." />
                </div>
            )}

            <div className="flex-1 overflow-y-auto px-6 pb-6 pt-6">
                <div className="h-full flex flex-col gap-6">
                    {/* Header Section */}
                    <div className="flex-shrink-0 bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 rounded-2xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold mb-1">
                                    Welcome back, {user?.firstName || 'User'}! 👋
                                </h1>
                                <p className="text-white/90">Here's what's happening with your store today</p>
                            </div>
                            <div className="hidden lg:block text-right bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3">
                                <p className="text-sm text-white/80">Store</p>
                                <p className="text-xl font-semibold">{user?.storeName || 'Kaabuy'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
                        {/* Left Column - Stats and Chart */}
                        <div className="col-span-12 xl:col-span-8 flex flex-col gap-6 min-h-0">
                            {/* Key Metrics */}
                            <div className="flex-shrink-0 grid grid-cols-4 gap-4">
                                <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="text-white/80 text-xs font-medium mb-1">Today's Sales</p>
                                    <p className="text-white text-2xl font-bold">{formatCurrency(stats?.todaySales)}</p>
                                </div>

                                <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="text-white/80 text-xs font-medium mb-1">Products Sold</p>
                                    <p className="text-white text-2xl font-bold">{stats?.todayOrders || 0}</p>
                                </div>

                                <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="text-white/80 text-xs font-medium mb-1">Low Stock</p>
                                    <p className="text-white text-2xl font-bold">{stats?.lowStockProducts || 0}</p>
                                </div>

                                <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="text-white/80 text-xs font-medium mb-1">Customers</p>
                                    <p className="text-white text-2xl font-bold">{stats?.totalCustomers || 0}</p>
                                </div>
                            </div>

                            {/* Sales Chart - Takes remaining space */}
                            <div className="flex-1 bg-white rounded-2xl shadow-md border border-gray-100 p-6 min-h-0 flex flex-col">
                                <div className="flex-shrink-0 flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">Sales Analytics</h2>
                                        <p className="text-sm text-gray-500 mt-1">Track your revenue over time</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {[
                                            { value: 'today', label: 'Today' },
                                            { value: 'week', label: 'Week' },
                                            { value: 'month', label: 'Month' },
                                            { value: 'year', label: 'Year' }
                                        ].map((period) => (
                                            <button
                                                key={period.value}
                                                onClick={() => setSelectedPeriod(period.value)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                    selectedPeriod === period.value
                                                        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                            >
                                                {period.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Chart Area - Flexible */}
                                <div className="flex-1 relative bg-gradient-to-b from-orange-50/30 to-transparent rounded-xl p-4 min-h-0">
                                    <div className="h-full flex">
                                        {/* Y-axis */}
                                        <div className="flex flex-col justify-between text-xs text-gray-400 w-16 pr-3">
                                            {getYAxisLabels().map((label, i) => (
                                                <span key={i} className="text-right">{formatCurrency(label).replace('.00', '')}</span>
                                            ))}
                                        </div>

                                        {/* Chart Area */}
                                        <div className="flex-1 relative">
                                            <svg className="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="none">
                                                {/* Grid lines */}
                                                {[0, 1, 2, 3, 4].map((i) => (
                                                    <line
                                                        key={i}
                                                        x1="0"
                                                        y1={i * 75}
                                                        x2="800"
                                                        y2={i * 75}
                                                        stroke="#e5e7eb"
                                                        strokeWidth="1"
                                                        strokeDasharray="5,5"
                                                    />
                                                ))}

                                                {salesData.length > 0 && (
                                                    <>
                                                        <defs>
                                                            <linearGradient id="salesGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                                <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                                                                <stop offset="100%" stopColor="#f97316" stopOpacity="0.05" />
                                                            </linearGradient>
                                                        </defs>

                                                        <path
                                                            d={`
                                                                M 0 300
                                                                ${salesData.map((item, i) => {
                                                                    const x = (i / (salesData.length - 1)) * 800;
                                                                    const y = 300 - (item.value / getMaxValue()) * 280;
                                                                    return `L ${x} ${y}`;
                                                                }).join(' ')}
                                                                L 800 300
                                                                Z
                                                            `}
                                                            fill="url(#salesGradient)"
                                                        />

                                                        <path
                                                            d={`
                                                                M ${salesData.map((item, i) => {
                                                                    const x = (i / (salesData.length - 1)) * 800;
                                                                    const y = 300 - (item.value / getMaxValue()) * 280;
                                                                    return `${x},${y}`;
                                                                }).join(' L ')}
                                                            `}
                                                            fill="none"
                                                            stroke="#f97316"
                                                            strokeWidth="3"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />

                                                        {salesData.map((item, i) => {
                                                            const x = (i / (salesData.length - 1)) * 800;
                                                            const y = 300 - (item.value / getMaxValue()) * 280;
                                                            return (
                                                                <g key={i}>
                                                                    <circle
                                                                        cx={x}
                                                                        cy={y}
                                                                        r={hoveredPoint === i ? 6 : 4}
                                                                        fill="#f97316"
                                                                        className="cursor-pointer transition-all duration-200"
                                                                        onMouseEnter={() => setHoveredPoint(i)}
                                                                        onMouseLeave={() => setHoveredPoint(null)}
                                                                    />
                                                                    {hoveredPoint === i && (
                                                                        <>
                                                                            <circle cx={x} cy={y} r="10" fill="#f97316" opacity="0.2" />
                                                                            <circle cx={x} cy={y} r="15" fill="#f97316" opacity="0.1" />
                                                                        </>
                                                                    )}
                                                                </g>
                                                            );
                                                        })}
                                                    </>
                                                )}
                                            </svg>

                                            {/* Hover tooltip */}
                                            {hoveredPoint !== null && salesData[hoveredPoint] && (
                                                <div
                                                    className="absolute bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg pointer-events-none z-10"
                                                    style={{
                                                        left: `${(hoveredPoint / (salesData.length - 1)) * 100}%`,
                                                        top: `${100 - (salesData[hoveredPoint].value / getMaxValue()) * 93.3}%`,
                                                        transform: 'translate(-50%, -120%)'
                                                    }}
                                                >
                                                    <p className="text-xs font-medium mb-1">{salesData[hoveredPoint].fullLabel}</p>
                                                    <p className="text-sm font-bold">{formatCurrency(salesData[hoveredPoint].value)}</p>
                                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                                                        <div className="w-2 h-2 bg-gray-900 rotate-45 transform -translate-y-1"></div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* X-axis labels */}
                                            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 pb-2">
                                                {salesData.map((item, i) => (
                                                    <span
                                                        key={i}
                                                        className={`text-xs transition-colors ${
                                                            hoveredPoint === i ? 'text-orange-500 font-semibold' : 'text-gray-500'
                                                        }`}
                                                    >
                                                        {item.label}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Products and Transactions */}
                        <div className="col-span-12 xl:col-span-4 flex flex-col gap-6 min-h-0">
                            {/* Top Products */}
                            <div className="flex-1 bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col min-h-0">
                                <div className="flex-shrink-0 p-5 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-transparent">
                                    <h2 className="text-lg font-bold text-gray-900">Top Products</h2>
                                    <p className="text-xs text-gray-500 mt-1">Best sellers this month</p>
                                </div>
                                <div className="flex-1 overflow-y-auto p-5">
                                    {stats?.topProducts && stats.topProducts.length > 0 ? (
                                        <div className="space-y-3">
                                            {stats.topProducts.slice(0, 5).map((product, index) => (
                                                <div
                                                    key={product.productId}
                                                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm text-white ${
                                                            index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                                                            index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                                                            index === 2 ? 'bg-gradient-to-br from-orange-300 to-orange-400' :
                                                            'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600'
                                                        }`}>
                                                            #{index + 1}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-semibold text-sm text-gray-900 truncate">{product.productName}</p>
                                                            <p className="text-xs text-gray-500">{product.quantitySold} sold</p>
                                                        </div>
                                                    </div>
                                                    <p className="font-bold text-sm text-orange-500 ml-2">{formatCurrency(product.totalRevenue)}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <svg className="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                            <p className="text-gray-400 text-sm">No products data yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Recent Transactions */}
                            <div className="flex-1 bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col min-h-0">
                                <div className="flex-shrink-0 p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-transparent">
                                    <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
                                    <p className="text-xs text-gray-500 mt-1">Latest purchases</p>
                                </div>
                                <div className="flex-1 overflow-y-auto">
                                    {stats?.recentTransactions && stats.recentTransactions.length > 0 ? (
                                        <div className="divide-y divide-gray-100">
                                            {stats.recentTransactions.slice(0, 10).map((transaction) => (
                                                <div key={transaction.transactionId} className="p-4 hover:bg-gray-50 transition-colors">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-sm font-semibold text-gray-900">#{transaction.transactionId}</span>
                                                        <span className="text-sm font-bold text-gray-900">{formatCurrency(transaction.amount)}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-gray-600">{transaction.customerName || 'Guest'}</span>
                                                        <span className="text-xs text-gray-500">{formatDate(transaction.transactionDate)}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <svg className="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <p className="text-gray-400 text-sm">No transactions yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Quick Stats Summary */}
                            <div className="flex-shrink-0 grid grid-cols-3 gap-3">
                                <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-1">Products</p>
                                    <p className="text-xl font-bold text-gray-900">{stats?.totalProducts || 0}</p>
                                </div>

                                <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-1">Orders</p>
                                    <p className="text-xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
                                </div>

                                <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-1">Utang</p>
                                    <p className="text-xl font-bold text-red-500">{formatCurrency(stats?.totalUtang)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
