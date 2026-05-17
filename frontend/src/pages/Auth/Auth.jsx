import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { API_ENDPOINTS } from "../../config/api";
import "./Auth.css";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");
  const { login, signup, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    keepLoggedIn: false,
  });
  const [signupData, setSignupData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    referralCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const refCode = params.get("ref");
    if (refCode) {
      setSignupData((prev) => ({ ...prev, referralCode: refCode }));
      setActiveTab("signup");
    }
  }, [location.search]);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      updateStrength(value);
    }
  };

  const updateStrength = (val) => {
    if (val.length === 0) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (val.length >= 6) strength++;
    if (/[A-Z]/.test(val)) strength++;
    if (/[0-9]/.test(val)) strength++;
    if (/[^A-Za-z0-9]/.test(val)) strength++;
    setPasswordStrength(strength);
  };

  const onLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(loginData.email, loginData.password, loginData.keepLoggedIn);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const onSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!signupData.name || !signupData.phone || !signupData.email || !signupData.password) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      await signup(signupData);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_ENDPOINTS.auth}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotPasswordData.email, role: "customer" }),
      });
      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Server error. Please try again later.");
      }
      if (!res.ok) throw new Error(data.message || "Request failed");
      setSuccess("OTP sent to your email.");
      setActiveTab("verifyOTP");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_ENDPOINTS.auth}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: forgotPasswordData.email, 
          otp: forgotPasswordData.otp,
          role: "customer" 
        }),
      });
      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Server error. Please try again later.");
      }
      if (!res.ok) throw new Error(data.message || "Verification failed");
      setSuccess("OTP verified. Set your new password.");
      setActiveTab("resetPassword");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_ENDPOINTS.auth}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: forgotPasswordData.email, 
          otp: forgotPasswordData.otp,
          newPassword: forgotPasswordData.newPassword,
          role: "customer"
        }),
      });
      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Server error. Please try again later.");
      }
      if (!res.ok) throw new Error(data.message || "Reset failed");
      setSuccess("Password reset successfully. You can now login.");
      setActiveTab("login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const texts = ["Weak", "Moderate", "Strong", "Very Strong"];

  return (
    <div className="min-h-screen relative flex flex-col overflow-x-hidden bg-[#F6F0E4]">
      <main className="flex-grow relative flex items-center justify-center px-4 py-10 lg:py-16">
        <div className="absolute inset-0 bg-pattern"></div>
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#800020]/10 to-transparent pointer-events-none"></div>

        <div className="auth-card w-full max-w-[520px] bg-white overflow-hidden animate-card-3d relative z-10">
          <div className="relative min-h-36 bg-[#2D1B0E] px-7 py-8 text-white overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1610189330278-4a6b8fd08b78?auto=format&fit=crop&q=80&w=900"
              className="absolute inset-0 w-full h-full object-cover opacity-20"
              alt=""
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#800020]/90 via-[#3D2817]/86 to-[#111]/70"></div>
            <div className="relative z-10">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-[#D4AF37] text-xs font-bold uppercase tracking-[0.18em] mb-7"
              >
                <iconify-icon icon="lucide:arrow-left"></iconify-icon>
                Back to store
              </Link>
              <h1 className="brand-font text-3xl sm:text-4xl font-bold text-[#D4AF37] leading-tight">
                {activeTab === "login" ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="mt-3 max-w-sm text-sm leading-6 text-white/80">
                {activeTab === "login"
                  ? "Login to manage your orders, wishlist, and checkout faster."
                  : "Sign up once and enjoy a smoother shopping experience."}
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-7 lg:p-8">
            <div className="grid grid-cols-2 gap-2 mb-7 rounded-xl bg-[#F5F1E8] p-1.5">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("login");
                  setError("");
                }}
                className={`rounded-lg px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] transition-all ${
                  activeTab === "login"
                    ? "bg-white text-[#800020] shadow-sm"
                    : "text-[#3D2817]/65 hover:text-[#800020]"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("signup");
                  setError("");
                }}
                className={`rounded-lg px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] transition-all ${
                  activeTab === "signup"
                    ? "bg-white text-[#800020] shadow-sm"
                    : "text-[#3D2817]/65 hover:text-[#800020]"
                }`}
              >
                Sign Up
              </button>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm font-semibold animate-shake">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700 text-sm font-semibold">
                {success}
              </div>
            )}

            {activeTab === "login" && (
              <div className="form-content animate-fade-in">
                <form className="space-y-5" onSubmit={onLogin}>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#3D2817]/65">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3D2817]/70 flex items-center">
                        <iconify-icon icon="lucide:mail"></iconify-icon>
                      </span>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="Enter your email address"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        className="premium-input w-full bg-[#FBF9F6] border border-[#D4AF37]/30 rounded-xl px-11 py-3.5 outline-none focus:border-[#800020] text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#3D2817]/65">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab("forgotPassword");
                          setError("");
                          setSuccess("");
                        }}
                        className="text-[10px] font-bold text-[#800020] hover:underline uppercase tracking-[0.12em]"
                      >
                        Forgot?
                      </button>
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3D2817]/70 flex items-center">
                        <iconify-icon icon="lucide:lock"></iconify-icon>
                      </span>
                      <input
                        type="password"
                        name="password"
                        required
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        className="premium-input w-full bg-[#FBF9F6] border border-[#D4AF37]/30 rounded-xl px-11 py-3.5 outline-none focus:border-[#800020] text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="keepLoggedIn"
                      name="keepLoggedIn"
                      checked={loginData.keepLoggedIn}
                      onChange={handleLoginChange}
                      className="w-4 h-4 text-[#800020] border-[#D4AF37]/30 rounded focus:ring-[#800020] cursor-pointer"
                    />
                    <label
                      htmlFor="keepLoggedIn"
                      className="ml-3 text-xs text-gray-600 uppercase tracking-[0.12em] font-bold cursor-pointer"
                    >
                      Keep me logged in
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="auth-submit w-full py-4 rounded-xl text-[#D4AF37] bg-[#800020] font-bold text-xs uppercase tracking-[0.2em] shadow-lg transform transition-all active:scale-[0.98] hover:bg-[#3D2817] disabled:opacity-50"
                  >
                    {loading ? "Loading..." : "Login"}
                  </button>
                </form>
              </div>
            )}

            {activeTab === "forgotPassword" && (
              <div className="form-content animate-fade-in">
                <form className="space-y-5" onSubmit={handleForgotPassword}>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#3D2817]/65">
                      Enter Registered Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="email@example.com"
                      value={forgotPasswordData.email}
                      onChange={(e) => setForgotPasswordData({...forgotPasswordData, email: e.target.value})}
                      className="premium-input w-full bg-[#FBF9F6] border border-[#D4AF37]/30 rounded-xl px-4 py-3.5 outline-none focus:border-[#800020] text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="auth-submit w-full py-4 rounded-xl text-[#D4AF37] bg-[#800020] font-bold text-xs uppercase tracking-[0.2em] shadow-lg transform transition-all active:scale-[0.98] hover:bg-[#3D2817] disabled:opacity-50"
                  >
                    {loading ? "Sending..." : "Send Reset OTP"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("login")}
                    className="w-full text-center text-xs font-bold text-[#3D2817]/60 uppercase tracking-widest mt-2 hover:text-[#800020]"
                  >
                    Back to Login
                  </button>
                </form>
              </div>
            )}

            {activeTab === "verifyOTP" && (
              <div className="form-content animate-fade-in">
                <form className="space-y-5" onSubmit={handleVerifyOTP}>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#3D2817]/65">
                      Enter 6-Digit OTP
                    </label>
                    <input
                      type="text"
                      maxLength="6"
                      required
                      placeholder="123456"
                      value={forgotPasswordData.otp}
                      onChange={(e) => setForgotPasswordData({...forgotPasswordData, otp: e.target.value})}
                      className="premium-input w-full text-center tracking-[1em] font-bold bg-[#FBF9F6] border border-[#D4AF37]/30 rounded-xl px-4 py-3.5 outline-none focus:border-[#800020] text-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="auth-submit w-full py-4 rounded-xl text-[#D4AF37] bg-[#800020] font-bold text-xs uppercase tracking-[0.2em] shadow-lg transform transition-all active:scale-[0.98] hover:bg-[#3D2817] disabled:opacity-50"
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                </form>
              </div>
            )}

            {activeTab === "resetPassword" && (
              <div className="form-content animate-fade-in">
                <form className="space-y-5" onSubmit={handleResetPassword}>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#3D2817]/65">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={forgotPasswordData.newPassword}
                      onChange={(e) => setForgotPasswordData({...forgotPasswordData, newPassword: e.target.value})}
                      className="premium-input w-full bg-[#FBF9F6] border border-[#D4AF37]/30 rounded-xl px-4 py-3.5 outline-none focus:border-[#800020] text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#3D2817]/65">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={forgotPasswordData.confirmPassword}
                      onChange={(e) => setForgotPasswordData({...forgotPasswordData, confirmPassword: e.target.value})}
                      className="premium-input w-full bg-[#FBF9F6] border border-[#D4AF37]/30 rounded-xl px-4 py-3.5 outline-none focus:border-[#800020] text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="auth-submit w-full py-4 rounded-xl text-[#D4AF37] bg-[#800020] font-bold text-xs uppercase tracking-[0.2em] shadow-lg transform transition-all active:scale-[0.98] hover:bg-[#3D2817] disabled:opacity-50"
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                </form>
              </div>
            )}

            {activeTab === "signup" && (
              <div className="form-content animate-fade-in">
                <form className="space-y-5" onSubmit={onSignup}>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#3D2817]/65">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Ananya Verma"
                      value={signupData.name}
                      onChange={handleSignupChange}
                      className="premium-input w-full bg-[#FBF9F6] border border-[#D4AF37]/30 rounded-xl px-4 py-3.5 outline-none focus:border-[#800020] text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#3D2817]/65">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        name="phone"
                        required
                        placeholder="9876543210"
                        value={signupData.phone}
                        onChange={handleSignupChange}
                        className="premium-input w-full bg-[#FBF9F6] border border-[#D4AF37]/30 rounded-xl px-4 py-3.5 outline-none focus:border-[#800020] text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#3D2817]/65">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="ananya@example.com"
                        value={signupData.email}
                        onChange={handleSignupChange}
                        className="premium-input w-full bg-[#FBF9F6] border border-[#D4AF37]/30 rounded-xl px-4 py-3.5 outline-none focus:border-[#800020] text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#3D2817]/65">
                      Create Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      required
                      placeholder="Create a strong password"
                      value={signupData.password}
                      onChange={handleSignupChange}
                      className="premium-input w-full bg-[#FBF9F6] border border-[#D4AF37]/30 rounded-xl px-4 py-3.5 outline-none focus:border-[#800020] text-sm"
                    />

                    <div className="flex gap-1 mt-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`strength-bar h-1 w-1/4 rounded-full transition-all duration-300 ${
                            i <= passwordStrength ? `strength-level-${passwordStrength}` : "strength-empty"
                          }`}
                        ></div>
                      ))}
                    </div>
                    <p
                      className={`password-strength-label text-[10px] uppercase font-bold tracking-widest mt-1 ${
                        passwordStrength > 0 ? `strength-text-${passwordStrength}` : "strength-text-empty"
                      }`}
                    >
                      {passwordStrength > 0
                        ? texts[passwordStrength - 1]
                        : "Enter Password"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#3D2817]/65">
                      Referral Code (Optional)
                    </label>
                    <input
                      type="text"
                      name="referralCode"
                      placeholder="SAM123"
                      value={signupData.referralCode}
                      onChange={handleSignupChange}
                      className="premium-input w-full bg-[#FBF9F6] border border-[#D4AF37]/30 rounded-xl px-4 py-3.5 outline-none focus:border-[#800020] text-sm uppercase"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="auth-submit w-full py-4 rounded-xl text-[#D4AF37] bg-[#800020] font-bold text-xs uppercase tracking-[0.2em] shadow-lg transform transition-all active:scale-[0.98] hover:bg-[#3D2817] disabled:opacity-50"
                  >
                    {loading ? "Creating..." : "Create Account"}
                  </button>
                </form>
              </div>
            )}

            <div className="mt-7 grid grid-cols-2 gap-3 border-t border-[#D4AF37]/20 pt-5">
              <div className="flex items-center space-x-2 text-[#3D2817]/70">
                <iconify-icon
                  icon="lucide:shield-check"
                  className="text-2xl text-[#800020]"
                ></iconify-icon>
                <span className="text-[10px] font-bold uppercase tracking-[0.16em]">
                  Secure Login
                </span>
              </div>
              <div className="flex items-center justify-end space-x-2 text-[#3D2817]/70">
                <iconify-icon
                  icon="lucide:package-check"
                  className="text-xl text-[#D4AF37]"
                ></iconify-icon>
                <span className="text-[10px] font-bold uppercase tracking-[0.16em]">
                  Order Access
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;
