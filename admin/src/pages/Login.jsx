import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-[#FAFAFA]">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(#032817 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        }}
      />

      {/* Soft color blobs */}
      <div className="absolute top-[-15%] right-[-8%] w-[500px] h-[500px] rounded-full bg-[#E3494E] opacity-[0.06] blur-3xl" />
      <div className="absolute bottom-[-12%] left-[-6%] w-[450px] h-[450px] rounded-full bg-[#E6D3AC] opacity-[0.08] blur-3xl" />

      {/* Content */}
      <div className="relative flex flex-col items-center w-full max-w-[380px] px-5 z-10">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="w-[56px] h-[56px] rounded-[16px] bg-white flex items-center justify-center shadow-[0_2px_12px_rgba(3,40,23,0.06)] border border-[rgba(3,40,23,0.05)]">
            <img
              src="/john-ent.svg"
              alt="John's Enterprise"
              className="w-8 h-8"
            />
          </div>
          <div className="text-center">
            <p className="text-[#121212] font-clash-grotesk font-semibold text-sm leading-4 tracking-[0.4px]">
              John's Enterprise
            </p>
            <p className="text-[#717182] font-dm-sans-500 text-[11px] mt-1">
              Admin Dashboard
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="w-full p-6 rounded-[20px] border border-[rgba(3,40,23,0.05)] bg-white shadow-[0_2px_20px_rgba(0,0,0,0.03)]">
          <div className="mb-5">
            <h1 className="text-[#2D2D2D] text-xl font-semibold font-clash-grotesk mb-0.5">
              Welcome Back
            </h1>
            <p className="text-[#6B6B6B] font-dm-sans text-[13px]">
              Sign in to your admin dashboard
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="px-3 py-2.5 rounded-[10px] bg-[#FFF0F0] border border-[#FFD0D0] mb-4">
              <p className="text-[#C10007] text-[12px] font-dm-sans">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#2D2D2D] font-dm-sans-500 text-[12px] font-medium">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@johnsstores.com"
                disabled={isLoading}
                className="h-[46px] px-4 rounded-[12px] border-[1.5px] border-[#D1D5DC] bg-white text-[#2D2D2D] text-[14px] placeholder:text-[#B0B7C3] font-dm-sans outline-none focus:border-[#032817] transition-all disabled:opacity-50"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#2D2D2D] font-dm-sans-500 text-[12px] font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="h-[46px] px-4 pr-11 rounded-[12px] border-[1.5px] border-[#D1D5DC] bg-white text-[#2D2D2D] text-[14px] placeholder:text-[#B0B7C3] font-dm-sans outline-none focus:border-[#032817] transition-all w-full disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#B0B7C3] hover:text-[#6B6B6B] transition-colors"
                >
                  {showPassword ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="h-[46px] rounded-[12px] bg-[#032817] text-white font-semibold text-[14px] font-clash-grotesk disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#042e1e] transition-all mt-2 flex items-center justify-center gap-2 shadow-[0_2px_10px_rgba(3,40,23,0.12)]"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        <p className="text-[#B0B7C3] font-dm-sans text-[11px] mt-5 text-center">
          © 2026 John's Enterprise Admin Dashboard
        </p>
      </div>
    </div>
  );
};

export default Login;
