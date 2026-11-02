import { useEffect, useState } from "react";
import {
  FiGlobe,
  FiSave,
  FiEye,
  FiLayout,
  FiPhone,
  FiInfo,
  FiExternalLink,
  FiCheck
} from "react-icons/fi";
import {
  getWebsiteContent,
  updateWebsiteContent
} from "../../services/adminService.js";
import { useToast } from "../../context/ToastContext.jsx";
import Loader from "../../components/common/Loader.jsx";

export default function WebsiteContent() {
  const toast = useToast();
  const [activeSection, setActiveSection] = useState("hero"); // "hero" | "about" | "contact" | "footer"
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    getWebsiteContent()
      .then((res) => {
        setContent(res.data?.content || {});
      })
      .catch((err) => {
        console.error("CMS load error:", err);
        setContent({
          hero: {
            headline: "Accelerate Your Tech Career With Real-World Projects",
            subheadline: "Master in-demand full stack development, cloud computing, and AI engineering with live mentorship and guaranteed certifications.",
            badge: "✨ NEXT BATCH ENROLLMENTS OPEN",
            primaryButtonText: "Explore Courses",
            primaryButtonUrl: "/courses",
            secondaryButtonText: "Talk to Advisor",
            secondaryButtonUrl: "/contact"
          },
          about: {
            title: "Pioneering Practical Technology Education",
            description: "TechDea delivers high-impact technical curriculum developed in partnership with senior engineers from top technology enterprises.",
            studentsTrained: "12,500+",
            placementRate: "94.8%",
            hiringPartners: "150+"
          },
          contact: {
            supportEmail: "support@techdea.in",
            phone: "+91 98765 43210",
            address: "TechDea Tower, Cyber City, Phase 2, Bangalore, India"
          },
          footer: {
            tagline: "Empowering developers to build the future through industry-grade training and project-based mastery.",
            copyright: "© 2026 TechDea Learning Platform. All rights reserved."
          }
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSaveSection = async (sectionKey) => {
    setSaving(true);
    try {
      await updateWebsiteContent(sectionKey, content[sectionKey]);
      toast.success(`${sectionKey.toUpperCase()} content saved & published live!`);
    } catch (err) {
      toast.error("Failed to update website content");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !content) {
    return (
      <div style={{ padding: "60px 0", display: "grid", placeItems: "center" }}>
        <Loader />
      </div>
    );
  }

  const hero = content.hero || {};
  const about = content.about || {};
  const contact = content.contact || {};
  const footer = content.footer || {};

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <div className="adm-page-eyebrow">CONTENT MANAGEMENT SYSTEM</div>
          <h1 className="adm-page-title">Website Content Management</h1>
          <p className="adm-page-desc">
            Directly customize the public TechDea website copy, hero banners, about section stats, and footer details.
          </p>
        </div>

        <div className="adm-page-actions">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="adm-top-btn"
          >
            <FiExternalLink /> View Public Website
          </a>
        </div>
      </div>

      {/* CMS Navigation Tabs */}
      <div className="adm-step-tabs" style={{ marginBottom: 24 }}>
        {[
          { id: "hero", label: "Hero Banner & Header", icon: FiLayout },
          { id: "about", label: "About Us & Key Metrics", icon: FiInfo },
          { id: "contact", label: "Contact & Headquarters", icon: FiPhone },
          { id: "footer", label: "Footer & Legal", icon: FiGlobe }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              className={`adm-step-tab ${activeSection === tab.id ? "active" : ""}`}
              onClick={() => setActiveSection(tab.id)}
            >
              <Icon /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: HERO SECTION */}
      {activeSection === "hero" && (
        <div className="adm-card">
          <div className="adm-card-header">
            <div>
              <h2 className="adm-card-title">Homepage Hero Banner</h2>
              <div className="adm-card-subtitle">Headline, subtitle, and call-to-action buttons</div>
            </div>
            <button
              type="button"
              className="adm-top-btn adm-primary-btn"
              onClick={() => handleSaveSection("hero")}
              disabled={saving}
            >
              <FiSave /> {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          <div className="adm-form-row">
            <label className="adm-label">Announcement Top Badge Text</label>
            <input
              type="text"
              className="adm-input"
              value={hero.badge || ""}
              onChange={(e) =>
                setContent({ ...content, hero: { ...hero, badge: e.target.value } })
              }
              placeholder="e.g. ✨ NEXT BATCH ENROLLMENTS OPEN"
            />
          </div>

          <div className="adm-form-row">
            <label className="adm-label">Primary Headline</label>
            <input
              type="text"
              className="adm-input"
              value={hero.headline || ""}
              onChange={(e) =>
                setContent({ ...content, hero: { ...hero, headline: e.target.value } })
              }
            />
          </div>

          <div className="adm-form-row">
            <label className="adm-label">Subheadline Paragraph</label>
            <textarea
              className="adm-textarea"
              rows={3}
              value={hero.subheadline || ""}
              onChange={(e) =>
                setContent({ ...content, hero: { ...hero, subheadline: e.target.value } })
              }
            />
          </div>

          <div className="adm-form-grid-2 adm-form-row">
            <div>
              <label className="adm-label">Primary CTA Button Text</label>
              <input
                type="text"
                className="adm-input"
                value={hero.primaryButtonText || "Explore Courses"}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...hero, primaryButtonText: e.target.value }
                  })
                }
              />
            </div>
            <div>
              <label className="adm-label">Primary CTA Link URL</label>
              <input
                type="text"
                className="adm-input"
                value={hero.primaryButtonUrl || "/courses"}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...hero, primaryButtonUrl: e.target.value }
                  })
                }
              />
            </div>
          </div>

          <div className="adm-form-grid-2 adm-form-row">
            <div>
              <label className="adm-label">Secondary CTA Button Text</label>
              <input
                type="text"
                className="adm-input"
                value={hero.secondaryButtonText || "Talk to Advisor"}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...hero, secondaryButtonText: e.target.value }
                  })
                }
              />
            </div>
            <div>
              <label className="adm-label">Secondary CTA Link URL</label>
              <input
                type="text"
                className="adm-input"
                value={hero.secondaryButtonUrl || "/contact"}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...hero, secondaryButtonUrl: e.target.value }
                  })
                }
              />
            </div>
          </div>

          {/* Live Preview Box */}
          <div
            style={{
              marginTop: 20,
              padding: "24px",
              background: "#FAF9FF",
              borderRadius: 14,
              border: "1px dashed var(--adm-primary)"
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--adm-primary)", textTransform: "uppercase", marginBottom: 8 }}>
              VISUAL HERO PREVIEW
            </div>
            <div style={{ display: "inline-block", background: "var(--adm-primary-soft)", color: "var(--adm-primary)", padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, marginBottom: 8 }}>
              {hero.badge}
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 850, margin: "0 0 8px", color: "var(--adm-text-main)" }}>
              {hero.headline}
            </h2>
            <p style={{ fontSize: 13, color: "var(--adm-text-muted)", maxWidth: 640, margin: "0 0 16px" }}>
              {hero.subheadline}
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <span className="btn btn-primary" style={{ padding: "8px 16px", fontSize: 13 }}>
                {hero.primaryButtonText}
              </span>
              <span className="btn btn-ghost" style={{ padding: "8px 16px", fontSize: 13 }}>
                {hero.secondaryButtonText}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ABOUT US */}
      {activeSection === "about" && (
        <div className="adm-card">
          <div className="adm-card-header">
            <div>
              <h2 className="adm-card-title">About TechDea Platform</h2>
              <div className="adm-card-subtitle">Organizational mission statement and published statistics</div>
            </div>
            <button
              type="button"
              className="adm-top-btn adm-primary-btn"
              onClick={() => handleSaveSection("about")}
              disabled={saving}
            >
              <FiSave /> {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          <div className="adm-form-row">
            <label className="adm-label">Section Title</label>
            <input
              type="text"
              className="adm-input"
              value={about.title || ""}
              onChange={(e) =>
                setContent({ ...content, about: { ...about, title: e.target.value } })
              }
            />
          </div>

          <div className="adm-form-row">
            <label className="adm-label">About Narrative</label>
            <textarea
              className="adm-textarea"
              rows={4}
              value={about.description || ""}
              onChange={(e) =>
                setContent({ ...content, about: { ...about, description: e.target.value } })
              }
            />
          </div>

          <div className="adm-form-grid-3 adm-form-row">
            <div>
              <label className="adm-label">Students Trained Counter</label>
              <input
                type="text"
                className="adm-input"
                value={about.studentsTrained || "12,500+"}
                onChange={(e) =>
                  setContent({
                    ...content,
                    about: { ...about, studentsTrained: e.target.value }
                  })
                }
              />
            </div>
            <div>
              <label className="adm-label">Placement / Success Rate</label>
              <input
                type="text"
                className="adm-input"
                value={about.placementRate || "94.8%"}
                onChange={(e) =>
                  setContent({
                    ...content,
                    about: { ...about, placementRate: e.target.value }
                  })
                }
              />
            </div>
            <div>
              <label className="adm-label">Enterprise Hiring Partners</label>
              <input
                type="text"
                className="adm-input"
                value={about.hiringPartners || "150+"}
                onChange={(e) =>
                  setContent({
                    ...content,
                    about: { ...about, hiringPartners: e.target.value }
                  })
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CONTACT */}
      {activeSection === "contact" && (
        <div className="adm-card">
          <div className="adm-card-header">
            <div>
              <h2 className="adm-card-title">Contact & Headquarters Information</h2>
              <div className="adm-card-subtitle">Public support details and office address</div>
            </div>
            <button
              type="button"
              className="adm-top-btn adm-primary-btn"
              onClick={() => handleSaveSection("contact")}
              disabled={saving}
            >
              <FiSave /> {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          <div className="adm-form-grid-2 adm-form-row">
            <div>
              <label className="adm-label">Official Support Email</label>
              <input
                type="email"
                className="adm-input"
                value={contact.supportEmail || ""}
                onChange={(e) =>
                  setContent({ ...content, contact: { ...contact, supportEmail: e.target.value } })
                }
              />
            </div>
            <div>
              <label className="adm-label">Helpdesk Phone Number</label>
              <input
                type="text"
                className="adm-input"
                value={contact.phone || ""}
                onChange={(e) =>
                  setContent({ ...content, contact: { ...contact, phone: e.target.value } })
                }
              />
            </div>
          </div>

          <div className="adm-form-row">
            <label className="adm-label">Headquarters Physical Address</label>
            <input
              type="text"
              className="adm-input"
              value={contact.address || ""}
              onChange={(e) =>
                setContent({ ...content, contact: { ...contact, address: e.target.value } })
              }
            />
          </div>
        </div>
      )}

      {/* TAB 4: FOOTER */}
      {activeSection === "footer" && (
        <div className="adm-card">
          <div className="adm-card-header">
            <div>
              <h2 className="adm-card-title">Footer & Copyright Notices</h2>
              <div className="adm-card-subtitle">Brand mission snippet and legal credits</div>
            </div>
            <button
              type="button"
              className="adm-top-btn adm-primary-btn"
              onClick={() => handleSaveSection("footer")}
              disabled={saving}
            >
              <FiSave /> {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          <div className="adm-form-row">
            <label className="adm-label">Footer Brand Tagline</label>
            <input
              type="text"
              className="adm-input"
              value={footer.tagline || ""}
              onChange={(e) =>
                setContent({ ...content, footer: { ...footer, tagline: e.target.value } })
              }
            />
          </div>

          <div className="adm-form-row">
            <label className="adm-label">Copyright Notice</label>
            <input
              type="text"
              className="adm-input"
              value={footer.copyright || ""}
              onChange={(e) =>
                setContent({ ...content, footer: { ...footer, copyright: e.target.value } })
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}

