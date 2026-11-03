import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_URL } from "../config/constants";
import logo from "../assets/logo 2.png";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for success message from registration
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message from location state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError("");
    setLoading(true);

    // Basic validation
    if (!username || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
        throw new Error(errorData.message || 'Invalid username or password');
      }

      const data = await response.json();
      // data contains: token, tokenType, staffId, username, firstName, lastName, role
      login(data);
      navigate("/");
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleNavigateToRegister = (e) => {
    e.preventDefault();
    setIsAnimating(true);
    setTimeout(() => {
      navigate('/register');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-orange-100 flex items-center justify-center p-4 lg:p-8">
      <div className="w-full max-w-6xl flex items-center justify-center gap-8 lg:gap-12">
        {/* Left Side - Logo Card */}
        <div className={`hidden lg:flex items-center justify-center bg-gradient-to-br from-orange-400 via-orange-500 to-yellow-400 rounded-3xl shadow-2xl w-full max-w-md h-[600px] relative overflow-hidden ${isAnimating ? 'animate-[swapRight_0.8s_ease-in-out]' : 'animate-[slideInLeft_0.8s_ease-out]'}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400/80 via-orange-500/80 to-yellow-400/80"></div>
          <div className="relative z-10 flex items-center justify-center w-full h-full p-12">
            <img
              src={logo}
              alt="Logo"
              className="w-80 h-auto object-contain drop-shadow-2xl animate-[fadeIn_1s_ease-out_0.3s_both]"
            />
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className={`bg-gradient-to-br from-orange-50/60 to-white backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-md p-8 lg:p-10 ${isAnimating ? 'animate-[swapLeft_0.8s_ease-in-out]' : 'animate-[slideInRight_0.8s_ease-out]'}`}>
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent mb-6 animate-[fadeInDown_0.6s_ease-out_0.2s_both]">
              Login
            </h1>

            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm mb-4">
                {successMessage}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">
                {error}
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Username Input */}
            <div className="relative animate-[fadeInUp_0.6s_ease-out_0.3s_both]">
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-4 bg-transparent border-b-2 border-gray-300 focus:border-orange-500 outline-none transition-colors placeholder-transparent peer"
                placeholder="Username"
                disabled={loading}
              />
              <label
                htmlFor="username"
                className="absolute left-0 -top-5 text-sm font-medium text-gray-700 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-orange-500"
              >
                Username
              </label>
              <svg className="absolute right-2 top-4 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>

            {/* Password Input */}
            <div className="relative animate-[fadeInUp_0.6s_ease-out_0.4s_both]">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-4 bg-transparent border-b-2 border-gray-300 focus:border-orange-500 outline-none transition-colors placeholder-transparent peer"
                placeholder="Password"
                disabled={loading}
              />
              <label
                htmlFor="password"
                className="absolute left-0 -top-5 text-sm font-medium text-gray-700 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-orange-500"
              >
                Password
              </label>
              <svg className="absolute right-2 top-4 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between text-sm animate-[fadeInUp_0.6s_ease-out_0.5s_both]">
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-orange-500 rounded" />
                <span className="ml-2 text-gray-700">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => alert("Password reset not implemented")}
                className="text-gray-600 hover:text-orange-500 transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-400 text-white py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 animate-[fadeInUp_0.6s_ease-out_0.6s_both]"
            >
              {loading ? "Signing in..." : "Login"}
            </button>

            {/* Sign up link */}
            <div className="text-center text-sm animate-[fadeInUp_0.6s_ease-out_0.7s_both]">
              <span className="text-gray-600">New Here? </span>
              <a href="/register" onClick={handleNavigateToRegister} className="text-orange-500 hover:text-orange-600 font-semibold transition-colors cursor-pointer">
                Create an Account
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;