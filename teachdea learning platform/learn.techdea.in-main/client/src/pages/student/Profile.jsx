import { useState } from "react";
import { FiUser, FiLock, FiCheckCircle, FiSave } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext.jsx";
import { updateProfile, changePassword } from "../../services/authService.js";

export default function Profile() {
  const { user } = useAuth();

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    bio: user?.bio || ""
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileAlert, setProfileAlert] = useState(null);
  const [passwordAlert, setPasswordAlert] = useState(null);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileAlert(null);

    try {
      const res = await updateProfile(profileForm);
      setProfileAlert({
        type: "success",
        text: res.data.message || "Profile updated successfully!"
      });
      // Update cached session
      localStorage.setItem("techdea_user", JSON.stringify(res.data.user));
    } catch (err) {
      setProfileAlert({
        type: "error",
        text: err.response?.data?.message || "Failed to update profile."
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordAlert(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordAlert({ type: "error", text: "New passwords do not match." });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordAlert({ type: "error", text: "New password must be at least 6 characters." });
      return;
    }

    setPasswordLoading(true);

    try {
      const res = await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordAlert({
        type: "success",
        text: res.data.message || "Password changed successfully!"
      });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (err) {
      setPasswordAlert({
        type: "error",
        text: err.response?.data?.message || "Failed to change password."
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div>
      <div className="portal-heading">
        <div>
          <div className="eyebrow">STUDENT ACCOUNT</div>
          <h1>Account Settings & Profile</h1>
          <p>Manage your account credentials and personal information.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 28, alignItems: "start" }}>
        {/* Profile Card & Form */}
        <div style={{ background: "#FFFFFF", border: "1px solid var(--border)", borderRadius: 18, padding: 28, boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid var(--border)" }}>
            <div className="avatar large">{user?.name?.charAt(0)?.toUpperCase()}</div>
            <div>
              <h2 style={{ margin: "0 0 4px", fontSize: 20 }}>{user?.name}</h2>
              <span style={{ color: "var(--muted)", fontSize: 13, display: "block" }}>{user?.email}</span>
              <span className="badge badge-read" style={{ marginTop: 6 }}>
                {user?.role === "admin" ? "Administrator" : "Student"}
              </span>
            </div>
          </div>

          <form className="form-card" onSubmit={handleProfileSubmit}>
            <h3 style={{ margin: "0 0 4px", fontSize: 17 }}>Edit Profile Information</h3>

            {profileAlert && (
              <div className={`alert ${profileAlert.type}`}>
                {profileAlert.type === "success" && <FiCheckCircle style={{ marginRight: 6 }} />}
                {profileAlert.text}
              </div>
            )}

            <label>
              Full Name
              <input
                required
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              />
            </label>

            <label>
              Phone / WhatsApp
              <input
                value={profileForm.phone}
                placeholder="+91 9876543210"
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
              />
            </label>

            <label>
              Bio / Goals
              <textarea
                rows={3}
                placeholder="Share your learning goals or background..."
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
              />
            </label>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={profileLoading}
              style={{ marginTop: 8 }}
            >
              <FiSave /> {profileLoading ? "Saving..." : "Save Profile Changes"}
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div style={{ background: "#FFFFFF", border: "1px solid var(--border)", borderRadius: 18, padding: 28, boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div className="stat-icon" style={{ width: 38, height: 38 }}>
              <FiLock />
            </div>
            <h3 style={{ margin: 0, fontSize: 18 }}>Change Password</h3>
          </div>

          {passwordAlert && (
            <div className={`alert ${passwordAlert.type}`}>
              {passwordAlert.type === "success" && <FiCheckCircle style={{ marginRight: 6 }} />}
              {passwordAlert.text}
            </div>
          )}

          <form className="form-card" onSubmit={handlePasswordSubmit}>
            <label>
              Current Password
              <input
                required
                type="password"
                placeholder="Enter current password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              />
            </label>

            <label>
              New Password
              <input
                required
                type="password"
                placeholder="At least 6 characters"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              />
            </label>

            <label>
              Confirm New Password
              <input
                required
                type="password"
                placeholder="Confirm new password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              />
            </label>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={passwordLoading}
              style={{ marginTop: 8 }}
            >
              <FiLock /> {passwordLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}