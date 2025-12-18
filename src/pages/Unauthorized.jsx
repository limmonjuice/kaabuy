// pages/Unauthorized.jsx
import { useNavigate } from 'react-router-dom'

const Unauthorized = () => {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col items-center justify-center h-screen text-center p-5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
            <h1 className="text-7xl m-0 mb-4">🚫</h1>
            <h2 className="text-2xl font-bold mb-2">403 - Access Denied</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">You don't have permission to access this resource.</p>
            <div className="flex gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="px-5 py-2.5 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                    Go Back
                </button>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="px-5 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-lg hover:shadow-xl"
                >
                    Go to Dashboard
                </button>
            </div>
        </div>
    )
}

export default Unauthorized