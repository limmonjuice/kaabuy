function HelpSupport() {
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Help & Support</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: FAQ */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            <details className="group border border-gray-200 rounded-lg">
                                <summary className="flex items-center justify-between p-4 cursor-pointer">
                                    <span className="font-medium text-gray-900">How do I reset my password?</span>
                                    <svg className="w-5 h-5 text-gray-500 transition group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </summary>
                                <div className="px-4 pb-4 text-gray-600 bg-gray-50/50 rounded-b-lg">
                                    You can change your password in the <strong>Settings</strong> page under the "Security & Password" tab. If you have forgotten your password and cannot log in, please contact the system administrator.
                                </div>
                            </details>
                            <details className="group border border-gray-200 rounded-lg">
                                <summary className="flex items-center justify-between p-4 cursor-pointer">
                                    <span className="font-medium text-gray-900">How do I add a new product?</span>
                                    <svg className="w-5 h-5 text-gray-500 transition group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </summary>
                                <div className="px-4 pb-4 text-gray-600 bg-gray-50/50 rounded-b-lg">
                                    Go to the <strong>Products</strong> page and click the "+ Add Product" button in the top right corner. Fill in the required details and upload an image if available.
                                </div>
                            </details>
                            <details className="group border border-gray-200 rounded-lg">
                                <summary className="flex items-center justify-between p-4 cursor-pointer">
                                    <span className="font-medium text-gray-900">What happens when stock is low?</span>
                                    <svg className="w-5 h-5 text-gray-500 transition group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </summary>
                                <div className="px-4 pb-4 text-gray-600 bg-gray-50/50 rounded-b-lg">
                                    The system automatically flags products with stock levels below the reorder point as "Low Stock". You will see a warning badge on the Product card and in the dashboard summary.
                                </div>
                            </details>
                        </div>
                    </div>
                </div>
                {/* Right Column: Contact & Info */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl shadow-md p-6 text-white">
                        <h2 className="text-xl font-bold mb-2">Need more help?</h2>
                        <p className="text-orange-50 mb-6 text-sm">Our support team is available 24/7 to assist you with any issues.</p>
                        <div className="space-y-4">
                            <div className="flex items-center bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <div>
                                    <p className="text-xs text-orange-200">Email Support</p>
                                    <p className="font-medium">support@kaabuy.com</p>
                                </div>
                            </div>
                            <div className="flex items-center bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <div>
                                    <p className="text-xs text-orange-200">Phone Support</p>
                                    <p className="font-medium">+63 (2) 123-4567</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                        <p className="text-gray-500 text-sm mb-2">Kaabuy POS System</p>
                        <p className="font-bold text-gray-800">Version 1.0.0</p>
                        <p className="text-xs text-gray-400 mt-4">© 2025 Kaabuy Dev Team</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default HelpSupport;