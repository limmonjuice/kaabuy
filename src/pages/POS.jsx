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

    // Cart state
    const [cart, setCart] = useState([]);

    // Customer state
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showCustomerSearch, setShowCustomerSearch] = useState(false);
    const [customerSearchTerm, setCustomerSearchTerm] = useState("");
    const [showAddCustomer, setShowAddCustomer] = useState(false);
    const [newCustomer, setNewCustomer] = useState({
        customerName: "",
        contactNumber: "",
        email: "",
        address: ""
    });
    const [customerError, setCustomerError] = useState("");

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

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/products`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                // Filter products with stock available
                setProducts(data.filter(p => (p.currentStock || 0) > 0));
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

        if (paymentMethod === "Utang" && !selectedCustomer) {
            setError("Please select a customer for Utang payment");
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

    const handleAddCustomer = async (e) => {
        e.preventDefault();
        setCustomerError("");

        if (!newCustomer.customerName.trim()) {
            setCustomerError("Customer name is required");
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
        <div className="h-[calc(100vh-64px)] flex bg-gray-100">
            {/* Left Side - Products */}
            <div className="flex-1 flex flex-col p-4 overflow-hidden">
                {/* Search and Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
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
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
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
                    ) : filteredProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <p>No products found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                            {filteredProducts.map((product) => {
                                const inCart = cart.find(item => item.productId === product.productId);
                                return (
                                    <button
                                        key={product.productId}
                                        onClick={() => addToCart(product)}
                                        disabled={inCart?.quantity >= product.currentStock}
                                        className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-left hover:shadow-md hover:border-orange-300 transition-all ${
                                            inCart?.quantity >= product.currentStock ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full truncate max-w-[80%]">
                                                {product.category || "Uncategorized"}
                                            </span>
                                            {inCart && (
                                                <span className="w-6 h-6 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                                    {inCart.quantity}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{product.productName}</h3>
                                        <p className="text-lg font-bold text-orange-600">{formatCurrency(product.listPrice)}</p>
                                        <p className="text-xs text-green-600 mt-1">Stock: {product.currentStock || 0} {product.unit}</p>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Side - Cart */}
            <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
                {/* Cart Header */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900">Current Order</h2>
                        {cart.length > 0 && (
                            <button
                                onClick={clearCart}
                                className="text-sm text-red-500 hover:text-red-600"
                            >
                                Clear All
                            </button>
                        )}
                    </div>

                    {/* Customer Selection */}
                    <div className="mt-3 relative">
                        <button
                            onClick={() => setShowCustomerSearch(!showCustomerSearch)}
                            className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span className={selectedCustomer ? "text-gray-900" : "text-gray-500"}>
                                    {selectedCustomer ? selectedCustomer.customerName : "Walk-in Customer"}
                                </span>
                            </div>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {showCustomerSearch && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-64 overflow-hidden">
                                <div className="p-2 border-b border-gray-100">
                                    <input
                                        type="text"
                                        placeholder="Search customer..."
                                        value={customerSearchTerm}
                                        onChange={(e) => setCustomerSearchTerm(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center text-gray-600"
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
                                        className="w-full px-4 py-2 text-left hover:bg-orange-50 flex items-center text-orange-600 font-medium border-b border-gray-200"
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
                                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                                        >
                                            <div>
                                                <div className="font-medium text-gray-900">{customer.customerName}</div>
                                                <div className="text-xs text-gray-500">{customer.contactNumber || "No contact"}</div>
                                            </div>
                                            {parseFloat(customer.totalUtang) > 0 && (
                                                <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full">
                                                    Utang: {formatCurrency(customer.totalUtang)}
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
                <div className="flex-1 overflow-y-auto p-4">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <p>Cart is empty</p>
                            <p className="text-sm mt-1">Click products to add</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {cart.map((item) => (
                                <div key={item.productId} className="bg-gray-50 rounded-lg p-3">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1 pr-2">
                                            <h4 className="font-medium text-gray-900 text-sm">{item.productName}</h4>
                                            <p className="text-xs text-gray-500">{formatCurrency(item.unitPrice)} each</p>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.productId)}
                                            className="p-1 text-gray-400 hover:text-red-500"
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
                                                className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
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
                                                className="w-14 text-center font-medium py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            />
                                            <button
                                                onClick={() => updateQuantity(item.productId, (parseInt(item.quantity) || 0) + 1)}
                                                disabled={(parseInt(item.quantity) || 0) >= item.maxStock}
                                                className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                            </button>
                                        </div>
                                        <span className="font-semibold text-gray-900">
                                            {formatCurrency(item.unitPrice * (parseInt(item.quantity) || 0))}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Cart Footer */}
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                    {/* Summary */}
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal ({cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0)} items)</span>
                            <span className="font-medium">{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span className="text-orange-600">{formatCurrency(total)}</span>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                        <div className="grid grid-cols-3 gap-2">
                            {["Cash", "GCash", "Maya", "Credit Card", "Debit Card", "Utang"].map((method) => (
                                <button
                                    key={method}
                                    onClick={() => setPaymentMethod(method)}
                                    className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                                        paymentMethod === method
                                            ? 'bg-orange-500 text-white border-orange-500'
                                            : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300'
                                    }`}
                                >
                                    {method}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Amount Paid (for Cash) */}
                    {paymentMethod === "Cash" && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Amount Paid</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₱</span>
                                <input
                                    type="number"
                                    value={amountPaid}
                                    onChange={(e) => setAmountPaid(e.target.value)}
                                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="0.00"
                                />
                            </div>
                            {amountPaid && parseFloat(amountPaid) >= total && (
                                <div className="mt-2 flex justify-between text-sm">
                                    <span className="text-gray-600">Change</span>
                                    <span className="font-bold text-green-600">{formatCurrency(change)}</span>
                                </div>
                            )}
                            {/* Quick amount buttons */}
                            <div className="flex gap-2 mt-2">
                                {[20, 50, 100, 200, 500, 1000].map((amount) => (
                                    <button
                                        key={amount}
                                        onClick={() => setAmountPaid(amount.toString())}
                                        className="flex-1 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                                    >
                                        {amount}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Utang Warning */}
                    {paymentMethod === "Utang" && !selectedCustomer && (
                        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
                            Please select a customer for Utang payment
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Checkout Button */}
                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0 || checkoutLoading}
                        className="w-full py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {checkoutLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Processing...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Complete Order - {formatCurrency(total)}
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Add Customer Modal */}
            {showAddCustomer && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">Add New Customer</h2>
                            <button
                                onClick={() => {
                                    setShowAddCustomer(false);
                                    setCustomerError("");
                                    setNewCustomer({ customerName: "", contactNumber: "", email: "", address: "" });
                                }}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleAddCustomer} className="p-6 space-y-4">
                            {customerError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                    {customerError}
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Customer Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={newCustomer.customerName}
                                    onChange={(e) => setNewCustomer({...newCustomer, customerName: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="Enter customer name"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                <input
                                    type="text"
                                    value={newCustomer.contactNumber}
                                    onChange={(e) => setNewCustomer({...newCustomer, contactNumber: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="09123456789"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={newCustomer.email}
                                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="customer@email.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <textarea
                                    value={newCustomer.address}
                                    onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    rows="2"
                                    placeholder="Enter address"
                                />
                            </div>
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddCustomer(false);
                                        setCustomerError("");
                                        setNewCustomer({ customerName: "", contactNumber: "", email: "", address: "" });
                                    }}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
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
                </div>
            )}

            {/* Receipt Modal */}
            {showReceipt && lastOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
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
                            <div className="text-center mb-4 pb-4 border-b border-dashed border-gray-300">
                                <h3 className="font-bold text-lg">Kaabuy</h3>
                                <p className="text-sm text-gray-500">{user?.storeName || "Store"}</p>
                                <p className="text-xs text-gray-400 mt-1">{formatDate(lastOrder.orderDate)}</p>
                            </div>

                            {/* Customer & Staff */}
                            <div className="mb-4 pb-4 border-b border-dashed border-gray-300 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Customer:</span>
                                    <span className="font-medium">{lastOrder.customerName || "Walk-in"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Cashier:</span>
                                    <span className="font-medium">{lastOrder.staffName}</span>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="mb-4 pb-4 border-b border-dashed border-gray-300">
                                <h4 className="font-semibold mb-2">Items</h4>
                                {lastOrder.items?.map((item, index) => (
                                    <div key={index} className="flex justify-between text-sm py-1">
                                        <div>
                                            <span>{item.productName}</span>
                                            <span className="text-gray-500 ml-2">x{item.quantity}</span>
                                        </div>
                                        <span>{formatCurrency(item.subtotal)}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>{formatCurrency(lastOrder.totalAmount)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Payment Method</span>
                                    <span className="font-medium">{lastOrder.paymentMethod}</span>
                                </div>
                                {lastOrder.paymentMethod === "Cash" && (
                                    <>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Amount Paid</span>
                                            <span>{formatCurrency(lastOrder.amountPaid)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm font-bold text-green-600">
                                            <span>Change</span>
                                            <span>{formatCurrency(lastOrder.change)}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Receipt Footer */}
                        <div className="p-4 border-t border-gray-200 bg-gray-50">
                            <div className="text-center text-sm text-gray-500 mb-4">
                                Thank you for your purchase!
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => window.print()}
                                    className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
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
            )}
        </div>
    );
}

export default POS;