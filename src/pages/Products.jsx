import { useState, useEffect } from "react";
import { API_URL } from "../config/constants";
import { useAuth } from "../context/AuthContext";
import { useRole } from "../hooks/useRole";
import ViewOnlyBanner from "../components/ViewOnlyBanner";

const DEFAULT_CATEGORIES = [
    "Food & Snacks",
    "Beverages",
    "Cooking Essentials",
    "Personal Care",
    "School & Office Supplies",
    "Cigarettes & Tobacco",
    "Condiments & Seasonings",
    "Load / Digital Services",
    "Others / Miscellaneous"
];

function Products() {
    const { token } = useAuth();
    const { isOwner } = useRole();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 20;

    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isCustomCategory, setIsCustomCategory] = useState(false);
    const [recentlyAdded, setRecentlyAdded] = useState([]);

    // Batch Form State
    const [formRows, setFormRows] = useState([]);
    const [batchErrors, setBatchErrors] = useState({}); // Key: "rowIndex-fieldName", Value: errorMsg

    // Single Edit State
    const [formData, setFormData] = useState({
        productName: "",
        category: "",
        basePrice: "",
        listPrice: "",
        unit: "pcs",
        imageUrl: ""
    });
    const [formError, setFormError] = useState("");
    const [formLoading, setFormLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    // Fetch products on mount
    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategory]);
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/products`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
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
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                // Merge default categories with fetched ones (remove duplicates and empty values)
                const uniqueCategories = Array.from(new Set([...DEFAULT_CATEGORIES, ...data]));
                setCategories(uniqueCategories.filter(cat => cat && cat.trim() !== "").sort());
            }
        } catch (err) {
            console.error("Failed to fetch categories", err);
        }
    };
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    // Handle Image Upload
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploadingImage(true);
        const uploadData = new FormData();
        uploadData.append("file", file);
        try {
            const response = await fetch(`${API_URL}/api/uploads`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: uploadData
            });
            if (!response.ok) throw new Error("Failed to upload image");
            const data = await response.json();
            // Assuming the backend returns { imageUrl: "/uploads/filename.jpg" }
            setFormData(prev => ({ ...prev, imageUrl: data.imageUrl }));
        } catch (err) {
            console.error("Image upload error:", err);
            setFormError("Failed to upload image");
        } finally {
            setUploadingImage(false);
        }
    };

    // Handle Grid Image Upload
    const handleGridImageUpload = async (index, e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Optimistic preview
        const reader = new FileReader();
        reader.onload = (ev) => {
            const newRows = [...formRows];
            newRows[index] = { ...newRows[index], previewUrl: ev.target.result, uploading: true };
            setFormRows(newRows);
        };
        reader.readAsDataURL(file);

        const uploadData = new FormData();
        uploadData.append("file", file);

        try {
            const response = await fetch(`${API_URL}/api/uploads`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: uploadData
            });
            if (!response.ok) throw new Error("Upload failed");
            const data = await response.json();

            setFormRows(prev => {
                const updated = [...prev];
                updated[index] = { ...updated[index], imageUrl: data.imageUrl, uploading: false };
                return updated;
            });
        } catch (err) {
            console.error("Grid upload error:", err);
            // Revert on error or show error state
            setFormRows(prev => {
                const updated = [...prev];
                updated[index] = { ...updated[index], uploading: false }; // Clear uploading flag
                return updated;
            });
            alert("Failed to upload image for row " + (index + 1));
        }
    };

    // Row Management
    const handleAddRow = () => {
        const lastRow = formRows[formRows.length - 1];
        setFormRows([...formRows, {
            productName: "",
            category: lastRow ? lastRow.category : "", // Smart copy
            basePrice: "",
            listPrice: "",
            unit: lastRow ? lastRow.unit : "pcs", // Smart copy
            imageUrl: ""
        }]);
    };

    const handleRemoveRow = (index) => {
        if (formRows.length <= 1) return;
        setFormRows(formRows.filter((_, i) => i !== index));
    };

    const handleRowChange = (index, field, value) => {
        const newRows = [...formRows];
        newRows[index] = { ...newRows[index], [field]: value };
        setFormRows(newRows);

        // Clear specific error when user types
        const errorKey = `${index}-${field}`;
        if (batchErrors[errorKey]) {
            setBatchErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[errorKey];
                return newErrors;
            });
        }
    };
    // Open modal for adding new product
    const handleAddNew = () => {
        setEditingProduct(null);
        setIsCustomCategory(false);
        setRecentlyAdded([]);
        // Initialize with one empty row
        setFormRows([{
            productName: "",
            category: "",
            basePrice: "",
            listPrice: "",
            unit: "pcs",
            imageUrl: ""
        }]);
        setFormError("");
        setBatchErrors({});
        setShowModal(true);
    };
    // Open modal for editing product
    const handleEdit = (product) => {
        setEditingProduct(product);
        setIsCustomCategory(product.category && !categories.includes(product.category));
        setFormData({
            productName: product.productName,
            category: product.category || "",
            basePrice: product.basePrice,
            listPrice: product.listPrice,
            unit: product.unit || "pcs",
            imageUrl: product.imageUrl || ""
        });
        setFormError("");
        setBatchErrors({});
        setShowModal(true);
    };
    // Submit form (create or update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");
        setFormLoading(true);

        try {
            if (editingProduct) {
                // SINGLE UPDATE LOGIC
                if (!formData.productName || !formData.listPrice) {
                    throw new Error("Product name and list price are required");
                }

                const response = await fetch(`${API_URL}/api/products/${editingProduct.productId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        ...formData,
                        basePrice: parseFloat(formData.basePrice) || 0,
                        listPrice: parseFloat(formData.listPrice)
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to save product");
                }

                // Update successful
                setShowModal(false);
                setEditingProduct(null);
                fetchProducts();
                fetchCategories();
            } else {
                // BATCH CREATE LOGIC

                // 1. Pre-validation: Check all rows
                const newBatchErrors = {};
                let hasErrors = false;
                const namesInBatch = new Set();

                // First pass: Validate all rows locally
                for (let i = 0; i < formRows.length; i++) {
                    const row = formRows[i];

                    // Skip completely empty rows if there are multiple, but if it's the only row, require it.
                    // Actually, user said "validated in batch add... even for all rows so no empty fields"
                    // So we validate ALL visible rows.

                    if (!row.productName?.trim()) {
                        newBatchErrors[`${i}-productName`] = "Product name is required";
                        hasErrors = true;
                    }

                    if (!row.listPrice) {
                        newBatchErrors[`${i}-listPrice`] = "List price is required";
                        hasErrors = true;
                    }

                    // Check duplicate names in batch
                    if (row.productName?.trim()) {
                        const nameLower = row.productName.trim().toLowerCase();
                        if (namesInBatch.has(nameLower)) {
                            newBatchErrors[`${i}-productName`] = "Duplicate name in batch";
                            hasErrors = true;
                        }
                        namesInBatch.add(nameLower);
                    }
                }

                // Second pass: Check duplicates against existing products
                // Only if no local errors to avoid spamming
                if (!hasErrors) {
                    for (let i = 0; i < formRows.length; i++) {
                        const row = formRows[i];
                        if (row.productName?.trim()) {
                            const exists = products.some(p => p.productName.toLowerCase() === row.productName.trim().toLowerCase());
                            if (exists) {
                                newBatchErrors[`${i}-productName`] = "Product already exists";
                                hasErrors = true;
                            }
                        }
                    }
                }

                if (hasErrors) {
                    setBatchErrors(newBatchErrors);
                    setFormError("Please fix the errors in the form before saving.");
                    setFormLoading(false);
                    return;
                }

                // Start preserving submission
                const successfullyAdded = [];
                let failingIndex = -1;
                let errorMsg = "";

                // Submit sequentially to ensure order (or could be parallel)
                for (let i = 0; i < formRows.length; i++) {
                    const row = formRows[i];

                    try {
                        const response = await fetch(`${API_URL}/api/products`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                ...row,
                                basePrice: parseFloat(row.basePrice) || 0,
                                listPrice: parseFloat(row.listPrice)
                            })
                        });

                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.error || "Failed to save");
                        }

                        const saved = await response.json();
                        successfullyAdded.push({ name: saved.productName, time: new Date() });
                    } catch (err) {
                        failingIndex = i;
                        errorMsg = `Row ${i + 1} Error: ${err.message}`;
                        break; // Stop at first failure
                    }
                }

                // Update recently added for any that succeeded
                if (successfullyAdded.length > 0) {
                    setRecentlyAdded(prev => [...successfullyAdded, ...prev]);
                    fetchProducts();
                    fetchCategories();
                }

                if (failingIndex !== -1) {
                    // Remove successful rows (0 to failingIndex - 1)
                    // Keep failing row and subsequent rows
                    const remainingRows = formRows.slice(failingIndex);
                    // Ensure we have at least one row, though logic implies we do
                    if (remainingRows.length === 0) {
                        // Should not happen if failingIndex is valid, but fallback
                        setFormRows([{ productName: "", category: "", basePrice: "", listPrice: "", unit: "pcs", imageUrl: "" }]);
                    } else {
                        setFormRows(remainingRows);
                    }
                    throw new Error(errorMsg);
                } else {
                    // All success
                    setShowModal(false);
                }
            }

        } catch (err) {
            setFormError(err.message);
        } finally {
            setFormLoading(false);
        }
    };
    // Delete product
    const handleDelete = async (productId) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            const response = await fetch(`${API_URL}/api/products/${productId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error("Failed to delete product");
            fetchProducts();
        } catch (err) {
            alert(err.message);
        }
    };
    // Helper to get full image URL
    const getImageUrl = (path) => {
        if (!path || path.trim() === "") return "https://dummyimage.com/300x200/e5e7eb/374151.png&text=No+Image";
        if (path.startsWith("http")) return path;
        return `${API_URL}${path}`;
    };
    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Store Products</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your store's inventory and stock levels</p>
            </div>
            {/* View Only Banner */}
            <ViewOnlyBanner message="Products page is view-only for staff. Contact owner to add or edit products." />
            {/* Action Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Category Filter */}
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
                        {/* Add Product Button - Owner Only */}
                        {isOwner && (
                            <button
                                onClick={handleAddNew}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all shadow-sm hover:shadow-md"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Product
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {/* Error Message */}
            {
                error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-6">
                        {error}
                    </div>
                )
            }
            {/* Products Grid (Cards Layout) */}
            {
                loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                        <span className="ml-3 text-gray-500 dark:text-gray-400">Loading products...</span>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <p className="text-gray-500 dark:text-gray-400">No products found</p>
                        {isOwner && (
                            <button onClick={handleAddNew} className="mt-4 text-orange-500 hover:text-orange-600 font-medium">
                                Add your first product
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {paginatedProducts.map((product) => (
                            <div key={product.productId} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col h-full">
                                {/* Card Image */}
                                <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-700 overflow-hidden group">
                                    <img
                                        src={getImageUrl(product.imageUrl)}
                                        alt={product.productName}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {product.stockStatus === "OUT_OF_STOCK" && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <span className="text-white font-bold bg-red-600 px-3 py-1 rounded-full text-sm">Out of Stock</span>
                                        </div>
                                    )}
                                    {product.stockStatus === "LOW_STOCK" && (
                                        <div className="absolute top-2 right-2">
                                            <span className="text-white font-bold bg-yellow-500 px-3 py-1 rounded-full text-xs shadow-sm">Low Stock</span>
                                        </div>
                                    )}
                                </div>
                                {/* Card Body */}
                                <div className="p-4 flex flex-col flex-grow">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-full uppercase tracking-wide">
                                            {product.category || "General"}
                                        </span>
                                        <span className="text-sm text-gray-400 dark:text-gray-500">{product.unit}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1" title={product.productName}>
                                        {product.productName}
                                    </h3>
                                    <div className="mt-auto pt-4 flex items-end justify-between border-t border-gray-100 dark:border-gray-700">
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">List Price</p>
                                            <p className="text-xl font-bold text-gray-900 dark:text-white">₱{product.listPrice?.toFixed(2)}</p>
                                        </div>
                                        {isOwner && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.productId)}
                                                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
            {/* Pagination Controls */}
            {
                !loading && filteredProducts.length > ITEMS_PER_PAGE && (
                    <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 flex items-center justify-between">
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
                )
            }
            {/* Add/Edit Modal */}
            {
                showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full ${editingProduct ? 'max-w-lg' : 'max-w-7xl'} max-h-[90vh] overflow-y-auto transition-all`}>
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {editingProduct ? "Edit Product" : "Add New Product"}
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            {/* Modal Body */}
                            <form onSubmit={handleSubmit} className="p-6">
                                {formError && (
                                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm mb-4">
                                        {formError}
                                    </div>
                                )}

                                {!editingProduct ? (
                                    // BATCH GRID LAYOUT
                                    <div className="space-y-4">
                                        <div className="space-y-4">
                                            {formRows.map((row, index) => (
                                                <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 relative group">
                                                    {formRows.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveRow(index)}
                                                            className="absolute -top-2 -right-2 bg-red-100 dark:bg-red-900/50 text-red-500 dark:text-red-400 p-1 rounded-full shadow-sm hover:bg-red-200 dark:hover:bg-red-900 opacity-0 group-hover:opacity-100 transition-all z-10"
                                                            title="Remove row"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    )}

                                                    <div className="flex flex-col md:flex-row gap-4">
                                                        {/* Image Column (Compact) */}
                                                        <div className="md:w-20 flex-shrink-0">
                                                            <label className="block w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 cursor-pointer flex items-center justify-center overflow-hidden bg-white dark:bg-gray-800 relative">
                                                                {row.previewUrl || row.imageUrl ? (
                                                                    <img src={row.previewUrl || getImageUrl(row.imageUrl)} alt="Preview" className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                    </svg>
                                                                )}
                                                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleGridImageUpload(index, e)} />
                                                                {row.uploading && <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 flex items-center justify-center"><div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-500 border-t-transparent"></div></div>}
                                                            </label>
                                                            <p className="text-[10px] text-center text-gray-500 dark:text-gray-400 mt-1">Image</p>
                                                        </div>

                                                        {/* Inputs Column */}
                                                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                                            <div className="lg:col-span-2">
                                                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                                    Product Name <span className="text-red-500">*</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={row.productName}
                                                                    onChange={(e) => handleRowChange(index, 'productName', e.target.value)}
                                                                    className={`w-full px-3 py-2 text-sm border ${batchErrors[`${index}-productName`] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                                                                    placeholder="e.g. Coca Cola 1.5L"
                                                                />
                                                                {batchErrors[`${index}-productName`] && (
                                                                    <p className="mt-1 text-xs text-red-500">{batchErrors[`${index}-productName`]}</p>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                                                                <select
                                                                    value={row.category}
                                                                    onChange={(e) => handleRowChange(index, 'category', e.target.value)}
                                                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                                >
                                                                    <option value="">Select Category</option>
                                                                    {categories.map((cat, i) => (
                                                                        <option key={i} value={cat}>{cat}</option>
                                                                    ))}
                                                                    <option value="Others">Others</option>
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Unit</label>
                                                                <select
                                                                    value={row.unit}
                                                                    onChange={(e) => handleRowChange(index, 'unit', e.target.value)}
                                                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                                >
                                                                    <option value="pcs">pcs</option>
                                                                    <option value="kg">kg</option>
                                                                    <option value="pack">pack</option>
                                                                    <option value="box">box</option>
                                                                    <option value="bottle">bottle</option>
                                                                    <option value="can">can</option>
                                                                </select>
                                                            </div>

                                                            <div>
                                                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Base Price</label>
                                                                <div className="relative">
                                                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-xs">₱</span>
                                                                    <input
                                                                        type="number"
                                                                        value={row.basePrice}
                                                                        onChange={(e) => handleRowChange(index, 'basePrice', e.target.value)}
                                                                        className="w-full pl-6 pr-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                                        placeholder="0.00"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                                    List Price <span className="text-red-500">*</span>
                                                                </label>
                                                                <div className="relative">
                                                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-xs">₱</span>
                                                                    <input
                                                                        type="number"
                                                                        value={row.listPrice}
                                                                        onChange={(e) => handleRowChange(index, 'listPrice', e.target.value)}
                                                                        className={`w-full pl-6 pr-2 py-2 text-sm border ${batchErrors[`${index}-listPrice`] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                                                                        placeholder="0.00"
                                                                    />
                                                                </div>
                                                                {batchErrors[`${index}-listPrice`] && (
                                                                    <p className="mt-1 text-xs text-red-500">{batchErrors[`${index}-listPrice`]}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleAddRow}
                                            className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 hover:border-orange-500 dark:hover:border-orange-500 hover:text-orange-500 dark:hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all flex items-center justify-center gap-2 font-medium"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Add Another Item
                                        </button>
                                    </div>
                                ) : (
                                    // EDIT MODE (SINGLE FORM) - Keep the existing layout wrapper
                                    <div className="space-y-4">
                                        {/* Image Upload */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product Image</label>
                                            <div className="flex items-center gap-4">
                                                <div className="w-20 h-20 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={getImageUrl(formData.imageUrl)}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                        className="block w-full text-sm text-gray-500 dark:text-gray-400
                                                        file:mr-4 file:py-2 file:px-4
                                                        file:rounded-full file:border-0
                                                        file:text-sm file:font-semibold
                                                        file:bg-orange-50 dark:file:bg-orange-900/20 file:text-orange-700 dark:file:text-orange-400
                                                        hover:file:bg-orange-100 dark:hover:file:bg-orange-900/30
                                                    "
                                                    />
                                                    {uploadingImage && <p className="text-xs text-orange-500 mt-1">Uploading...</p>}
                                                </div>
                                            </div>
                                        </div>
                                        {/* Product Name */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Product Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="productName"
                                                value={formData.productName}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                placeholder="Enter product name"
                                            />
                                        </div>
                                        {/* Category */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                                            <div className="relative">
                                                <select
                                                    name="category"
                                                    value={formData.category}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none"
                                                >
                                                    <option value="">Select Category</option>
                                                    {categories.map((cat, index) => (
                                                        <option key={index} value={cat}>{cat}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Prices Row */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Base Price (Cost)</label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">₱</span>
                                                    <input
                                                        type="number"
                                                        name="basePrice"
                                                        value={formData.basePrice}
                                                        onChange={handleInputChange}
                                                        step="0.01"
                                                        min="0"
                                                        className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    List Price (Sell) <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">₱</span>
                                                    <input
                                                        type="number"
                                                        name="listPrice"
                                                        value={formData.listPrice}
                                                        onChange={handleInputChange}
                                                        step="0.01"
                                                        min="0"
                                                        className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        {/* Unit */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unit</label>
                                            <select
                                                name="unit"
                                                value={formData.unit}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            >
                                                <option value="pcs">pcs</option>
                                                <option value="kg">kg</option>
                                                <option value="g">g</option>
                                                <option value="L">L</option>
                                                <option value="mL">mL</option>
                                                <option value="pack">pack</option>
                                                <option value="box">box</option>
                                                <option value="bottle">bottle</option>
                                                <option value="can">can</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {/* Modal Footer */}
                                <div className="flex flex-col gap-4 pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                                    <div className="flex items-center justify-end gap-3">
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
                                            {formLoading ? "Saving..." : (editingProduct ? "Update Product" : `Save ${formRows.length} Products`)}
                                        </button>
                                    </div>

                                    {/* Recently Added Section */}
                                    {recentlyAdded.length > 0 && (
                                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 animate-fade-in border border-green-100 dark:border-green-800">
                                            <div className="flex items-center gap-2 mb-2">
                                                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-sm font-medium text-green-800 dark:text-green-300">Recently Added</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {recentlyAdded.map((item, idx) => (
                                                    <span key={idx} className="bg-white dark:bg-green-800/30 border border-green-200 dark:border-green-700/50 text-green-700 dark:text-green-300 text-xs px-2 py-1 rounded-full shadow-sm">
                                                        {item.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
export default Products;