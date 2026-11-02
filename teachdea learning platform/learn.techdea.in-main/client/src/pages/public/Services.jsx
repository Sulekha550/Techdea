import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiCode,
  FiMonitor,
  FiCpu,
  FiCloud,
  FiSmartphone,
  FiShield,
  FiBookOpen,
  FiUsers,
  FiLayers,
  FiCheckCircle,
  FiCheck,
  FiZap,
  FiAward,
  FiPhoneCall,
  FiMessageSquare,
  FiStar
} from "react-icons/fi";

export default function Services() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  const services = [
    {
      id: "web-dev",
      category: "software",
      title: "Enterprise Full-Stack & SaaS Platforms",
      badge: "High Demand",
      text: "Architecting cloud-native web applications, distributed SaaS backends, and responsive frontend portals built on React 19, Next.js, and Node.js microservices.",
      icon: <FiCode />,
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=85",
      tags: ["React 19 / Next.js", "Node & Express", "PostgreSQL / Mongo", "AWS Cloud"],
      deliverables: ["Scalable REST & GraphQL APIs", "Role-Based Multi-Tenant Auth", "99.9% Uptime Deployment"]
    },
    {
      id: "ai-solutions",
      category: "ai",
      title: "Generative AI & Autonomous Agent Systems",
      badge: "Cutting-Edge",
      text: "Integrating production-grade LLMs, custom Retrieval-Augmented Generation (RAG) pipelines, semantic vector search, and multi-agent workflow automation.",
      icon: <FiCpu />,
      image:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=85",
      tags: ["RAG Pipelines", "Autonomous Agents", "Vector Embeddings", "PyTorch / OpenAI"],
      deliverables: ["Domain-Tuned LLM Pipelines", "Enterprise Knowledge Search", "Automated Task Bots"]
    },
    {
      id: "mobile-apps",
      category: "software",
      title: "Cross-Platform Mobile App Engineering",
      badge: "iOS & Android",
      text: "High-performance native iOS and Android mobile solutions engineered with React Native and Flutter, featuring offline synchronization and fluid 60fps micro-animations.",
      icon: <FiSmartphone />,
      image:
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=900&q=85",
      tags: ["React Native", "Flutter", "App Store & Play Store", "Offline Sync"],
      deliverables: ["Cross-Platform Codebase", "Push Notifications & Analytics", "Store Deployment Setup"]
    },
    {
      id: "cloud-devops",
      category: "cloud",
      title: "Cloud Infrastructure, DevOps & SRE",
      badge: "Infrastructure",
      text: "Zero-downtime CI/CD deployment pipelines, Docker container orchestration, Kubernetes cluster management, and Infrastructure as Code with Terraform.",
      icon: <FiCloud />,
      image:
        "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=900&q=85",
      tags: ["Docker & Kubernetes", "CI/CD Automation", "Terraform IaC", "AWS / Azure"],
      deliverables: ["Automated Build & Test Pipelines", "Cluster Monitoring & Alerts", "Cloud Cost Optimization"]
    },
    {
      id: "corporate-training",
      category: "training",
      title: "Corporate Bootcamps & Team Upskilling",
      badge: "Accredited",
      text: "Rigorous instructor-led technology programs designed for corporate engineering teams and universities seeking practical mastery of modern cloud, AI, and web stacks.",
      icon: <FiBookOpen />,
      image:
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=85",
      tags: ["Live Masterclasses", "Custom Syllabus", "Verified Diplomas", "Capstone Labs"],
      deliverables: ["Custom Enterprise Tracks", "Pre/Post Skill Assessments", "Direct Mentor Feedback"]
    },
    {
      id: "capstone-projects",
      category: "training",
      title: "Academic Capstone & Final-Year Mentorship",
      badge: "Engineering Students",
      text: "Comprehensive engineering guidance for B.Tech, BCA, MCA, and M.Tech students. From IEEE paper implementation to live demo hosting and defense presentation prep.",
      icon: <FiLayers />,
      image:
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=85",
      tags: ["B.Tech / MCA", "IEEE Implementations", "SRS Documentation", "Live Hosting"],
      deliverables: ["Complete Source Code & Git", "Defense Viva Preparation", "Research Paper Guidance"]
    }
  ];

  const filteredServices =
    activeTab === "all"
      ? services
      : services.filter((s) => s.category === activeTab);

  const workflowSteps = [
    {
      step: "01",
      title: "Discovery & Blueprinting",
      desc: "We analyze your project scope, technical requirements, user journeys, and target timelines to create an engineering blueprint."
    },
    {
      step: "02",
      title: "Agile Architecture & Build",
      desc: "Our senior software architects and mentors build iteratively with clean code, modern frameworks, and weekly progress demonstrations."
    },
    {
      step: "03",
      title: "Rigorous QA & Security",
      desc: "Full automated unit testing, vulnerability assessments, performance audits, and load testing prior to any release."
    },
    {
      step: "04",
      title: "Deploy, Mentor & Handover",
      desc: "Seamless cloud deployment, thorough documentation, complete source code handover, and ongoing support for continuous growth."
    }
  ];

  return (
    <div className="services-luxury-page">
      <style>{`
        .services-luxury-page {
          background: #FAFAFD;
          color: #0F172A;
          min-height: 100vh;
        }

        /* Hero Container - Size calibrated to match Home Hero */
        .srv-hero-section {
          position: relative;
          overflow: hidden;
          padding: 42px 20px 60px;
          background: 
            radial-gradient(ellipse 65% 65% at 0% 45%, rgba(200, 160, 255, 0.42) 0%, rgba(216, 180, 254, 0.16) 48%, transparent 75%),
            radial-gradient(ellipse 65% 65% at 100% 45%, rgba(216, 180, 254, 0.42) 0%, rgba(233, 213, 255, 0.16) 48%, transparent 75%),
            #FFFFFF;
          border-bottom: 1px solid #E2E8F0;
        }

        .srv-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .srv-hero-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          align-items: center;
          gap: 36px;
        }

        .srv-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 999px;
          background: #F3E8FF;
          border: 1px solid #DDD6FE;
          color: #6D28D9;
          font-size: 12.5px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 18px;
          box-shadow: 0 2px 10px rgba(109, 40, 217, 0.08);
        }

        .srv-hero-title {
          font-size: clamp(26px, 2.8vw, 38px);
          font-weight: 800;
          line-height: 1.25;
          letter-spacing: -0.025em;
          color: #0F172A;
          margin: 0 0 16px;
          max-width: 620px;
        }

        .srv-gradient-text {
          color: #6D28D9;
          background: linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 850;
        }

        .srv-hero-desc {
          font-size: 15px;
          line-height: 1.6;
          color: #475569;
          margin: 0 0 24px;
          max-width: 520px;
        }

        .srv-hero-actions {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }

        .srv-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 10px;
          background: #6D28D9;
          color: #FFFFFF !important;
          font-size: 14.5px;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 6px 18px rgba(109, 40, 217, 0.32);
          border: none;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .srv-btn-primary:hover {
          background: #5B21B6;
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(109, 40, 217, 0.45);
        }

        .srv-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 20px;
          border-radius: 999px;
          background: #FFFFFF;
          color: #0F172A;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          border: 1px solid #CBD5E1;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .srv-btn-secondary:hover {
          border-color: #7C3AED;
          color: #7C3AED;
          background: #FDFBFF;
          transform: translateY(-2px);
        }

        /* Hero Stats Row - Exact Home Metrics Strip Style */
        .srv-stats-row {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 12px 20px;
          background: #FFFFFF;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 14px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
          max-width: 560px;
        }

        .srv-stat-item {
          display: flex;
          flex-direction: column;
        }

        .srv-stat-item strong {
          display: block;
          font-size: 17px;
          font-weight: 800;
          color: #0F172A;
          line-height: 1.1;
        }

        .srv-stat-item span {
          font-size: 11px;
          font-weight: 600;
          color: #64748B;
          margin-top: 2px;
          display: block;
        }

        .srv-stat-divider {
          width: 1px;
          height: 24px;
          background: #E2E8F0;
        }

        /* Hero Visual Showcase - Match Home Frame Dimensions */
        .srv-hero-visual {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }

        .srv-visual-frame {
          position: relative;
          width: 100%;
          max-width: 520px;
          height: 440px;
          border-radius: 26px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.16), 0 0 35px rgba(124, 58, 237, 0.12);
          border: 1.5px solid rgba(139, 92, 246, 0.25);
          background: #0F172A;
        }

        .srv-visual-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .srv-visual-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.08) 0%, rgba(15, 23, 42, 0.7) 100%);
        }

        .srv-floating-card {
          position: absolute;
          bottom: 18px;
          left: 18px;
          right: 18px;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(14px);
          border-radius: 16px;
          padding: 14px 18px;
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
        }

        .srv-floating-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }

        .srv-floating-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 800;
          color: #0F172A;
        }

        .srv-status-live {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 9px;
          border-radius: 999px;
          background: #ECFDF5;
          color: #059669;
          font-size: 10.5px;
          font-weight: 800;
        }

        .srv-live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10B981;
        }

        .srv-floating-card p {
          margin: 0;
          font-size: 12px;
          color: #475569;
          line-height: 1.45;
        }

        .srv-badge-floating {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(15, 23, 42, 0.88);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #FFFFFF;
          font-size: 11px;
          font-weight: 750;
          padding: 5px 12px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
        }

        /* Filter Tabs */
        .srv-catalog-section {
          padding: 80px 24px;
        }

        .srv-section-header {
          text-align: center;
          max-width: 720px;
          margin: 0 auto 44px;
        }

        .srv-section-header h2 {
          font-size: clamp(28px, 3.6vw, 42px);
          font-weight: 850;
          color: #0F172A;
          letter-spacing: -1px;
          margin: 12px 0;
        }

        .srv-section-header p {
          font-size: 16px;
          line-height: 1.6;
          color: #64748B;
          margin: 0;
        }

        .srv-filter-tabs {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 48px;
        }

        .srv-filter-btn {
          padding: 9px 18px;
          border-radius: 999px;
          font-size: 13.5px;
          font-weight: 750;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          color: #475569;
        }

        .srv-filter-btn:hover {
          border-color: #C4B5FD;
          color: #7C3AED;
          background: #FDFBFF;
        }

        .srv-filter-btn.active {
          background: #7C3AED;
          color: #FFFFFF;
          border-color: #7C3AED;
          box-shadow: 0 4px 14px rgba(124, 58, 237, 0.3);
        }

        /* Services Grid */
        .srv-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 32px;
        }

        .srv-card {
          background: #FFFFFF;
          border-radius: 20px;
          border: 1px solid rgba(124, 58, 237, 0.12);
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(18, 14, 34, 0.05);
          display: flex;
          flex-direction: column;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .srv-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(124, 58, 237, 0.15);
          border-color: rgba(124, 58, 237, 0.4);
        }

        .srv-card-thumb-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9.5;
          overflow: hidden;
          background: #0F172A;
        }

        .srv-card-thumb-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }

        .srv-card:hover .srv-card-thumb-wrap img {
          transform: scale(1.06);
        }

        .srv-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.1) 0%, rgba(15, 23, 42, 0.6) 100%);
        }

        .srv-card-badge {
          position: absolute;
          top: 14px;
          right: 14px;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(10px);
          color: #FFFFFF;
          border: 1px solid rgba(255, 255, 255, 0.25);
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.3px;
        }

        .srv-card-icon-pill {
          position: absolute;
          bottom: 14px;
          left: 14px;
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: #7C3AED;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          box-shadow: 0 6px 16px rgba(124, 58, 237, 0.45);
          border: 2px solid #FFFFFF;
        }

        .srv-card-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .srv-card-title {
          font-size: 19px;
          font-weight: 850;
          color: #0F172A;
          margin: 0 0 10px;
          line-height: 1.35;
        }

        .srv-card-desc {
          font-size: 14px;
          line-height: 1.6;
          color: #475569;
          margin: 0 0 18px;
          flex-grow: 1;
        }

        .srv-deliverables-list {
          margin: 0 0 20px;
          padding: 14px 16px;
          background: #F8FAFC;
          border-radius: 12px;
          border: 1px solid #E2E8F0;
        }

        .srv-deliv-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12.5px;
          font-weight: 600;
          color: #334155;
          margin-bottom: 6px;
        }

        .srv-deliv-item:last-child {
          margin-bottom: 0;
        }

        .srv-check-icon {
          color: #10B981;
          font-size: 14px;
          flex-shrink: 0;
        }

        .srv-tags-row {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 22px;
        }

        .srv-chip {
          padding: 3px 10px;
          border-radius: 6px;
          background: #F3E8FF;
          color: #7C3AED;
          font-size: 11px;
          font-weight: 750;
          border: 1px solid rgba(124, 58, 237, 0.15);
        }

        .srv-card-footer {
          margin-top: auto;
          padding-top: 18px;
          border-top: 1px solid #F1F5F9;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .srv-btn-card-inquire {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 999px;
          background: #0F172A;
          color: #FFFFFF !important;
          font-size: 13px;
          font-weight: 750;
          text-decoration: none;
          transition: all 0.25s ease;
          border: none;
          cursor: pointer;
        }

        .srv-btn-card-inquire:hover {
          background: #7C3AED;
          transform: translateX(2px);
          box-shadow: 0 4px 14px rgba(124, 58, 237, 0.35);
        }

        /* Process Section */
        .srv-process-section {
          padding: 80px 24px;
          background: #FFFFFF;
          border-top: 1px solid #E2E8F0;
          border-bottom: 1px solid #E2E8F0;
        }

        .srv-process-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          margin-top: 48px;
        }

        .srv-process-card {
          padding: 28px 24px;
          border-radius: 18px;
          background: #FAFAFD;
          border: 1px solid #E2E8F0;
          position: relative;
          transition: all 0.25s ease;
        }

        .srv-process-card:hover {
          border-color: #C4B5FD;
          background: #FFFFFF;
          transform: translateY(-4px);
          box-shadow: 0 14px 30px rgba(124, 58, 237, 0.1);
        }

        .srv-step-number {
          font-size: 32px;
          font-weight: 900;
          color: #E2E8F0;
          line-height: 1;
          margin-bottom: 16px;
          letter-spacing: -1px;
        }

        .srv-process-card:hover .srv-step-number {
          color: #7C3AED;
        }

        .srv-process-card h3 {
          font-size: 17px;
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 8px;
        }

        .srv-process-card p {
          font-size: 13.5px;
          line-height: 1.6;
          color: #64748B;
          margin: 0;
        }

        /* Final CTA */
        .srv-cta-section {
          padding: 96px 24px;
        }

        .srv-cta-card {
          border-radius: 28px;
          background: linear-gradient(135deg, #100E26 0%, #1A123D 50%, #2E1065 100%);
          padding: 64px 36px;
          text-align: center;
          color: #FFFFFF;
          border: 1px solid rgba(196, 181, 253, 0.25);
          box-shadow: 0 24px 60px rgba(16, 14, 38, 0.35);
          position: relative;
          overflow: hidden;
          max-width: 1040px;
          margin: 0 auto;
        }

        .srv-cta-card h2 {
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 850;
          color: #FFFFFF;
          margin: 0 0 16px;
          line-height: 1.2;
        }

        .srv-cta-card p {
          font-size: 16.5px;
          line-height: 1.65;
          color: #DDD6FE;
          margin: 0 auto 36px;
          max-width: 650px;
        }

        .srv-cta-buttons {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .srv-btn-cta-white {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          border-radius: 999px;
          background: #FFFFFF;
          color: #0F172A !important;
          font-size: 15px;
          font-weight: 800;
          text-decoration: none;
          transition: all 0.25s ease;
        }

        .srv-btn-cta-white:hover {
          background: #EDE9FE;
          transform: translateY(-2px);
        }

        .srv-btn-cta-outline {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 26px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #FFFFFF !important;
          font-size: 14.5px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.25s ease;
        }

        .srv-btn-cta-outline:hover {
          background: rgba(255, 255, 255, 0.16);
          transform: translateY(-2px);
        }

        @media (max-width: 992px) {
          .srv-hero-grid {
            grid-template-columns: 1fr;
            gap: 36px;
            text-align: center;
          }
          .srv-eyebrow {
            margin: 0 auto 16px;
          }
          .srv-hero-desc {
            margin: 0 auto 24px;
          }
          .srv-hero-actions {
            justify-content: center;
          }
          .srv-stats-row {
            margin: 0 auto;
          }
          .srv-process-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 768px) {
          .srv-hero-section {
            padding: 32px 16px 44px;
          }
          .srv-hero-title {
            font-size: clamp(23px, 5.8vw, 32px);
          }
          .srv-hero-desc {
            font-size: 14px;
            line-height: 1.55;
          }
          .srv-hero-actions {
            flex-direction: column;
            width: 100%;
            gap: 10px;
          }
          .srv-btn-primary,
          .srv-btn-secondary {
            width: 100%;
            justify-content: center;
          }
          .srv-stats-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            width: 100%;
            padding: 12px 14px;
          }
          .srv-stat-divider {
            display: none;
          }
          .srv-visual-frame {
            width: 100%;
            height: 270px;
          }
          .srv-catalog-section,
          .srv-process-section,
          .srv-cta-section {
            padding: 44px 16px;
          }
          .srv-filter-tabs {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
          }
          .srv-filter-btn {
            padding: 6px 12px;
            font-size: 12.5px;
          }
          .srv-cards-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .srv-process-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }
          .srv-cta-card {
            padding: 36px 18px;
            border-radius: 20px;
          }
          .srv-cta-buttons {
            flex-direction: column;
            width: 100%;
            gap: 10px;
          }
          .srv-btn-cta-white,
          .srv-btn-cta-outline {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      {/* ================= HERO SECTION ================= */}
      <section className="srv-hero-section">
        <div className="srv-container srv-hero-grid">
          <div className="srv-hero-content">
            <div className="srv-eyebrow">
              ✦ ENTERPRISE ENGINEERING &amp; ACADEMIC EXCELLENCE
            </div>

            <h1 className="srv-hero-title">
              World-Class Tech Services.{" "}
              <span className="srv-gradient-text">Engineered for Real Impact.</span>
            </h1>

            <p className="srv-hero-desc">
              From enterprise SaaS development and autonomous AI agent workflows to university
              capstone guidance and corporate engineering bootcamps — TechDea builds solutions
              that scale and mentors the next generation of engineers.
            </p>

            <div className="srv-hero-actions">
              <button
                type="button"
                className="srv-btn-primary"
                onClick={() => navigate("/contact")}
              >
                <span>Request a Proposal / Consultation</span>
                <FiArrowRight />
              </button>

              <button
                type="button"
                className="srv-btn-secondary"
                onClick={() => navigate("/courses")}
              >
                <span>Explore Training Tracks</span>
              </button>
            </div>

            {/* Metrics Row - Matches Home Page layout */}
            <div className="srv-stats-row">
              <div className="srv-stat-item">
                <strong>120+</strong>
                <span>Products Shipped</span>
              </div>
              <div className="srv-stat-divider" />
              <div className="srv-stat-item">
                <strong>18,500+</strong>
                <span>Engineers Mentored</span>
              </div>
              <div className="srv-stat-divider" />
              <div className="srv-stat-item">
                <strong>99.4%</strong>
                <span>On-Time Delivery</span>
              </div>
              <div className="srv-stat-divider" />
              <div className="srv-stat-item">
                <strong>450+</strong>
                <span>Partner Companies</span>
              </div>
            </div>
          </div>

          {/* Right Visual Console */}
          <div className="srv-hero-visual">
            <div className="srv-visual-frame">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=85"
                alt="TechDea Engineering Team Working"
                loading="eager"
              />
              <div className="srv-visual-overlay" />

              <div className="srv-badge-floating">
                <FiCheckCircle style={{ color: "#10B981" }} />
                <span>ISO 9001:2015 Verified Delivery</span>
              </div>

              <div className="srv-floating-card">
                <div className="srv-floating-header">
                  <div className="srv-floating-title">
                    <FiLayers style={{ color: "#7C3AED" }} />
                    <span>TechDea Solutions Console</span>
                  </div>
                  <span className="srv-status-live">
                    <span className="srv-live-dot" /> LIVE &amp; ACTIVE
                  </span>
                </div>
                <p>
                  End-to-end agile product lifecycle with 24/7 dedicated engineering support,
                  clean code documentation, and CI/CD pipelines.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CATALOG SECTION ================= */}
      <section className="srv-catalog-section">
        <div className="srv-container">
          <div className="srv-section-header">
            <div className="srv-eyebrow">OUR CAPABILITIES</div>
            <h2>Specialized Engineering &amp; Education Verticals</h2>
            <p>
              Tailored services engineered for early-stage startups, growing tech enterprises,
              university faculties, and ambitious developers.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="srv-filter-tabs">
            {[
              { id: "all", label: "All Capabilities" },
              { id: "software", label: "Software & Mobile" },
              { id: "ai", label: "AI & Machine Learning" },
              { id: "cloud", label: "Cloud & DevOps" },
              { id: "training", label: "Training & Mentorship" }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`srv-filter-btn ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="srv-cards-grid">
            {filteredServices.map((service) => (
              <article key={service.id} className="srv-card">
                <div className="srv-card-thumb-wrap">
                  <img src={service.image} alt={service.title} loading="lazy" />
                  <div className="srv-card-overlay" />
                  <span className="srv-card-badge">{service.badge}</span>
                  <div className="srv-card-icon-pill">{service.icon}</div>
                </div>

                <div className="srv-card-body">
                  <h3 className="srv-card-title">{service.title}</h3>
                  <p className="srv-card-desc">{service.text}</p>

                  {/* Key Deliverables */}
                  <div className="srv-deliverables-list">
                    {service.deliverables.map((item, idx) => (
                      <div key={idx} className="srv-deliv-item">
                        <FiCheck className="srv-check-icon" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech Tags */}
                  <div className="srv-tags-row">
                    {service.tags.map((tag) => (
                      <span key={tag} className="srv-chip">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="srv-card-footer">
                    <button
                      type="button"
                      className="srv-btn-card-inquire"
                      onClick={() => navigate(`/contact?service=${encodeURIComponent(service.title)}`)}
                    >
                      <span>Inquire / Get Started</span>
                      <FiArrowRight />
                    </button>
                    <span style={{ fontSize: "12px", color: "#64748B", fontWeight: "600" }}>
                      Guaranteed SLA
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WORKFLOW PROCESS ================= */}
      <section className="srv-process-section">
        <div className="srv-container">
          <div className="srv-section-header">
            <div className="srv-eyebrow">THE TECHDEA BLUEPRINT</div>
            <h2>How We Deliver Predictable Excellence</h2>
            <p>
              A structured 4-step engineering and mentorship methodology refined over dozens of
              successful deployments and thousands of learning cohorts.
            </p>
          </div>

          <div className="srv-process-grid">
            {workflowSteps.map((ws) => (
              <div key={ws.step} className="srv-process-card">
                <div className="srv-step-number">{ws.step}</div>
                <h3>{ws.title}</h3>
                <p>{ws.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="srv-cta-section">
        <div className="srv-container">
          <div className="srv-cta-card">
            <h2>Ready to Build or Elevate Your Tech Capabilities?</h2>
            <p>
              Schedule a technical strategy call with our principal architects. We'll evaluate
              your project requirements, provide architecture recommendations, and map out a clear delivery plan.
            </p>

            <div className="srv-cta-buttons">
              <button
                type="button"
                className="srv-btn-cta-white"
                onClick={() => navigate("/contact")}
              >
                <FiPhoneCall />
                <span>Schedule a Strategy Session</span>
              </button>

              <button
                type="button"
                className="srv-btn-cta-outline"
                onClick={() => navigate("/courses")}
              >
                <FiBookOpen />
                <span>Browse Training Curriculum</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
