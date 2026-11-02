import { useState, useEffect, useRef } from "react";
import {
  FiBookOpen,
  FiAward,
  FiPlayCircle,
  FiCode,
  FiCheckCircle,
  FiTrendingUp,
  FiShield,
  FiCpu,
  FiZap,
} from "react-icons/fi";

export default function Hero3DVisual() {
  const containerRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Subtle tilt calculation
    setTilt({
      x: -(y / (rect.height / 2)) * 10,
      y: (x / (rect.width / 2)) * 12,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      className="hero-3d-wrapper"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dynamic 3D Scene */}
      <div
        className="hero-3d-scene"
        style={{
          transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: isHovered
            ? "transform 0.12s cubic-bezier(0.2, 0, 0.3, 1)"
            : "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Glow backdrop behind 3D composition */}
        <div className="hero-3d-ambient-glow" />

        {/* ================= MAIN 3D WORKSTATION CARD ================= */}
        <div className="hero-3d-main-card">
          {/* Top terminal bar */}
          <div className="hero-3d-card-header">
            <div className="terminal-dots">
              <span className="dot dot-red" />
              <span className="dot dot-yellow" />
              <span className="dot dot-green" />
            </div>
            <div className="terminal-title">
              <FiCode className="terminal-icon" /> techdea-learning-suite.tsx
            </div>
            <div className="live-status">
              <span className="pulse-dot" /> LIVE BATCH
            </div>
          </div>

          {/* Code preview & interactive stage */}
          <div className="hero-3d-code-body">
            <div className="code-line">
              <span className="code-keyword">import</span>{" "}
              <span className="code-variable">{"{ TechDeaMastery }"}</span>{" "}
              <span className="code-keyword">from</span>{" "}
              <span className="code-string">"@techdea/engineering"</span>;
            </div>
            <div className="code-line">
              <span className="code-keyword">const</span>{" "}
              <span className="code-def">student</span> ={" "}
              <span className="code-keyword">new</span>{" "}
              <span className="code-call">TechDeaMastery</span>({"{"}
            </div>
            <div className="code-line indent">
              <span className="code-prop">track:</span>{" "}
              <span className="code-string">"Full-Stack AI & Cloud"</span>,
            </div>
            <div className="code-line indent">
              <span className="code-prop">verifiedBadge:</span>{" "}
              <span className="code-bool">true</span>,
            </div>
            <div className="code-line indent">
              <span className="code-prop">readyForIndustry:</span>{" "}
              <span className="code-bool">true</span>
            </div>
            <div className="code-line">{"});"}</div>
            <div className="code-line code-highlight">
              <span className="code-comment">{"// 🚀 Launch high-paying global tech career"}</span>
            </div>
          </div>

          {/* Curriculum Track List */}
          <div className="hero-3d-modules">
            <div className="module-item active">
              <span className="mod-idx">01</span>
              <span className="mod-name">Modern Architecture & React 19</span>
              <FiCheckCircle className="mod-check" />
            </div>
            <div className="module-item">
              <span className="mod-idx">02</span>
              <span className="mod-name">Scalable Backend, Cloud & APIs</span>
              <FiCheckCircle className="mod-check" />
            </div>
            <div className="module-item">
              <span className="mod-idx">03</span>
              <span className="mod-name">Applied Artificial Intelligence</span>
              <FiCheckCircle className="mod-check" />
            </div>
          </div>

          {/* Card footer */}
          <div className="hero-3d-card-footer">
            <div className="footer-stat">
              <FiZap className="icon-purple" />
              <span>99.4% Practical Outcomes</span>
            </div>
            <div className="footer-stat">
              <FiAward className="icon-gold" />
              <span>ISO 9001:2015 Verified</span>
            </div>
          </div>
        </div>

        {/* ================= 3D FLOATING ELEMENT 1: 3D GRADUATION CAP ================= */}
        <div className="hero-3d-floating-element cap-float">
          <div className="element-inner cap-inner">
            <svg
              className="svg-3d-cap"
              viewBox="0 0 160 140"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="capTopGrad" x1="20" y1="20" x2="140" y2="80" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#9333EA" />
                  <stop offset="0.5" stopColor="#7C3AED" />
                  <stop offset="1" stopColor="#4C1D95" />
                </linearGradient>
                <linearGradient id="capSideGrad" x1="40" y1="70" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#5B21B6" />
                  <stop offset="1" stopColor="#2E1065" />
                </linearGradient>
                <linearGradient id="goldTassel" x1="0" y1="0" x2="1" y2="1">
                  <stop stopColor="#FBBF24" />
                  <stop offset="1" stopColor="#D97706" />
                </linearGradient>
                <filter id="capShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#7C3AED" floodOpacity="0.4" />
                </filter>
              </defs>
              {/* Lower skull cap */}
              <path
                d="M48 65 C48 95 112 95 112 65 L112 85 C112 110 48 110 48 85 Z"
                fill="url(#capSideGrad)"
                filter="url(#capShadow)"
              />
              {/* Beveled mortarboard top */}
              <polygon
                points="80,18 145,50 80,78 15,50"
                fill="url(#capTopGrad)"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1.5"
              />
              {/* Central gold button */}
              <circle cx="80" cy="48" r="4.5" fill="url(#goldTassel)" />
              {/* Hanging tassel cord */}
              <path
                d="M80 48 Q105 52 118 72 Q122 84 120 102"
                stroke="url(#goldTassel)"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
              {/* Tassel fringe */}
              <polygon points="116,102 124,102 127,122 113,122" fill="url(#goldTassel)" />
            </svg>
            <div className="cap-label">
              <strong>Govt. & Industry Recognized</strong>
              <span>Verified Certificate</span>
            </div>
          </div>
        </div>

        {/* ================= 3D FLOATING ELEMENT 2: 3D AI NEURAL CORE ================= */}
        <div className="hero-3d-floating-element ai-float">
          <div className="element-inner ai-inner">
            <div className="neural-orb-wrap">
              <div className="neural-orb">
                <div className="orb-core" />
                <div className="orb-ring ring-1" />
                <div className="orb-ring ring-2" />
                <div className="orb-ring ring-3" />
              </div>
            </div>
            <div className="ai-text">
              <div className="ai-badge">AI POWERED</div>
              <strong>Smart Learning AI</strong>
              <span>Adaptive Curriculum</span>
            </div>
          </div>
        </div>

        {/* ================= 3D FLOATING ELEMENT 3: 3D METRIC BADGE ================= */}
        <div className="hero-3d-floating-element metrics-float">
          <div className="element-inner metrics-inner">
            <div className="metrics-icon-wrap">
              <FiTrendingUp className="metrics-icon" />
            </div>
            <div>
              <div className="metrics-num">12,500+</div>
              <div className="metrics-label">Students Upskilled</div>
            </div>
          </div>
        </div>

        {/* ================= 3D FLOATING ELEMENT 4: TECH STACK CUBES ================= */}
        <div className="hero-3d-floating-element tech-cube cube-react">
          <span className="cube-label">React 19</span>
        </div>
        <div className="hero-3d-floating-element tech-cube cube-python">
          <span className="cube-label">Python AI</span>
        </div>
        <div className="hero-3d-floating-element tech-cube cube-cloud">
          <span className="cube-label">Cloud AWS</span>
        </div>
      </div>
    </div>
  );
}
