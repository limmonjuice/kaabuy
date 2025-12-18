import { useState, useEffect } from "react";
import { API_URL } from "../config/constants";
import { useAuth } from "../context/AuthContext";
function POS() {
    const { token, user } = useAuth();
    // Products state
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [outOfStockPage, setOutOfStockPage] = useState(1);
    const ITEMS_PER_PAGE = 20;
    // Cart state
    const [cart, setCart] = useState([]);
    // Customer state
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showCustomerSearch, setShowCustomerSearch] = useState(false);
    const [showOutOfStock, setShowOutOfStock] = useState(false);
    const [customerSearchTerm, setCustomerSearchTerm] = useState("");
    const [showAddCustomer, setShowAddCustomer] = useState(false);
    const [newCustomer, setNewCustomer] = useState({
        customerName: "",
        contactNumber: "",
        email: "",
        address: ""
    });

    const [customerError, setCustomerError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    // Payment state
    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [amountPaid, setAmountPaid] = useState("");
    // Checkout state
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [lastOrder, setLastOrder] = useState(null);
    const [error, setError] = useState("");
    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchCustomers();
    }, []);

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
        setOutOfStockPage(1);
    }, [searchTerm, selectedCategory]);
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/products`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();

                // Store all products
                setProducts(data);
            }
        } catch (err) {
            console.error("Failed to fetch products", err);
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
    const fetchCustomers = async () => {
        try {
            const response = await fetch(`${API_URL}/api/customers`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setCustomers(data);
            }
        } catch (err) {
            console.error("Failed to fetch customers", err);
        }
    };
    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });



    const inStockProducts = filteredProducts.filter(p => (p.currentStock || 0) > 0);
    const outOfStockProducts = filteredProducts.filter(p => (p.currentStock || 0) <= 0);

    // Pagination logic (for in-stock only)
    const totalPages = Math.ceil(inStockProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = inStockProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Pagination logic (for out-of-stock only)
    const outOfStockTotalPages = Math.ceil(outOfStockProducts.length / ITEMS_PER_PAGE);
    const paginatedOutOfStockProducts = outOfStockProducts.slice(
        (outOfStockPage - 1) * ITEMS_PER_PAGE,
        outOfStockPage * ITEMS_PER_PAGE
    );
    // Filter customers for search
    const filteredCustomers = customers.filter(customer =>
        customer.customerName.toLowerCase().includes(customerSearchTerm.toLowerCase())
    );
    // Cart functions
    const addToCart = (product) => {
        const existingItem = cart.find(item => item.productId === product.productId);
        const currentStock = product.currentStock || 0;
        if (existingItem) {
            if (existingItem.quantity < currentStock) {
                setCart(cart.map(item =>
                    item.productId === product.productId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                ));
            } else {
                setError(`Only ${currentStock} items available in stock for ${product.productName}`);
                setTimeout(() => setError(""), 3000);
            }
        } else {
            setCart([...cart, {
                productId: product.productId,
                productName: product.productName,
                unitPrice: product.listPrice,
                quantity: 1,
                maxStock: currentStock
            }]);
        }
    };
    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }
        const item = cart.find(i => i.productId === productId);
        if (item && newQuantity <= item.maxStock) {
            setCart(cart.map(i =>
                i.productId === productId
                    ? { ...i, quantity: newQuantity }
                    : i
            ));
        } else if (item && newQuantity > item.maxStock) {
            setError(`Only ${item.maxStock} items available`);
            setTimeout(() => setError(""), 3000);
        }
    };
    const handleQuantityInputChange = (productId, value) => {
        // Allow empty string for clearing
        if (value === "") {
            setCart(cart.map(i =>
                i.productId === productId
                    ? { ...i, quantity: "" }
                    : i
            ));
            return;
        }
        // Parse and validate
        const newQuantity = parseInt(value);
        if (!isNaN(newQuantity) && newQuantity >= 1) {
            const item = cart.find(i => i.productId === productId);
            if (item && newQuantity <= item.maxStock) {
                setCart(cart.map(i =>
                    i.productId === productId
                        ? { ...i, quantity: newQuantity }
                        : i
                ));
            } else if (item && newQuantity > item.maxStock) {
                // Set to max if exceeded
                setCart(cart.map(i =>
                    i.productId === productId
                        ? { ...i, quantity: item.maxStock }
                        : i
                ));
                setError(`Only ${item.maxStock} items available`);
                setTimeout(() => setError(""), 3000);
            }
        }
    };
    const handleQuantityInputBlur = (productId) => {
        const item = cart.find(i => i.productId === productId);
        if (item && (item.quantity === "" || item.quantity < 1)) {
            // Reset to 1 if empty or invalid
            setCart(cart.map(i =>
                i.productId === productId
                    ? { ...i, quantity: 1 }
                    : i
            ));
        }
    };
    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.productId !== productId));
    };
    const clearCart = () => {
        setCart([]);
        setSelectedCustomer(null);
        setPaymentMethod("Cash");
        setAmountPaid("");
    };
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.unitPrice * (parseInt(item.quantity) || 0)), 0);
    const total = subtotal;
    const change = paymentMethod === "Cash" && amountPaid ? parseFloat(amountPaid) - total : 0;
    // Checkout
    const handleCheckout = async () => {
        if (cart.length === 0) {
            setError("Cart is empty");
            return;
        }
        if (paymentMethod === "Cash" && (!amountPaid || parseFloat(amountPaid) < total)) {
            setError("Insufficient payment amount");
            return;
        }
        if (paymentMethod === "Credit" && !selectedCustomer) {
            setError("Please select a customer for Credit payment");
            return;
        }
        setError("");
        setCheckoutLoading(true);
        try {
            const orderRequest = {
                staffId: user?.staffId,
                customerId: selectedCustomer?.customerId || null,
                paymentMethod: paymentMethod,
                amountPaid: paymentMethod === "Cash" ? parseFloat(amountPaid) : total,
                items: cart.map(item => ({
                    productId: item.productId,
                    quantity: parseInt(item.quantity) || 0
                }))
            };
            const response = await fetch(`${API_URL}/api/orders/checkout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(orderRequest)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Checkout failed");
            }
            const orderData = await response.json();
            setLastOrder(orderData);
            setShowReceipt(true);
            clearCart();
            fetchProducts(); // Refresh stock
        } catch (err) {
            setError(err.message);
        } finally {
            setCheckoutLoading(false);
        }
    };
    const formatCurrency = (amount) => {
        return `₱${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    // Helper to get full image URL
    const getImageUrl = (path) => {
        if (!path || path.trim() === "") return "https://dummyimage.com/300x200/e5e7eb/374151.png&text=No+Image";
        if (path.startsWith("http")) return path;
        return `${API_URL}${path}`;
    };
    const handleAddCustomer = async (e) => {
        e.preventDefault();
        setCustomerError("");
        setFieldErrors({});

        // Validate required fields
        const errors = {};
        if (!newCustomer.customerName.trim()) errors.customerName = "Customer name is required";
        if (!newCustomer.contactNumber.trim()) errors.contactNumber = "Contact number is required";
        if (!newCustomer.address.trim()) errors.address = "Address is required";

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/customers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(newCustomer)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to add customer");
            }
            const savedCustomer = await response.json();
            setCustomers([...customers, savedCustomer]);
            setSelectedCustomer(savedCustomer);
            setShowAddCustomer(false);
            setNewCustomer({ customerName: "", contactNumber: "", email: "", address: "" });
            setShowCustomerSearch(false);
        } catch (err) {
            setCustomerError(err.message);
        }
    };
    return (
        <div className="h-[calc(100vh-64px)] flex bg-gray-100 dark:bg-gray-900">
            {/* Left Side - Products */}
            <div className="flex-1 flex flex-col p-4 overflow-hidden">
                {/* Search and Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat, index) => (
                                <option key={index} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>
                {/* Products Grid */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                        </div>
                    ) : inStockProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                            <svg className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <p>No available products found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                            {paginatedProducts.map((product) => {
                                const inCart = cart.find(item => item.productId === product.productId);
                                return (
                                    <button
                                        key={product.productId}
                                        onClick={() => addToCart(product)}
                                        disabled={inCart?.quantity >= product.currentStock}
                                        className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-left hover:shadow-md hover:border-orange-300 dark:hover:border-orange-500/50 transition-all flex flex-col overflow-hidden group h-full ${inCart?.quantity >= product.currentStock ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                    >
                                        {/* Image Area */}
                                        <div className="relative h-32 w-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                            <img
                                                src={getImageUrl(product.imageUrl)}
                                                alt={product.productName}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            {/* In Cart Badge */}
                                            {inCart && (
                                                <div className="absolute top-2 right-2 w-6 h-6 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-sm z-10">
                                                    {inCart.quantity}
                                                </div>
                                            )}
                                            {/* Category Badge overlay */}
                                            <div className="absolute top-2 left-2">
                                                <span className="text-[10px] font-semibold text-gray-700 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full uppercase tracking-wide shadow-sm">
                                                    {product.category || "General"}
                                                </span>
                                            </div>
                                        </div>
                                        {/* Content Area */}
                                        <div className="p-3 flex flex-col flex-grow w-full">
                                            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 leading-tight min-h-[2.5em]" title={product.productName}>
                                                {product.productName}
                                            </h3>
                                            <div className="mt-auto pt-2 flex items-end justify-between border-t border-gray-50 dark:border-gray-700 w-full">
                                                <div>
                                                    <p className="text-sm font-bold text-orange-600 dark:text-orange-400">{formatCurrency(product.listPrice)}</p>
                                                </div>
                                                <p className="text-xs text-gray-400">{product.currentStock} {product.unit}</p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}


                    {/* Pagination Controls */}
                    {!loading && inStockProducts.length > ITEMS_PER_PAGE && (
                        <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 flex items-center justify-between">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                            >
                                Next
                            </button>
                        </div>
                    )}

                    {/* Out of Stock Section */}
                    {!loading && outOfStockProducts.length > 0 && (
                        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                            <button
                                onClick={() => setShowOutOfStock(!showOutOfStock)}
                                className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium w-full"
                            >
                                <svg className={`w-5 h-5 transition-transform ${showOutOfStock ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                Show Out of Stock Items ({outOfStockProducts.length})
                            </button>

                            {showOutOfStock && (
                                <>
                                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 opacity-60">
                                        {paginatedOutOfStockProducts.map((product) => (
                                            <div
                                                key={product.productId}
                                                className="bg-gray-50 rounded-xl shadow-sm border border-gray-200 text-left flex flex-col overflow-hidden h-full grayscale"
                                            >
                                                <div className="relative h-32 w-full bg-gray-200 overflow-hidden">
                                                    <img
                                                        src={getImageUrl(product.imageUrl)}
                                                        alt={product.productName}
                                                        className="w-full h-full object-cover opacity-50"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <span className="bg-black/50 text-white px-2 py-1 rounded text-xs font-bold">Out of Stock</span>
                                                    </div>
                                                </div>
                                                <div className="p-3 flex flex-col flex-grow w-full">
                                                    <h3 className="text-sm font-bold text-gray-700 mb-1 line-clamp-2 leading-tight min-h-[2.5em]">
                                                        {product.productName}
                                                    </h3>
                                                    <div className="mt-auto pt-2 flex items-end justify-between border-t border-gray-200 w-full">
                                                        <p className="text-sm font-bold text-gray-500">{formatCurrency(product.listPrice)}</p>
                                                        <p className="text-xs text-red-500 font-medium">0 {product.unit}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Out of Stock Pagination Controls */}
                                    {outOfStockProducts.length > ITEMS_PER_PAGE && (
                                        <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-200 p-3 flex items-center justify-between">
                                            <button
                                                onClick={() => setOutOfStockPage(prev => Math.max(prev - 1, 1))}
                                                disabled={outOfStockPage === 1}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                Previous
                                            </button>
                                            <span className="text-sm text-gray-600 font-medium">
                                                Page {outOfStockPage} of {outOfStockTotalPages}
                                            </span>
                                            <button
                                                onClick={() => setOutOfStockPage(prev => Math.min(prev + 1, outOfStockTotalPages))}
                                                disabled={outOfStockPage === outOfStockTotalPages}
                                                className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {/* Right Side - Cart */}
            <div className="w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col shadow-lg z-10">
                {/* Cart Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/50">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Current Order
                        </h2>
                        {cart.length > 0 && (
                            <button
                                onClick={clearCart}
                                className="text-sm text-red-500 hover:text-red-600 font-medium"
                            >
                                Clear All
                            </button>
                        )}
                    </div>
                    <div className="mt-3 relative">
                        <button
                            onClick={() => setShowCustomerSearch(!showCustomerSearch)}
                            className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-white dark:hover:bg-gray-700 bg-white dark:bg-gray-700 transition-colors"
                        >
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span className={selectedCustomer ? "text-gray-900 dark:text-white font-medium" : "text-gray-500 dark:text-gray-400"}>
                                    {selectedCustomer ? selectedCustomer.customerName : "Walk-in Customer"}
                                </span>
                            </div>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {showCustomerSearch && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl z-20 max-h-64 overflow-hidden">
                                <div className="p-2 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                                    <input
                                        type="text"
                                        placeholder="Search customer..."
                                        value={customerSearchTerm}
                                        onChange={(e) => setCustomerSearchTerm(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 dark:text-white"
                                        autoFocus
                                    />
                                </div>
                                <div className="overflow-y-auto max-h-48">
                                    <button
                                        onClick={() => {
                                            setSelectedCustomer(null);
                                            setShowCustomerSearch(false);
                                            setCustomerSearchTerm("");
                                        }}
                                        className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center text-gray-600 dark:text-gray-300"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                        </svg>
                                        Walk-in Customer
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowAddCustomer(true);
                                            setShowCustomerSearch(false);
                                        }}
                                        className="w-full px-4 py-2 text-left hover:bg-orange-50 dark:hover:bg-orange-900/30 flex items-center text-orange-600 dark:text-orange-400 font-medium border-b border-gray-200 dark:border-gray-700"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Add New Customer
                                    </button>
                                    {filteredCustomers.map(customer => (
                                        <button
                                            key={customer.customerId}
                                            onClick={() => {
                                                setSelectedCustomer(customer);
                                                setShowCustomerSearch(false);
                                                setCustomerSearchTerm("");
                                            }}
                                            className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between"
                                        >
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">{customer.customerName}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{customer.contactNumber || "No contact"}</div>
                                            </div>
                                            {parseFloat(customer.totalUtang) > 0 && (
                                                <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full">
                                                    Accounts Receivable: {formatCurrency(customer.totalUtang)}
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50/30 dark:bg-gray-900/30">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
                            <svg className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <p className="font-medium">Cart is empty</p>
                            <p className="text-sm mt-1">Select products to begin order</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {cart.map((item) => (
                                <div key={item.productId} className="bg-white dark:bg-gray-700/50 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-600">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1 pr-2">
                                            <h4 className="font-medium text-gray-900 dark:text-white text-sm">{item.productName}</h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{formatCurrency(item.unitPrice)} each</p>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.productId)}
                                            className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/40 rounded transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updateQuantity(item.productId, (parseInt(item.quantity) || 1) - 1)}
                                                className="w-8 h-8 flex items-center justify-center bg-gray-50 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-600 dark:text-gray-300"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                </svg>
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                max={item.maxStock}
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityInputChange(item.productId, e.target.value)}
                                                onBlur={() => handleQuantityInputBlur(item.productId)}
                                                className="w-14 text-center font-medium py-1 border border-gray-300 dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            />
                                            <button
                                                onClick={() => updateQuantity(item.productId, (parseInt(item.quantity) || 0) + 1)}
                                                disabled={(parseInt(item.quantity) || 0) >= item.maxStock}
                                                className="w-8 h-8 flex items-center justify-center bg-gray-50 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                            </button>
                                        </div>
                                        <span className="font-bold text-gray-900 dark:text-white">
                                            {formatCurrency(item.unitPrice * (parseInt(item.quantity) || 0))}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {/* Cart Footer */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    {/* Summary */}
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Subtotal ({cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0)} items)</span>
                            <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-xl font-black text-gray-900 dark:text-white pb-2 border-b border-gray-100 dark:border-gray-700">
                            <span>Total</span>
                            <span className="text-orange-600">{formatCurrency(total)}</span>
                        </div>
                    </div>
                    {/* Payment Method */}
                    <div className="mb-4">
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Payment Method</label>
                        <div className="grid grid-cols-2 gap-2">
                            {["Cash", "Credit"].map((method) => (
                                <button
                                    key={method}
                                    onClick={() => setPaymentMethod(method)}
                                    className={`px-2 py-2 text-xs font-medium rounded-lg border transition-all ${paymentMethod === method
                                        ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                                        : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                                        }`}
                                >
                                    {method}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Amount Paid (for Cash) */}
                    {paymentMethod === "Cash" && (
                        <div className="mb-4 animate-fadeIn">
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Amount Paid</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-bold">₱</span>
                                <input
                                    type="number"
                                    value={amountPaid}
                                    onChange={(e) => setAmountPaid(e.target.value)}
                                    className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                                    placeholder="0.00"
                                />
                            </div>
                            {amountPaid && parseFloat(amountPaid) >= total && (
                                <div className="mt-2 flex justify-between text-sm p-2 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-100 dark:border-green-800">
                                    <span className="text-green-700 dark:text-green-300">Change</span>
                                    <span className="font-bold text-green-700 dark:text-green-300">{formatCurrency(change)}</span>
                                </div>
                            )}
                            {/* Quick amount buttons */}
                            <div className="flex gap-2 mt-2">
                                {[20, 50, 100, 200, 500, 1000].map((amount) => (
                                    <button
                                        key={amount}
                                        onClick={() => setAmountPaid(amount.toString())}
                                        className="flex-1 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 font-medium rounded transition-colors"
                                    >
                                        {amount}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Utang Warning */}
                    {
                        paymentMethod === "Credit" && !selectedCustomer && (
                            <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 rounded-lg text-sm text-yellow-700 dark:text-yellow-400 flex items-start gap-2">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                Please select a customer for Credit payment
                            </div>
                        )
                    }
                    {/* Error */}
                    {
                        error && (
                            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg text-sm text-red-700 dark:text-red-400 flex items-center gap-2">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </div>
                        )
                    }
                    {/* Checkout Button */}
                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0 || checkoutLoading}
                        className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-orange-200"
                    >
                        {checkoutLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Processing...
                            </>
                        ) : (
                            <>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-lg">Pay {formatCurrency(total)}</span>
                            </>
                        )}
                    </button>
                </div >
            </div >
            {/* Add Customer Modal */}
            {
                showAddCustomer && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md">
                            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Customer</h2>
                                <button
                                    onClick={() => {
                                        setShowAddCustomer(false);
                                        setCustomerError("");
                                        setNewCustomer({ customerName: "", contactNumber: "", email: "", address: "" });
                                    }}
                                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <form onSubmit={handleAddCustomer} className="p-6 space-y-4">
                                {customerError && (
                                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
                                        {customerError}
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Customer Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={newCustomer.customerName}
                                        onChange={(e) => setNewCustomer({ ...newCustomer, customerName: e.target.value })}
                                        className={`w-full px-4 py-2 border ${fieldErrors.customerName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                                        placeholder="Enter customer name"
                                        autoFocus
                                    />
                                    {fieldErrors.customerName && (
                                        <p className="mt-1 text-sm text-red-500">{fieldErrors.customerName}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Contact Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={newCustomer.contactNumber}
                                        onChange={(e) => setNewCustomer({ ...newCustomer, contactNumber: e.target.value })}
                                        className={`w-full px-4 py-2 border ${fieldErrors.contactNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                                        placeholder="09123456789"
                                    />
                                    {fieldErrors.contactNumber && (
                                        <p className="mt-1 text-sm text-red-500">{fieldErrors.contactNumber}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={newCustomer.email}
                                        onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="customer@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Address <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={newCustomer.address}
                                        onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                                        className={`w-full px-4 py-2 border ${fieldErrors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                                        rows="2"
                                        placeholder="Enter address"
                                    />
                                    {fieldErrors.address && (
                                        <p className="mt-1 text-sm text-red-500">{fieldErrors.address}</p>
                                    )}
                                </div>
                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowAddCustomer(false);
                                            setCustomerError("");
                                            setNewCustomer({ customerName: "", contactNumber: "", email: "", address: "" });
                                        }}
                                        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600"
                                    >
                                        Add Customer
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div >
                )
            }
            {/* Receipt Modal */}
            {
                showReceipt && lastOrder && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
                            {/* Receipt Header */}
                            <div className="bg-gradient-to-r from-orange-400 to-orange-500 p-6 text-white text-center">
                                <svg className="w-16 h-16 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h2 className="text-2xl font-bold">Order Complete!</h2>
                                <p className="text-orange-100 mt-1">Order #{lastOrder.orderId}</p>
                            </div>
                            {/* Receipt Body */}
                            <div className="p-6 overflow-y-auto max-h-[50vh]">
                                {/* Store Info */}
                                <div className="text-center mb-4 pb-4 border-b border-dashed border-gray-300 dark:border-gray-600">
                                    <h3 className="font-bold text-lg dark:text-white">Kaabuy</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{user?.storeName || "Store"}</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{formatDate(lastOrder.orderDate)}</p>
                                </div>
                                {/* Customer & Staff */}
                                <div className="mb-4 pb-4 border-b border-dashed border-gray-300 dark:border-gray-600 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">Customer:</span>
                                        <span className="font-medium dark:text-gray-200">{lastOrder.customerName || "Walk-in"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">Cashier:</span>
                                        <span className="font-medium dark:text-gray-200">{lastOrder.staffName}</span>
                                    </div>
                                </div>
                                {/* Items */}
                                <div className="mb-4 pb-4 border-b border-dashed border-gray-300 dark:border-gray-600">
                                    <h4 className="font-semibold mb-2 dark:text-white">Items</h4>
                                    {lastOrder.items?.map((item, index) => (
                                        <div key={index} className="flex justify-between text-sm py-1 dark:text-gray-300">
                                            <div>
                                                <span>{item.productName}</span>
                                                <span className="text-gray-500 dark:text-gray-400 ml-2">x{item.quantity}</span>
                                            </div>
                                            <span>{formatCurrency(item.subtotal)}</span>
                                        </div>
                                    ))}
                                </div>
                                {/* Totals */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-lg font-bold dark:text-white">
                                        <span>Total</span>
                                        <span>{formatCurrency(lastOrder.totalAmount)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">Payment Method</span>
                                        <span className="font-medium dark:text-gray-200">{lastOrder.paymentMethod}</span>
                                    </div>
                                    {lastOrder.paymentMethod === "Cash" && (
                                        <>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500 dark:text-gray-400">Amount Paid</span>
                                                <span className="dark:text-gray-200">{formatCurrency(lastOrder.amountPaid)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm font-bold text-green-600 dark:text-green-400">
                                                <span>Change</span>
                                                <span>{formatCurrency(lastOrder.change)}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                            {/* Receipt Footer */}
                            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                                <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                                    Thank you for your purchase!
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => window.print()}
                                        className="flex-1 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                        </svg>
                                        Print
                                    </button>
                                    <button
                                        onClick={() => setShowReceipt(false)}
                                        className="flex-1 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                    >
                                        New Order
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
export default POS;