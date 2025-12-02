import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_URL } from "../config/constants";
import logo from "../assets/logo 2.png";

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
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
      navigate("/");
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

    if (!regUsername || !regPassword || !firstName || !lastName) {
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
          lastName
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Registration failed' }));
        throw new Error(errorData.message || 'Registration failed');
      }

      setSuccessMessage("Registration successful! Please login.");
      setIsLogin(true);
      setRegUsername("");
      setRegPassword("");
      setFirstName("");
      setLastName("");
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-orange-100 flex items-center justify-center p-4 lg:p-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-300/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
      
      {/* Main container - fixed width for consistent layout */}
      <div className="relative w-full max-w-[900px] h-[620px]">
        
        {/* Login Form - Always positioned on RIGHT side */}
        <div
          className={`absolute right-0 top-0 w-[calc(50%-10px)] h-full flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.68,-0.15,0.32,1.15)] ${
            isLogin 
              ? "opacity-100 scale-100 z-10" 
              : "opacity-0 scale-95 pointer-events-none z-0"
          }`}
        >
          <div className="bg-gradient-to-br from-orange-50/80 to-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 lg:p-10 w-full max-w-[400px]">
            <div className="mb-6">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent mb-4">
                Login
              </h1>

              {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm mb-4">
                  {successMessage}
                </div>
              )}

              {error && isLogin && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">
                  {error}
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Username */}
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  className="w-full px-4 py-4 bg-transparent border-b-2 border-gray-300 focus:border-orange-500 outline-none transition-colors placeholder-transparent peer"
                  placeholder="Username"
                />
                <label className="absolute left-0 -top-5 text-sm font-medium text-gray-700 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-orange-500">
                  Username
                </label>
                <svg className="absolute right-2 top-4 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  disabled={loading}
                  className="w-full px-4 py-4 bg-transparent border-b-2 border-gray-300 focus:border-orange-500 outline-none transition-colors placeholder-transparent peer"
                  placeholder="Password"
                />
                <label className="absolute left-0 -top-5 text-sm font-medium text-gray-700 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-orange-500">
                  Password
                </label>
                {passwordFocused ? (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-4 w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors"
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
                  <svg className="absolute right-2 top-4 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 accent-orange-500 rounded"
                  />
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
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-400 text-white py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Login"}
              </button>

              {/* Toggle Link */}
              <p className="text-center text-sm text-gray-600">
                New Here?{" "}
                <button onClick={toggleMode} className="text-orange-500 hover:text-orange-600 font-semibold transition-colors">
                  Create an Account
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Register Form - Always positioned on LEFT side */}
        <div
          className={`absolute left-0 top-0 w-[calc(50%-10px)] h-full flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.68,-0.15,0.32,1.15)] ${
            isLogin 
              ? "opacity-0 scale-95 pointer-events-none z-0" 
              : "opacity-100 scale-100 z-10"
          }`}
        >
          <div className="bg-gradient-to-br from-orange-50/80 to-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 lg:p-10 w-full max-w-[400px]">
            <div className="mb-6">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent mb-4">
                Sign Up
              </h1>

              {error && !isLogin && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">
                  {error}
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* Username */}
              <div className="relative">
                <input
                  type="text"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-300 focus:border-orange-500 outline-none transition-colors placeholder-transparent peer"
                  placeholder="Username"
                />
                <label className="absolute left-0 -top-4 text-sm font-medium text-gray-700 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-focus:-top-4 peer-focus:text-sm peer-focus:text-orange-500">
                  Username
                </label>
                <svg className="absolute right-2 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>

              {/* First Name */}
              <div className="relative">
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-300 focus:border-orange-500 outline-none transition-colors placeholder-transparent peer"
                  placeholder="First Name"
                />
                <label className="absolute left-0 -top-4 text-sm font-medium text-gray-700 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-focus:-top-4 peer-focus:text-sm peer-focus:text-orange-500">
                  First Name
                </label>
                <svg className="absolute right-2 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>

              {/* Last Name */}
              <div className="relative">
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-300 focus:border-orange-500 outline-none transition-colors placeholder-transparent peer"
                  placeholder="Last Name"
                />
                <label className="absolute left-0 -top-4 text-sm font-medium text-gray-700 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-focus:-top-4 peer-focus:text-sm peer-focus:text-orange-500">
                  Last Name
                </label>
                <svg className="absolute right-2 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-300 focus:border-orange-500 outline-none transition-colors placeholder-transparent peer"
                  placeholder="Password"
                />
                <label className="absolute left-0 -top-4 text-sm font-medium text-gray-700 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-focus:-top-4 peer-focus:text-sm peer-focus:text-orange-500">
                  Password
                </label>
                {regPasswordFocused ? (
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-2 top-3 w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors"
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
                  <svg className="absolute right-2 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
              </div>

              {/* Sign Up Button */}
              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-400 text-white py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>

              {/* Toggle Link */}
              <p className="text-center text-sm text-gray-600">
                Already Have an Account?{" "}
                <button onClick={toggleMode} className="text-orange-500 hover:text-orange-600 font-semibold transition-colors">
                  Login
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Logo Panel - Slides between LEFT (login mode) and RIGHT (register mode) */}
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

            {/* Click hint
            <p className={`mt-6 text-white/80 text-sm font-medium tracking-wide text-center transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
              {isLogin ? "New Here? Click to Sign Up" : "Already Have an Account? Click to Login"}
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
}