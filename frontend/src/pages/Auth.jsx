import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_URL } from "../config/constants";
import logo from "../assets/logo 2.png";
import authBg from "../assets/auth-bg.png";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  // Login form states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Register form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regPasswordFocused, setRegPasswordFocused] = useState(false);

  // UI states
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      setIsLogin(true);
    }

    if (location.pathname === "/register") {
      setIsLogin(false);
    }
  }, [location]);

  const toggleMode = () => {
    if (isAnimating || loading) return;
    setIsAnimating(true);
    setError("");
    setSuccessMessage("");
    setIsLogin(!isLogin);

    navigate(isLogin ? "/register" : "/login", { replace: true });

    setTimeout(() => setIsAnimating(false), 700);
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError("");
    setLoading(true);

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
      login(data);

      if (data.requiresPasswordChange) {
        navigate("/change-credentials");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e?.preventDefault();
    setError("");
    setLoading(true);

    if (!regUsername || !regPassword || !firstName || !lastName || !storeName) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (regPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: regUsername,
          password: regPassword,
          firstName,
          lastName,
          storeName
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Registration failed' }));
        throw new Error(errorData.message || 'Registration failed');
      }

      setSuccessMessage("Registration successful! Please login.");
      setIsLogin(true);
      navigate("/login", { replace: true });
      setRegUsername("");
      setRegPassword("");
      setFirstName("");
      setLastName("");
      setStoreName("");
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (isLogin) {
        handleLogin();
      } else {
        handleRegister();
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 lg:p-8 relative overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Background image with wave animation */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-wave"
        style={{ backgroundImage: `url(${authBg})` }}
      />
      {/* Dark mode overlay for background */}
      <div className="absolute inset-0 bg-black/0 dark:bg-black/40 transition-colors duration-500 pointer-events-none" />

      {/* CSS for wave animation */}
      <style jsx>{`
        @keyframes wave {
          0% {
            transform: translateY(0) translateX(0) scale(1.05);
          }
          33% {
            transform: translateY(-15px) translateX(10px) scale(1.05);
          }
          66% {
            transform: translateY(10px) translateX(-10px) scale(1.05);
          }
          100% {
            transform: translateY(0) translateX(0) scale(1.05);
          }
        }

        .animate-wave {
          animation: wave 15s ease-in-out infinite;
        }
      `}</style>

      {/* Main container */}
      <div className="relative w-full max-w-[900px] h-[580px]">

        {/* Login Form - RIGHT side */}
        <div
          className={`absolute right-0 top-0 w-[calc(50%-10px)] h-full flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.68,-0.15,0.32,1.15)] ${isLogin
            ? "opacity-100 scale-100 z-10"
            : "opacity-0 scale-95 pointer-events-none z-0"
            }`}
        >
          {/* Extended container - rounded only on right, extends off left edge */}
          <div className="bg-gradient-to-br from-orange-50/80 to-white/90 dark:from-gray-900/90 dark:to-gray-800/90 backdrop-blur-sm rounded-r-3xl shadow-2xl p-8 w-[calc(100%+100px)] h-[520px] flex flex-col -ml-[100px] border border-white/20 dark:border-gray-700">
            <div className="w-[calc(100%-100px)] ml-auto">
              <div className="mb-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent text-center pb-1">
                  Login
                </h1>

                {successMessage && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl text-sm mt-4">
                    {successMessage}
                  </div>
                )}

                {error && isLogin && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm mt-4">
                    {error}
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col justify-center space-y-5 mt-6">
                {/* Username */}
                <div className="relative pt-5">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-500 outline-none transition-colors placeholder-transparent peer text-gray-900 dark:text-white"
                    placeholder="Username"
                  />
                  <label className="absolute left-0 top-1 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-8 peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-gray-500 peer-focus:top-1 peer-focus:text-sm peer-focus:text-orange-500 dark:peer-focus:text-orange-400">
                    Username
                  </label>
                  <svg className="absolute right-2 top-8 w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>

                {/* Password */}
                <div className="relative pt-5">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-500 outline-none transition-colors placeholder-transparent peer [&::-ms-reveal]:hidden [&::-webkit-credentials-auto-fill-button]:hidden text-gray-900 dark:text-white"
                    placeholder="Password"
                  />
                  <label className="absolute left-0 top-1 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-8 peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-gray-500 peer-focus:top-1 peer-focus:text-sm peer-focus:text-orange-500 dark:peer-focus:text-orange-400">
                    Password
                  </label>
                  {passwordFocused ? (
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-8 w-5 h-5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  ) : (
                    <svg className="absolute right-2 top-8 w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between text-sm pt-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 accent-orange-500 rounded"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => alert("Password reset not implemented")}
                    className="text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              <div className="space-y-4 mt-6">
                {/* Login Button */}
                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-400 text-white py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Signing in..." : "Login"}
                </button>

                {/* Toggle Link */}
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  New Here?{" "}
                  <button onClick={toggleMode} className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 font-semibold transition-colors">
                    Create an Account
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Register Form - LEFT side */}
        <div
          className={`absolute left-0 top-0 w-[calc(50%-10px)] h-full flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.68,-0.15,0.32,1.15)] ${isLogin
            ? "opacity-0 scale-95 pointer-events-none z-0"
            : "opacity-100 scale-100 z-10"
            }`}
        >
          {/* Extended container - rounded only on left, extends off right edge */}
          <div className="bg-gradient-to-br from-orange-50/80 to-white/90 dark:from-gray-900/90 dark:to-gray-800/90 backdrop-blur-sm rounded-l-3xl shadow-2xl p-8 w-[calc(100%+100px)] min-h-[520px] max-h-[580px] overflow-y-auto flex flex-col -mr-[100px] border border-white/20 dark:border-gray-700">
            <div className="w-[calc(100%-100px)] flex flex-col pb-6">
              <div className="mb-3">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent text-center">
                  Create a Kaabuy Account
                </h1>
                <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-2">
                  Owner account with full access
                </p>

                {error && !isLogin && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm mt-2 mb-1">
                    {error}
                  </div>
                )}
              </div>

              <div className={`flex-1 gap-3 flex flex-col justify-center ${error ? 'space-y-2' : 'space-y-5'}`}>
                {/* First Name & Last Name - Side by side */}
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={loading}
                      className="w-full px-2 py-2.5 bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-500 outline-none transition-colors placeholder-transparent peer text-gray-900 dark:text-white"
                      placeholder="First Name"
                    />
                    <label className="absolute left-0 -top-5 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-gray-500 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-orange-500 dark:peer-focus:text-orange-400">
                      First Name
                    </label>
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={loading}
                      className="w-full px-2 py-2.5 bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-500 outline-none transition-colors placeholder-transparent peer text-gray-900 dark:text-white"
                      placeholder="Last Name"
                    />
                    <label className="absolute left-0 -top-5 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-gray-500 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-orange-500 dark:peer-focus:text-orange-400">
                      Last Name
                    </label>
                  </div>
                </div>

                {/* Store Name */}
                <div className="relative">
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    className="w-full px-4 py-2.5 bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-500 outline-none transition-colors placeholder-transparent peer text-gray-900 dark:text-white"
                    placeholder="Store Name"
                  />
                  <label className="absolute left-0 -top-5 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-gray-500 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-orange-500 dark:peer-focus:text-orange-400">
                    Store Name
                  </label>
                  <svg className="absolute right-2 top-3 w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>

                {/* Username */}
                <div className="relative">
                  <input
                    type="text"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    className="w-full px-4 py-2.5 bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-500 outline-none transition-colors placeholder-transparent peer text-gray-900 dark:text-white"
                    placeholder="Username"
                  />
                  <label className="absolute left-0 -top-5 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-gray-500 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-orange-500 dark:peer-focus:text-orange-400">
                    Username
                  </label>
                  <svg className="absolute right-2 top-3 w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>

                {/* Password */}
                <div className="relative">
                  <input
                    type={showRegPassword ? "text" : "password"}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setRegPasswordFocused(true)}
                    onBlur={() => setRegPasswordFocused(false)}
                    disabled={loading}
                    className="w-full px-4 py-2.5 bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-500 outline-none transition-colors placeholder-transparent peer [&::-ms-reveal]:hidden [&::-webkit-credentials-auto-fill-button]:hidden text-gray-900 dark:text-white"
                    placeholder="Password"
                  />
                  <label className="absolute left-0 -top-5 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-gray-500 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-orange-500 dark:peer-focus:text-orange-400">
                    Password
                  </label>
                  {regPasswordFocused ? (
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2 top-3 w-5 h-5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                    >
                      {showRegPassword ? (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  ) : (
                    <svg className="absolute right-2 top-3 w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                </div>
              </div>

              <div className="space-y-8 mt-4">
                {/* Sign Up Button */}
                <button
                  onClick={handleRegister}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-400 text-white py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating Account..." : "Sign Up"}
                </button>

                {/* Toggle Link */}
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Already Have an Account?{" "}
                  <button onClick={toggleMode} className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 font-semibold transition-colors">
                    Login
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Logo Panel - Slides between LEFT (login) and RIGHT (register) */}
        <div
          onClick={toggleMode}
          className="absolute top-0 left-0 w-[calc(50%-10px)] h-full bg-gradient-to-br from-orange-400 via-orange-500 to-yellow-400 rounded-3xl shadow-2xl cursor-pointer z-30 flex items-center justify-center overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.68,-0.15,0.32,1.15)]"
          style={{
            transform: isLogin ? "translateX(0)" : "translateX(calc(100% + 20px))"
          }}
        >
          {/* Inner glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10" />

          {/* Logo */}
          <div className="relative z-10 flex flex-col items-center justify-center p-8">
            <img
              src={logo}
              alt="Logo"
              className="w-56 h-auto object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}