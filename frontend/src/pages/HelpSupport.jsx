import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function HelpSupport() {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [contactForm, setContactForm] = useState({
        name: user?.firstName + " " + user?.lastName || "",
        email: user?.email || "",
        subject: "",
        category: "general",
        message: ""
    });
    const [formMessage, setFormMessage] = useState({ type: "", text: "" });

    const faqCategories = [
        {
            id: 1,
            title: "Getting Started",
            icon: "🚀",
            faqs: [
                {
                    question: "How do I log in to the system?",
                    answer: "Use the username and password provided by your store owner. Navigate to the login page and enter your credentials. If you've forgotten your password, contact the system administrator."
                },
                {
                    question: "What is the Dashboard and how do I use it?",
                    answer: "The Dashboard is your main control center showing sales overview, revenue trends, top-selling products, and recent transactions. Access it from the sidebar menu to get a quick snapshot of your store's performance."
                },
                {
                    question: "How do I navigate the system?",
                    answer: "Use the sidebar menu on the left to access different sections: Dashboard, POS, Products, Inventory, Transactions, and more. Click the hamburger icon to collapse or expand the sidebar."
                },
                {
                    question: "What are the different user roles?",
                    answer: "There are two main roles: <strong>Owner</strong> (full access to all features including staff management and store settings) and <strong>Staff</strong> (access to daily operations like POS, products, and transactions)."
                }
            ]
        },
        {
            id: 2,
            title: "Products & Inventory",
            icon: "📦",
            faqs: [
                {
                    question: "How do I add a new product?",
                    answer: "Navigate to the <strong>Products</strong> page and click the \"+ Add Product\" button. Fill in the product name, category, price, stock quantity, and optional image. Click Save to add it to your inventory."
                },
                {
                    question: "How do I edit or delete a product?",
                    answer: "On the Products page, find the product you want to modify. Click the Edit icon to update details or the Delete icon to remove it. Changes take effect immediately."
                },
                {
                    question: "What happens when stock is low?",
                    answer: "The system automatically flags products with stock levels below the reorder point as \"Low Stock\". You'll see a warning badge on the product card and in the dashboard summary."
                },
                {
                    question: "How do I manage inventory levels?",
                    answer: "Go to the <strong>Inventory</strong> page to view all products with their current stock levels. You can filter by category or search for specific items. Products with low stock are highlighted."
                },
                {
                    question: "Can I import products in bulk?",
                    answer: "Currently, products must be added individually. Bulk import via CSV is a planned feature for future updates."
                }
            ]
        },
        {
            id: 3,
            title: "Sales & Transactions",
            icon: "💰",
            faqs: [
                {
                    question: "How do I process a sale at POS?",
                    answer: "Navigate to the <strong>POS</strong> page, search for products and add them to the cart. Adjust quantities if needed, then click \"Checkout\". Enter payment received, and the system will calculate change. Click \"Complete Sale\" to finalize."
                },
                {
                    question: "How do I handle returns or refunds?",
                    answer: "Returns must be processed manually by voiding the original transaction. Contact your system administrator if you need assistance with refunds."
                },
                {
                    question: "What payment methods are supported?",
                    answer: "The system currently supports cash payments. Additional payment methods (credit card, e-wallet) may be configured by the store owner."
                },
                {
                    question: "Where can I view transaction history?",
                    answer: "Go to the <strong>Transactions</strong> page to see all completed sales. You can filter by date range, search by transaction ID, or export data for reporting."
                }
            ]
        },
        {
            id: 4,
            title: "Account & Settings",
            icon: "⚙️",
            faqs: [
                {
                    question: "How do I reset my password?",
                    answer: "Go to <strong>Settings</strong> page and select the \"Security & Password\" tab. Enter your current password, then your new password twice. Click \"Update Password\" to save changes."
                },
                {
                    question: "How do I update my profile information?",
                    answer: "Navigate to <strong>Settings</strong> > \"Profile Information\" tab. Update your first name, last name, or email address. Click \"Save Changes\" and re-login to see the updates."
                },
                {
                    question: "Can I customize notification preferences?",
                    answer: "Yes! Go to <strong>Settings</strong> > \"Notifications\" tab. You can enable/disable email notifications, desktop notifications, sound effects, and set notification frequency (real-time, hourly, or daily digest)."
                }
            ]
        },
        {
            id: 5,
            title: "Troubleshooting",
            icon: "🔧",
            faqs: [
                {
                    question: "Why can't I see certain menu items?",
                    answer: "Some features are restricted based on user roles. Features like Staff Management, Suppliers, and Store Settings are only available to store owners."
                },
                {
                    question: "The page is loading slowly. What should I do?",
                    answer: "Slow performance can be due to internet connection issues or browser cache. Try refreshing the page (Ctrl+R or Cmd+R), clearing your browser cache, or checking your internet connection."
                },
                {
                    question: "I'm seeing an error message. What do I do?",
                    answer: "Common error messages usually indicate validation issues (missing required fields) or connectivity problems. Read the error message carefully. If the issue persists, contact support with the error details."
                }
            ]
        }
    ];

    const filteredFAQs = faqCategories.map(category => ({
        ...category,
        faqs: category.faqs.filter(faq =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(category => category.faqs.length > 0);

    const toggleCategory = (categoryId) => {
        setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    };

    const handleContactSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        if (contactForm.subject.trim() === "" || contactForm.message.trim().length < 20) {
            setFormMessage({ type: "error", text: "Please fill in all required fields. Message must be at least 20 characters." });
            return;
        }

        // Simulate form submission
        setFormMessage({ type: "success", text: "Your message has been sent! We'll respond within 24 hours." });
        setContactForm({
            ...contactForm,
            subject: "",
            message: ""
        });

        setTimeout(() => setFormMessage({ type: "", text: "" }), 5000);
    };

    return (
        <div className="min-h-screen bg-[#FAFAF9] dark:bg-gray-900 p-8 transition-colors duration-200">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-semibold text-[#1A1A1A] dark:text-white mb-8 tracking-tight">Help & Support</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: FAQ */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Search Bar */}
                        <div className="relative">
                            <svg
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#737373] dark:text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search for help..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 text-base border border-[#E8E8E7] dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] transition-all bg-white dark:bg-gray-800 text-[#1A1A1A] dark:text-white dark:placeholder-gray-500"
                            />
                        </div>

                        {/* FAQ Categories */}
                        {filteredFAQs.length > 0 ? (
                            <div className="space-y-4">
                                {filteredFAQs.map((category) => (
                                    <div key={category.id} className="bg-white dark:bg-gray-800 border border-[#E8E8E7] dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden transition-colors duration-200">
                                        <button
                                            onClick={() => toggleCategory(category.id)}
                                            className="w-full flex items-center justify-between p-6 text-left hover:bg-[#FAFAF9] dark:hover:bg-gray-700/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-3xl">{category.icon}</span>
                                                <h2 className="text-xl font-semibold text-[#1A1A1A] dark:text-white">{category.title}</h2>
                                                <span className="ml-2 text-sm text-[#737373] dark:text-gray-400">({category.faqs.length})</span>
                                            </div>
                                            <svg
                                                className={`w-6 h-6 text-[#737373] dark:text-gray-400 transition-transform ${expandedCategory === category.id ? 'rotate-180' : ''}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        {expandedCategory === category.id && (
                                            <div className="border-t border-[#E8E8E7] dark:border-gray-700 px-6 pb-6">
                                                <div className="space-y-4 mt-6">
                                                    {category.faqs.map((faq, index) => (
                                                        <details key={index} className="group border border-[#E8E8E7] dark:border-gray-700 rounded-xl overflow-hidden">
                                                            <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#FAFAF9] dark:hover:bg-gray-700/50 transition-colors">
                                                                <span className="font-medium text-[#1A1A1A] dark:text-white pr-4">{faq.question}</span>
                                                                <svg
                                                                    className="w-5 h-5 text-[#737373] dark:text-gray-400 transition-transform group-open:rotate-180 flex-shrink-0"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                </svg>
                                                            </summary>
                                                            <div className="px-4 pb-4 text-[#737373] dark:text-gray-300 bg-[#FAFAF9]/50 dark:bg-gray-700/30 leading-relaxed" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                                                        </details>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-gray-800 border border-[#E8E8E7] dark:border-gray-700 rounded-2xl p-12 text-center transition-colors duration-200">
                                <svg className="w-16 h-16 text-[#E8E8E7] dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <h3 className="text-lg font-semibold text-[#1A1A1A] dark:text-white mb-2">No results found</h3>
                                <p className="text-[#737373] dark:text-gray-400 mb-6">We couldn't find any FAQs matching "{searchQuery}"</p>
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="px-6 py-2 bg-gradient-to-r from-[#F97316] to-[#FBBF24] text-white font-medium rounded-xl hover:shadow-md transition-all"
                                >
                                    Clear Search
                                </button>
                            </div>
                        )}

                        {/* Contact Support Form */}
                        <div className="bg-white dark:bg-gray-800 border border-[#E8E8E7] dark:border-gray-700 rounded-2xl shadow-sm p-8 transition-colors duration-200">
                            <div className="mb-6">
                                <h2 className="text-2xl font-semibold text-[#1A1A1A] dark:text-white mb-2">Still Need Help?</h2>
                                <p className="text-[#737373] dark:text-gray-400">Send us a message and we'll get back to you within 24 hours.</p>
                            </div>

                            {formMessage.text && (
                                <div className={`mb-6 p-4 rounded-xl flex items-center ${formMessage.type === "success"
                                        ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-700"
                                        : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-700"
                                    }`}>
                                    {formMessage.type === "success" ? (
                                        <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )}
                                    {formMessage.text}
                                </div>
                            )}

                            <form onSubmit={handleContactSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-[#1A1A1A] dark:text-gray-300 mb-2">Name</label>
                                        <input
                                            type="text"
                                            value={contactForm.name}
                                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                            className="w-full px-4 py-3 border border-[#E8E8E7] dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] transition-all bg-[#FAFAF9] dark:bg-gray-700 dark:text-white"
                                            readOnly
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#1A1A1A] dark:text-gray-300 mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={contactForm.email}
                                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                            className="w-full px-4 py-3 border border-[#E8E8E7] dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] transition-all bg-[#FAFAF9] dark:bg-gray-700 dark:text-white"
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#1A1A1A] dark:text-gray-300 mb-2">Category</label>
                                    <select
                                        value={contactForm.category}
                                        onChange={(e) => setContactForm({ ...contactForm, category: e.target.value })}
                                        className="w-full px-4 py-3 border border-[#E8E8E7] dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] transition-all bg-white dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="general">General Inquiry</option>
                                        <option value="technical">Technical Issue</option>
                                        <option value="billing">Billing Question</option>
                                        <option value="feature">Feature Request</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#1A1A1A] dark:text-gray-300 mb-2">Subject</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Brief description of your issue"
                                        value={contactForm.subject}
                                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                                        className="w-full px-4 py-3 border border-[#E8E8E7] dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] transition-all bg-white dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#1A1A1A] dark:text-gray-300 mb-2">Message</label>
                                    <textarea
                                        required
                                        rows={5}
                                        minLength={20}
                                        placeholder="Please provide as much detail as possible..."
                                        value={contactForm.message}
                                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                        className="w-full px-4 py-3 border border-[#E8E8E7] dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] transition-all resize-none bg-white dark:bg-gray-700 dark:text-white"
                                    />
                                    <p className="mt-2 text-sm text-[#737373] dark:text-gray-400">Minimum 20 characters</p>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full px-8 py-4 bg-gradient-to-r from-[#F97316] to-[#FBBF24] text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Contact & Info */}
                    <div className="space-y-6">
                        {/* Contact Information */}
                        <div className="bg-gradient-to-br from-[#F97316] to-[#FBBF24] rounded-2xl shadow-md p-6 text-white">
                            <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
                            <p className="text-white/90 mb-6 text-sm leading-relaxed">
                                Our support team is available Monday to Friday, 9AM-6PM (PHT) to assist you.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start bg-white/10 rounded-xl p-4 backdrop-blur-sm hover:bg-white/20 transition-colors">
                                    <svg className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <div>
                                        <p className="text-xs text-white/80 mb-1">Email Support</p>
                                        <a href="mailto:support@kaabuy.com" className="font-medium hover:underline">support@kaabuy.com</a>
                                    </div>
                                </div>
                                <div className="flex items-start bg-white/10 rounded-xl p-4 backdrop-blur-sm hover:bg-white/20 transition-colors">
                                    <svg className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <div>
                                        <p className="text-xs text-white/80 mb-1">Phone Support</p>
                                        <a href="tel:+6321234567" className="font-medium hover:underline">+63 (2) 123-4567</a>
                                    </div>
                                </div>
                                <div className="flex items-start bg-white/10 rounded-xl p-4 backdrop-blur-sm hover:bg-white/20 transition-colors">
                                    <svg className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <p className="text-xs text-white/80 mb-1">Working Hours</p>
                                        <p className="font-medium">Mon-Fri, 9AM-6PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="bg-white dark:bg-gray-800 border border-[#E8E8E7] dark:border-gray-700 rounded-2xl shadow-sm p-6 transition-colors duration-200">
                            <h3 className="text-lg font-semibold text-[#1A1A1A] dark:text-white mb-4">Quick Links</h3>
                            <div className="space-y-3">
                                <a href="#" className="flex items-center text-[#737373] dark:text-gray-400 hover:text-[#F97316] dark:hover:text-[#F97316] transition-colors group">
                                    <svg className="w-5 h-5 mr-2 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    User Guide (PDF)
                                </a>
                                <a href="#" className="flex items-center text-[#737373] dark:text-gray-400 hover:text-[#F97316] dark:hover:text-[#F97316] transition-colors group">
                                    <svg className="w-5 h-5 mr-2 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    Video Tutorials
                                </a>
                                <a href="#" className="flex items-center text-[#737373] dark:text-gray-400 hover:text-[#F97316] dark:hover:text-[#F97316] transition-colors group">
                                    <svg className="w-5 h-5 mr-2 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    System Status
                                </a>
                            </div>
                        </div>

                        {/* Version Info */}
                        <div className="bg-white dark:bg-gray-800 border border-[#E8E8E7] dark:border-gray-700 rounded-2xl shadow-sm p-6 text-center transition-colors duration-200">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#F97316] to-[#FBBF24] rounded-xl mx-auto mb-3 flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <p className="text-[#737373] dark:text-gray-400 text-sm mb-1">Kaabuy POS System</p>
                            <p className="font-semibold text-[#1A1A1A] dark:text-white text-lg">Version 1.0.0</p>
                            <p className="text-xs text-[#737373] dark:text-gray-500 mt-3">Last Updated: December 2025</p>
                            <p className="text-xs text-[#737373] dark:text-gray-500 mt-4">© 2025 Kaabuy Dev Team</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HelpSupport;
