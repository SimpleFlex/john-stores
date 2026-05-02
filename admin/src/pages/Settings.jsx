import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { updatePassword } from "../services/api.service.js";

const Settings = () => {
  const { admin, logout } = useAuth();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters.",
      });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });
    try {
      await updatePassword(currentPassword, newPassword);
      setMessage({ type: "success", text: "Password updated successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update password.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col">
      {/* body */}
      <div className="flex flex-col justify-end items-center w-full pt-[25px] pb-[14px] px-[15px] gap-5 rounded-[25px] border border-[rgba(107,107,107,0.15)] bg-white">
        {/* ── Admin Profile ────────────────────────────────────────── */}
        <div className="flex flex-col items-start gap-4 self-stretch">
          <p className="text-[#2D2D2D] font-medium text-base leading-[18px] font-dm-sans-500">
            Admin Profile
          </p>

          <div className="flex flex-col w-full items-start gap-5">
            <div className="flex w-full justify-between items-center">
              <div className="flex items-center gap-2">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-[#032817] flex items-center justify-center shrink-0">
                  <p className="text-white font-clash-grotesk font-medium text-lg">
                    {admin?.name?.charAt(0)?.toUpperCase() || "A"}
                  </p>
                </div>

                <div className="flex flex-col gap-0.5">
                  <p className="text-[#2D2D2D] font-semibold text-base leading-[25px] tracking-[-0.5px] font-dm-sans-700">
                    {admin?.name || "Admin"}
                  </p>
                  <p className="text-[#6B6B6B] font-medium text-xs leading-[25px] tracking-[-0.5px] font-dm-sans-500">
                    {admin?.email || "—"}
                  </p>
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-[6px] text-[10px] font-medium w-fit ${
                      admin?.role === "superadmin"
                        ? "bg-[#DCFCE7] text-[#008236]"
                        : "bg-[#F2EEC1] text-[#8B7200]"
                    }`}
                  >
                    {admin?.role || "admin"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="flex justify-center items-center px-4 h-[40px] gap-2 rounded-[10px] bg-[rgba(227,73,78,0.10)] cursor-pointer"
              >
                <p className="text-[#E3494E] font-semibold text-sm leading-[25px] tracking-[-0.5px] font-dm-sans-700">
                  {showPasswordForm ? "Cancel" : "Change Password"}
                </p>
                {!showPasswordForm && <img src="/tiny-write.svg" alt="" />}
              </button>
            </div>

            {/* ── Password Update Form ─────────────────────────────── */}
            {showPasswordForm && (
              <form
                onSubmit={handleUpdatePassword}
                className="flex flex-col w-full max-w-md gap-4 p-5 rounded-[18px] border border-[rgba(107,107,107,0.25)] bg-[#FAFAFA]"
              >
                <p className="text-[#2D2D2D] font-medium text-base font-clash-grotesk">
                  Update Password
                </p>

                {message.text && (
                  <div
                    className={`px-4 py-3 rounded-[10px] ${
                      message.type === "success"
                        ? "bg-[#DCFCE7] border border-[#BBF7D0]"
                        : "bg-[#FFF0F0] border border-[#FFD0D0]"
                    }`}
                  >
                    <p
                      className={`text-sm font-dm-sans ${message.type === "success" ? "text-[#008236]" : "text-[#C10007]"}`}
                    >
                      {message.text}
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-[#2D2D2D] font-dm-sans-500 text-sm font-medium">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-[50px] px-5 rounded-[14px] border-[1.5px] border-[#D1D5DC] bg-white outline-none focus:border-[#032817] transition-colors font-dm-sans text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[#2D2D2D] font-dm-sans-500 text-sm font-medium">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-[50px] px-5 rounded-[14px] border-[1.5px] border-[#D1D5DC] bg-white outline-none focus:border-[#032817] transition-colors font-dm-sans text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[#2D2D2D] font-dm-sans-500 text-sm font-medium">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-[50px] px-5 rounded-[14px] border-[1.5px] border-[#D1D5DC] bg-white outline-none focus:border-[#032817] transition-colors font-dm-sans text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex justify-center items-center h-[50px] rounded-[14px] bg-[#032817] text-white font-clash-grotesk font-medium text-sm disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ── Divider ──────────────────────────────────────────────── */}
        <div className="w-full h-[1px] bg-[#D1D5DC]" />

        {/* ── Logout ───────────────────────────────────────────────── */}
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <p className="text-[#2D2D2D] font-medium text-base font-dm-sans-500">
              Sign Out
            </p>
            <p className="text-[#717182] font-dm-sans text-sm">
              Sign out of your admin account
            </p>
          </div>
          <button
            onClick={logout}
            className="flex justify-center items-center px-6 h-[40px] rounded-[10px] bg-[#FFF0F0] border border-[#FFD0D0] cursor-pointer"
          >
            <p className="text-[#C10007] font-medium text-sm font-dm-sans-500">
              Sign Out
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
