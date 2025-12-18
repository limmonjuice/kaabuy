import { useState, useEffect } from "react";
import { API_URL } from "../config/constants";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';
import CustomTooltip from '../components/CustomTooltip';

function Dashboard() {
    const { token, user } = useAuth();
    const { theme } = useTheme();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedPeriod, setSelectedPeriod] = useState("week");
    const [salesData, setSalesData] = useState([]);

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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-purple-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto mb-4 shadow-2xl shadow-orange-500/50"></div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium animate-pulse">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-6 rounded-lg shadow-sm">
                    <div className="flex items-center">
                        <svg className="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-purple-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 animate-gradient-x bg-[length:200%_200%] overflow-hidden flex flex-col">
            {/* View Only Banner for Staff */}
            {user?.role === 'staff' && (
                <div className="flex-shrink-0 px-6 pt-6">
                    <ViewOnlyBanner message="Dashboard is view-only for staff. Contact owner for more access." />
                </div>
            )}

            <div className="flex-1 overflow-y-auto px-6 pb-6 pt-6">
                <div className="h-full flex flex-col gap-6">
                    {/* Header Section */}
                    <div className="flex-shrink-0 bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 animate-gradient-x bg-[length:200%_200%] rounded-2xl shadow-2xl shadow-orange-500/30 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold mb-1">
                                    Welcome back, {user?.firstName || 'User'}! 👋
                                </h1>
                                <p className="text-white/90">Here's what's happening with your store today</p>
                            </div>
                            <div className="hidden lg:block text-right bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl px-6 py-3 shadow-xl">
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
                                <div className="bg-white/80 backdrop-blur-xl border border-white/20 bg-gradient-to-br from-orange-400/90 via-orange-500/90 to-red-500/90 rounded-xl p-4 shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 hover:rotate-1 transition-all duration-300 animate-slide-up-bounce" style={{ animationDelay: '0ms' }}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg animate-pulse">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="text-white/80 text-xs font-medium mb-1">Today's Sales</p>
                                    <p className="text-white text-2xl font-bold">{formatCurrency(stats?.todaySales)}</p>
                                </div>

                                <div className="bg-white/80 backdrop-blur-xl border border-white/20 bg-gradient-to-br from-blue-400/90 via-cyan-500/90 to-purple-500/90 rounded-xl p-4 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 hover:-rotate-1 transition-all duration-300 animate-slide-up-bounce" style={{ animationDelay: '100ms' }}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg animate-pulse">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="text-white/80 text-xs font-medium mb-1">Products Sold</p>
                                    <p className="text-white text-2xl font-bold">{stats?.todayOrders || 0}</p>
                                </div>

                                <div className="bg-white/80 backdrop-blur-xl border border-white/20 bg-gradient-to-br from-yellow-400/90 via-amber-500/90 to-orange-500/90 rounded-xl p-4 shadow-2xl shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:scale-105 hover:rotate-1 transition-all duration-300 animate-slide-up-bounce" style={{ animationDelay: '200ms' }}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg animate-pulse">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="text-white/80 text-xs font-medium mb-1">Low Stock</p>
                                    <p className="text-white text-2xl font-bold">{stats?.lowStockProducts || 0}</p>
                                </div>

                                <div className="bg-white/80 backdrop-blur-xl border border-white/20 bg-gradient-to-br from-green-400/90 via-emerald-500/90 to-teal-500/90 rounded-xl p-4 shadow-2xl shadow-green-500/30 hover:shadow-green-500/50 hover:scale-105 hover:-rotate-1 transition-all duration-300 animate-slide-up-bounce" style={{ animationDelay: '300ms' }}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg animate-pulse">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="text-white/80 text-xs font-medium mb-1">Customers</p>
                                    <p className="text-white text-2xl font-bold">{stats?.totalCustomers || 0}</p>
                                    <div className="flex flex-col mt-2 space-y-1">
                                        <span className="text-xs font-bold px-2 py-1 bg-white text-blue-600 rounded-full w-fit shadow-sm">
                                            Registered: {stats?.registeredCustomers || 0}
                                        </span>
                                        <span className="text-xs font-bold px-2 py-1 bg-white text-orange-500 rounded-full w-fit shadow-sm">
                                            Walk-in: {stats?.walkInCustomers || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Sales Chart - Takes remaining space */}
                            <div className="flex-1 bg-white/70 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl shadow-orange-500/10 border-2 border-white/20 dark:border-gray-700/30 bg-gradient-to-br from-white/70 to-white/50 dark:from-gray-800/50 dark:to-gray-900/50 p-6 min-h-0 flex flex-col animate-scale-in" style={{ animationDelay: '400ms' }}>
                                <div className="flex-shrink-0 flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sales Analytics</h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track your revenue over time</p>
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
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedPeriod === period.value
                                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/50 scale-105'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105'
                                                    }`}
                                            >
                                                {period.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Chart Area - Flexible */}
                                <div className="flex-1 relative bg-gradient-to-b from-orange-50/50 via-purple-50/30 to-transparent dark:from-orange-900/10 dark:via-purple-900/5 dark:to-transparent rounded-xl p-4 min-h-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart
                                            data={salesData}
                                            margin={{ top: 10, right: 10, left: 10, bottom: 40 }}
                                        >
                                            <defs>
                                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.8} />
                                                    <stop offset="50%" stopColor="#fbbf24" stopOpacity={0.4} />
                                                    <stop offset="100%" stopColor="#fef08a" stopOpacity={0.1} />
                                                </linearGradient>
                                                <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" stopColor="#f97316" />
                                                    <stop offset="50%" stopColor="#fbbf24" />
                                                    <stop offset="100%" stopColor="#facc15" />
                                                </linearGradient>
                                            </defs>

                                            <CartesianGrid
                                                strokeDasharray="5 5"
                                                stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
                                                opacity={0.5}
                                            />

                                            <XAxis
                                                dataKey="label"
                                                stroke="#9ca3af"
                                                style={{ fontSize: '12px' }}
                                                tick={{ fill: '#9ca3af' }}
                                                tickFormatter={(value) => {
                                                    // Check if value is in HH:mm format (military time)
                                                    if (/^\d{2}:\d{2}$/.test(value)) {
                                                        const [hours, minutes] = value.split(':');
                                                        const h = parseInt(hours, 10);
                                                        const ampm = h >= 12 ? 'PM' : 'AM';
                                                        const h12 = h % 12 || 12;
                                                        return `${h12} ${ampm}`;
                                                    }
                                                    return value;
                                                }}
                                            />

                                            <YAxis
                                                stroke="#9ca3af"
                                                style={{ fontSize: '12px' }}
                                                tick={{ fill: '#9ca3af' }}
                                                tickFormatter={(value) => formatCurrency(value).replace('.00', '')}
                                            />

                                            <Tooltip
                                                content={<CustomTooltip formatCurrency={formatCurrency} />}
                                                cursor={{ stroke: '#f97316', strokeWidth: 2, strokeDasharray: '5 5' }}
                                            />

                                            <Area
                                                type="monotone"
                                                dataKey="value"
                                                stroke="url(#strokeGradient)"
                                                strokeWidth={3}
                                                fill="url(#colorSales)"
                                                animationDuration={1500}
                                                animationEasing="ease-in-out"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Products and Transactions */}
                        <div className="col-span-12 xl:col-span-4 flex flex-col gap-6 min-h-0">
                            {/* Top Products */}
                            <div className="flex-1 bg-white/80 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden flex flex-col min-h-0 animate-fadeIn" style={{ animationDelay: '600ms' }}>
                                <div className="flex-shrink-0 p-5 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-orange-100 via-purple-100 to-pink-100 dark:from-orange-900/20 dark:via-purple-900/20 dark:to-pink-900/20">
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Top Products</h2>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Best sellers this month</p>
                                </div>
                                <div className="flex-1 overflow-y-auto p-5">
                                    {stats?.topProducts && stats.topProducts.length > 0 ? (
                                        <div className="space-y-3">
                                            {stats.topProducts.slice(0, 5).map((product, index) => (
                                                <div
                                                    key={product.productId}
                                                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-purple-50/50 dark:hover:from-orange-900/20 dark:hover:to-purple-900/20 hover:scale-102 hover:shadow-lg transition-all duration-300 animate-fadeInRight"
                                                    style={{ animationDelay: `${650 + (index * 50)}ms` }}
                                                >
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm text-white ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shimmer-bg shadow-lg' :
                                                            index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 shimmer-silver shadow-md' :
                                                                index === 2 ? 'bg-gradient-to-br from-orange-300 to-orange-400 shimmer-bronze shadow-md' :
                                                                    'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600'
                                                            }`}>
                                                            #{index + 1}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{product.productName}</p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">{product.quantitySold} sold</p>
                                                        </div>
                                                    </div>
                                                    <p className="font-bold text-sm bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent ml-2">{formatCurrency(product.totalRevenue)}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <svg className="w-16 h-16 mx-auto mb-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                            <p className="text-gray-400 dark:text-gray-500 text-sm">No products data yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Recent Transactions */}
                            <div className="flex-1 bg-white/80 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden flex flex-col min-h-0 animate-fadeIn" style={{ animationDelay: '700ms' }}>
                                <div className="flex-shrink-0 p-5 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-100 via-cyan-100 to-purple-100 dark:from-blue-900/20 dark:via-cyan-900/20 dark:to-purple-900/20">
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Transactions</h2>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Latest purchases</p>
                                </div>
                                <div className="flex-1 overflow-y-auto">
                                    {stats?.recentTransactions && stats.recentTransactions.length > 0 ? (
                                        <div className="divide-y divide-gray-100">
                                            {stats.recentTransactions.slice(0, 10).map((transaction, index) => (
                                                <div
                                                    key={transaction.transactionId}
                                                    className="p-4 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 hover:shadow-md transition-all duration-300 animate-fadeInLeft"
                                                    style={{ animationDelay: `${700 + (index * 40)}ms` }}
                                                >
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-sm font-semibold px-2 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 rounded-md text-gray-900 dark:text-white">#{transaction.transactionId}</span>
                                                        <span className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(transaction.amount)}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-gray-600 dark:text-gray-400">{transaction.customerName || 'Walk-in Customer'}</span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-500">{formatDate(transaction.transactionDate)}</span>
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
                                <div className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl p-3 shadow-lg border-2 border-white/20 dark:border-gray-700/30 bg-gradient-to-br from-white/70 to-white/50 dark:from-gray-800/50 dark:to-gray-900/50 hover:scale-105 hover:rotate-2 hover:shadow-xl transition-all duration-300 animate-slide-up-bounce hover:animate-float" style={{ animationDelay: '800ms' }}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Products</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">{stats?.totalProducts || 0}</p>
                                </div>

                                <div className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl p-3 shadow-lg border-2 border-white/20 dark:border-gray-700/30 bg-gradient-to-br from-white/70 to-white/50 dark:from-gray-800/50 dark:to-gray-900/50 hover:scale-105 hover:rotate-2 hover:shadow-xl transition-all duration-300 animate-slide-up-bounce hover:animate-float" style={{ animationDelay: '900ms' }}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/30">
                                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Customers</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                                        {stats?.totalCustomers || 0}
                                    </p>
                                </div>

                                <div className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl p-3 shadow-lg border-2 border-white/20 dark:border-gray-700/30 bg-gradient-to-br from-white/70 to-white/50 dark:from-gray-800/50 dark:to-gray-900/50 hover:scale-105 hover:rotate-2 hover:shadow-xl transition-all duration-300 animate-slide-up-bounce hover:animate-float" style={{ animationDelay: '1000ms' }}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-orange-400 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/30">
                                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-1">Accounts Receivable</p>
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
