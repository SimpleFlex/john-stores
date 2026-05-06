import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import {
  updatePassword,
  updateProfile,
  updateEmail,
} from "../services/api.service.js";

const Settings = () => {
  const { admin, logout } = useAuth();
  const fileInputRef = useRef(null);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [adminName, setAdminName] = useState(admin?.name || "");
  const [whatsappNumber, setWhatsappNumber] = useState(
    admin?.whatsappNumber || "",
  );
  const [currency, setCurrency] = useState(admin?.currency || "₦");
  const [avatar, setAvatar] = useState(admin?.avatar || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });

  // Email change state
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [emailMessage, setEmailMessage] = useState({ type: "", text: "" });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleUpdateProfile = async () => {
    setIsSavingProfile(true);
    setProfileMessage({ type: "", text: "" });
    try {
      const fd = new FormData();
      fd.append("name", adminName.trim());
      fd.append("whatsappNumber", whatsappNumber);
      fd.append("currency", currency);
      if (avatarFile) fd.append("avatar", avatarFile);
      const res = await updateProfile(fd);
      localStorage.setItem("adminData", JSON.stringify(res.admin));
      window.location.reload();
    } catch (err) {
      console.error("Profile update error:", err);
      setProfileMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          err.message ||
          "Failed to update profile.",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

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

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    if (!newEmail.trim() || !emailPassword.trim()) {
      setEmailMessage({ type: "error", text: "All fields are required." });
      return;
    }
    setIsUpdatingEmail(true);
    setEmailMessage({ type: "", text: "" });
    try {
      await updateEmail(newEmail, emailPassword);
      setEmailMessage({
        type: "success",
        text: "Email updated successfully! Please log in again.",
      });
      setNewEmail("");
      setEmailPassword("");
      setTimeout(() => {
        setShowEmailForm(false);
        logout();
      }, 2000);
    } catch (err) {
      setEmailMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update email.",
      });
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* ── CARD 1: Admin Profile + Settings ──────────────────────── */}
      <div className="flex flex-col w-full rounded-[20px] border border-[rgba(107,107,107,0.15)] bg-white overflow-hidden">
        {/* Admin Profile row */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-[rgba(107,107,107,0.10)]">
          <div className="flex items-center gap-3">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-[52px] h-[52px] rounded-full bg-[#032817] flex items-center justify-center shrink-0 overflow-hidden cursor-pointer relative group"
            >
              {avatarPreview || avatar ? (
                <img
                  src={avatarPreview || avatar}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <p className="text-white font-clash-grotesk font-medium text-xl">
                  {adminName?.charAt(0)?.toUpperCase() ||
                    admin?.name?.charAt(0)?.toUpperCase() ||
                    "A"}
                </p>
              )}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M11 2.5a1.5 1.5 0 012.121 2.121L5.5 12.243l-3 .757.757-3L11 2.5z"
                    stroke="white"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />

            <div className="flex flex-col gap-0.5">
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="text-[#2D2D2D] font-semibold text-sm leading-[20px] tracking-[-0.3px] font-dm-sans-700 bg-transparent border-b border-[#D1D5DC] focus:border-[#032817] outline-none w-[200px] transition-colors"
                placeholder="Enter name"
              />
              <p className="text-[#6B6B6B] font-medium text-xs leading-[18px] tracking-[-0.3px] font-dm-sans-500">
                {admin?.email || "—"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowPasswordForm((p) => !p)}
            className="flex items-center gap-1.5 px-4 h-[36px] rounded-[10px] bg-[rgba(227,73,78,0.08)] hover:bg-[rgba(227,73,78,0.14)] transition-colors cursor-pointer"
          >
            <p className="text-[#E3494E] font-semibold text-sm font-dm-sans-700">
              {showPasswordForm ? "Cancel" : "Edit"}
            </p>
            {!showPasswordForm && (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M9.5 2a1.5 1.5 0 012.121 2.121L4.5 11.243l-2.5.757.757-2.5L9.5 2z"
                  stroke="#E3494E"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Password form */}
        {showPasswordForm && (
          <form
            onSubmit={handleUpdatePassword}
            className="flex flex-col gap-4 px-5 py-5 bg-[#FAFAFA] border-b border-[rgba(107,107,107,0.10)]"
          >
            <p className="text-[#2D2D2D] font-medium text-sm font-clash-grotesk">
              Update Password
            </p>

            {message.text && (
              <div
                className={`px-4 py-3 rounded-[10px] ${message.type === "success" ? "bg-[#DCFCE7] border border-[#BBF7D0]" : "bg-[#FFF0F0] border border-[#FFD0D0]"}`}
              >
                <p
                  className={`text-sm font-dm-sans ${message.type === "success" ? "text-[#008236]" : "text-[#C10007]"}`}
                >
                  {message.text}
                </p>
              </div>
            )}

            {[
              {
                label: "Current Password",
                value: currentPassword,
                setter: setCurrentPassword,
              },
              {
                label: "New Password",
                value: newPassword,
                setter: setNewPassword,
              },
              {
                label: "Confirm Password",
                value: confirmPassword,
                setter: setConfirmPassword,
              },
            ].map(({ label, value, setter }) => (
              <div key={label} className="flex flex-col gap-1.5">
                <label className="text-[#2D2D2D] font-medium text-sm font-dm-sans-500">
                  {label}
                </label>
                <input
                  type="password"
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-[48px] px-5 rounded-[12px] border-[1.5px] border-[#D1D5DC] bg-white outline-none focus:border-[#032817] transition-colors font-dm-sans text-sm"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={isLoading}
              className="flex justify-center items-center h-[48px] rounded-[12px] bg-[#032817] text-white font-medium text-sm font-clash-grotesk disabled:opacity-60 cursor-pointer hover:bg-[#042e1e] transition-colors"
            >
              {isLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}

        {/* Email Change Form */}
        {showEmailForm && (
          <form
            onSubmit={handleUpdateEmail}
            className="flex flex-col gap-4 px-5 py-5 bg-[#FAFAFA] border-b border-[rgba(107,107,107,0.10)]"
          >
            <p className="text-[#2D2D2D] font-medium text-sm font-clash-grotesk">
              Change Email Address
            </p>

            {emailMessage.text && (
              <div
                className={`px-4 py-3 rounded-[10px] ${emailMessage.type === "success" ? "bg-[#DCFCE7] border border-[#BBF7D0]" : "bg-[#FFF0F0] border border-[#FFD0D0]"}`}
              >
                <p
                  className={`text-sm font-dm-sans ${emailMessage.type === "success" ? "text-[#008236]" : "text-[#C10007]"}`}
                >
                  {emailMessage.text}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[#2D2D2D] font-medium text-sm font-dm-sans-500">
                New Email
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter new email address"
                disabled={isUpdatingEmail}
                className="w-full h-[48px] px-5 rounded-[12px] border-[1.5px] border-[#D1D5DC] bg-white outline-none focus:border-[#032817] transition-colors font-dm-sans text-sm disabled:opacity-50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[#2D2D2D] font-medium text-sm font-dm-sans-500">
                Confirm Password
              </label>
              <input
                type="password"
                value={emailPassword}
                onChange={(e) => setEmailPassword(e.target.value)}
                placeholder="Enter current password"
                disabled={isUpdatingEmail}
                className="w-full h-[48px] px-5 rounded-[12px] border-[1.5px] border-[#D1D5DC] bg-white outline-none focus:border-[#032817] transition-colors font-dm-sans text-sm disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdatingEmail}
              className="flex justify-center items-center h-[48px] rounded-[12px] bg-[#032817] text-white font-medium text-sm font-clash-grotesk disabled:opacity-60 cursor-pointer hover:bg-[#042e1e] transition-colors"
            >
              {isUpdatingEmail ? "Updating..." : "Update Email"}
            </button>
          </form>
        )}

        {/* Profile message */}
        {profileMessage.text && (
          <div
            className={`mx-5 my-3 px-4 py-3 rounded-[12px] ${profileMessage.type === "success" ? "bg-[#DCFCE7] border border-[#BBF7D0]" : "bg-[#FFF0F0] border border-[#FFD0D0]"}`}
          >
            <p
              className={`text-sm font-dm-sans ${profileMessage.type === "success" ? "text-[#008236]" : "text-[#C10007]"}`}
            >
              {profileMessage.text}
            </p>
          </div>
        )}

        {/* Admin Email */}
        <div className="flex flex-col gap-1.5 px-5 py-4 border-b border-[rgba(107,107,107,0.10)]">
          <p className="text-[#2D2D2D] font-medium text-sm font-dm-sans-500">
            Admin Email
          </p>
          <div
            className="w-full h-[50px] px-5 rounded-[14px] border-[1.5px] border-[#D1D5DC] bg-white flex items-center cursor-pointer hover:border-[#032817] transition-colors"
            onClick={() => setShowEmailForm(true)}
          >
            <p className="text-[#6B6B6B] font-dm-sans text-sm truncate">
              {admin?.email || "—"}
            </p>
          </div>
        </div>

        {/* WhatsApp Business Number */}
        <div className="flex flex-col gap-1.5 px-5 py-4 border-b border-[rgba(107,107,107,0.10)]">
          <p className="text-[#2D2D2D] font-medium text-sm font-dm-sans-500">
            WhatsApp Business Number
          </p>
          <input
            type="text"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            placeholder="+234 903 963 2833"
            className="w-full h-[50px] px-5 rounded-[14px] border-[1.5px] border-[#D1D5DC] bg-white outline-none focus:border-[#032817] transition-colors font-dm-sans text-sm"
          />
          <p className="text-[#717182] font-dm-sans text-xs leading-[18px]">
            This number will be used for receiving orders and customer
            communications
          </p>
        </div>

        {/* Currency Symbol */}
        <div className="flex flex-col gap-1.5 px-5 py-4">
          <p className="text-[#2D2D2D] font-medium text-sm font-dm-sans-500">
            Currency Symbol
          </p>
          <div className="relative w-full">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full h-[50px] px-5 pr-[40px] rounded-[14px] border-[1.5px] border-[#D1D5DC] bg-white outline-none focus:border-[#032817] transition-colors font-dm-sans text-sm cursor-pointer appearance-none"
            >
              <option value="₦">₦ - Nigerian Naira</option>
              <option value="$">$ - US Dollar</option>
              <option value="€">€ - Euro</option>
              <option value="£">£ - British Pound</option>
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path
                  d="M1 1.5L6 6.5L11 1.5"
                  stroke="#717182"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ── CARD 2: Sub Admin Management ──────────────────────────── */}
      <div className="relative flex flex-col w-full rounded-[20px] border border-[rgba(107,107,107,0.15)] bg-white px-5 py-5 gap-3">
        <p className="text-[#2D2D2D] font-medium text-base font-dm-sans-500">
          Sub Admin Management
        </p>
        <p className="text-[#717182] font-dm-sans text-sm leading-[22px]">
          Add team members with limited access to help manage your dashboard
        </p>
        <button
          disabled
          className="flex justify-center items-center px-5 h-[42px] rounded-[12px] border border-[#D1D5DC] bg-white text-[#9CA3AF] font-medium text-sm font-clash-grotesk cursor-not-allowed w-fit"
        >
          Add Sub-Admin (Coming Soon)
        </button>

        <div className="flex justify-end mt-2">
          <button
            onClick={handleUpdateProfile}
            disabled={isSavingProfile}
            className="flex items-center gap-2 px-5 h-[44px] rounded-[12px] bg-[#16CB5E] hover:bg-[#12b554] transition-colors text-white font-medium text-sm font-clash-grotesk disabled:opacity-60 cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M13 14H3a1 1 0 01-1-1V3a1 1 0 011-1h8l3 3v8a1 1 0 01-1 1z"
                stroke="white"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11 14v-5H5v5M5 2v4h5"
                stroke="white"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {isSavingProfile ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>

      {/* ── CARD 3: Danger Zone ───────────────────────────────────── */}
      <div className="flex flex-col w-full rounded-[20px] border border-[#FFD0D0] bg-[#FFF8F8] px-5 py-5 gap-3">
        <p className="text-[#C10007] font-medium text-base font-dm-sans-500">
          Danger Zone
        </p>
        <p className="text-[#717182] font-dm-sans text-sm leading-[22px]">
          Irreversible actions that affect your entire dashboard
        </p>
        <button
          disabled
          className="flex justify-center items-center px-5 h-[42px] rounded-[12px] bg-[#D4183D] text-white font-medium text-sm font-clash-grotesk cursor-not-allowed w-fit opacity-80"
        >
          Reset Dashboard Data
        </button>
      </div>

      {/* ── Sign Out ──────────────────────────────────────────────── */}
      <div className="flex w-full items-center justify-between px-5 py-4 rounded-[20px] border border-[rgba(107,107,107,0.15)] bg-white">
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
          className="flex justify-center items-center px-5 h-[42px] rounded-[12px] bg-[#FFF0F0] border border-[#FFD0D0] cursor-pointer hover:bg-[#FFE2E2] transition-colors shrink-0 ml-4"
        >
          <p className="text-[#C10007] font-medium text-sm font-dm-sans-500 whitespace-nowrap">
            Sign Out
          </p>
        </button>
      </div>
    </div>
  );
};

export default Settings;
