import { useEffect, useState } from "react";
import {
  FiSettings,
  FiSave,
  FiDollarSign,
  FiShield,
  FiBell,
  FiServer,
  FiCheck
} from "react-icons/fi";
import { getSettings, updateSettings } from "../../services/adminService.js";
import { useToast } from "../../context/ToastContext.jsx";
import Loader from "../../components/common/Loader.jsx";

export default function Settings() {
  const toast = useToast();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    getSettings()
      .then((res) => {
        setSettings(res.data?.settings || {});
      })
      .catch((err) => {
        console.error("Settings load error:", err);
        setSettings({
          siteName: "TechDea Learning Platform",
          tagline: "Master Modern Technology & Engineering",
          supportEmail: "support@techdea.in",
          supportPhone: "+91 98765 43210",
          currencySymbol: "₹",
          currencyCode: "INR",
          paymentGateway: {
            provider: "Razorpay",
            testMode: true,
            keyId: "rzp_test_sampleKey123"
          },
          features: {
            autoIssueCertificates: true,
            enableStudentDiscussion: true,
            maintenanceMode: false
          }
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings(settings);
      toast.success("Platform settings saved successfully!");
    } catch (err) {
      toast.error("Failed to save platform settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div style={{ padding: "60px 0", display: "grid", placeItems: "center" }}>
        <Loader />
      </div>
    );
  }

  const features = settings.features || {
    autoIssueCertificates: true,
    enableStudentDiscussion: true,
    maintenanceMode: false
  };

  const paymentGateway = settings.paymentGateway || {
    provider: "Razorpay",
    testMode: true,
    keyId: "rzp_test_sampleKey123"
  };

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <div className="adm-page-eyebrow">SYSTEM PREFERENCES</div>
          <h1 className="adm-page-title">General Platform Settings</h1>
          <p className="adm-page-desc">
            Configure global platform identity, currency symbols, payment gateway modes, and automated credential issuance.
          </p>
        </div>

        <div className="adm-page-actions">
          <button
            type="button"
            className="adm-top-btn adm-primary-btn"
            onClick={handleSave}
            disabled={saving}
          >
            <FiSave /> {saving ? "Saving Changes..." : "Save Settings"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ display: "grid", gap: 24 }}>
        {/* Card 1: Platform Identity */}
        <div className="adm-card">
          <div className="adm-card-header">
            <div>
              <h2 className="adm-card-title">
                <FiSettings style={{ color: "var(--adm-primary)" }} /> Platform Branding & Identity
              </h2>
              <div className="adm-card-subtitle">Public metadata, portal name, and currency defaults</div>
            </div>
          </div>

          <div className="adm-form-grid-2 adm-form-row">
            <div>
              <label className="adm-label">Platform Name</label>
              <input
                type="text"
                className="adm-input"
                value={settings.siteName || ""}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              />
            </div>
            <div>
              <label className="adm-label">Brand Tagline</label>
              <input
                type="text"
                className="adm-input"
                value={settings.tagline || ""}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              />
            </div>
          </div>

          <div className="adm-form-grid-3 adm-form-row">
            <div>
              <label className="adm-label">Support Email</label>
              <input
                type="email"
                className="adm-input"
                value={settings.supportEmail || ""}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              />
            </div>
            <div>
              <label className="adm-label">Support Phone</label>
              <input
                type="text"
                className="adm-input"
                value={settings.supportPhone || ""}
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
              />
            </div>
            <div>
              <label className="adm-label">Currency Symbol</label>
              <input
                type="text"
                className="adm-input"
                value={settings.currencySymbol || "₹"}
                onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Payment Gateway */}
        <div className="adm-card">
          <div className="adm-card-header">
            <div>
              <h2 className="adm-card-title">
                <FiDollarSign style={{ color: "#10B981" }} /> Payment Gateway Configuration
              </h2>
              <div className="adm-card-subtitle">Razorpay / UPI integration settings</div>
            </div>
          </div>

          <div className="adm-form-grid-2 adm-form-row">
            <div>
              <label className="adm-label">Payment Gateway Provider</label>
              <input
                type="text"
                className="adm-input"
                value={paymentGateway.provider || "Razorpay"}
                readOnly
              />
            </div>

            <div>
              <label className="adm-label">Razorpay Public Key ID</label>
              <input
                type="text"
                className="adm-input"
                value={paymentGateway.keyId || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    paymentGateway: { ...paymentGateway, keyId: e.target.value }
                  })
                }
              />
            </div>
          </div>

          <label className="adm-checkbox-label">
            <input
              type="checkbox"
              checked={paymentGateway.testMode}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  paymentGateway: { ...paymentGateway, testMode: e.target.checked }
                })
              }
            />
            <span>Enable Sandbox / Test Mode (Simulate transactions without charging cards)</span>
          </label>
        </div>

        {/* Card 3: LMS Automation & Features */}
        <div className="adm-card">
          <div className="adm-card-header">
            <div>
              <h2 className="adm-card-title">
                <FiServer style={{ color: "#F59E0B" }} /> LMS Automation & Platform Rules
              </h2>
              <div className="adm-card-subtitle">Course completion rules and system triggers</div>
            </div>
          </div>

          <div style={{ display: "grid", gap: 14 }}>
            <label className="adm-checkbox-label">
              <input
                type="checkbox"
                checked={features.autoIssueCertificates}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    features: { ...features, autoIssueCertificates: e.target.checked }
                  })
                }
              />
              <span>
                <strong>Automatically issue verified certificate upon 100% curriculum completion</strong>
              </span>
            </label>

            <label className="adm-checkbox-label">
              <input
                type="checkbox"
                checked={features.enableStudentDiscussion}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    features: { ...features, enableStudentDiscussion: e.target.checked }
                  })
                }
              />
              <span>
                <strong>Enable Student Peer Discussion Forum on lesson pages</strong>
              </span>
            </label>

            <label className="adm-checkbox-label">
              <input
                type="checkbox"
                checked={features.maintenanceMode}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    features: { ...features, maintenanceMode: e.target.checked }
                  })
                }
              />
              <span style={{ color: features.maintenanceMode ? "#EF4444" : undefined }}>
                <strong>Maintenance Mode (Block public enrollment checkout during server updates)</strong>
              </span>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}
