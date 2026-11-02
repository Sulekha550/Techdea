import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiClock, FiStar, FiUsers, FiUser } from "react-icons/fi";

// Distinct 100% Unique Curated Tech Photography (Each course has a dedicated distinct photo)
export const TOPIC_IMAGES = {
  web: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80", // 1. Full-Stack Web Dev: Sleek dark code editor with syntax
  ai: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80", // 2. Gen AI & LLMs: Glowing violet neural network core (100% stable)
  devops: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80", // 3. DevOps: High-tech blue server racks & datacenter
  data: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80", // 4. Data Science: Multi-chart analytics dashboard
  cyber: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80", // 5. Cyber Security: Holographic shield & security terminal
  mobile: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80", // 6. Mobile: Handheld smartphone with modern app UI
  web3: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80", // 7. Web3: Luminous 3D blockchain geometric cubes
  design: "https://images.unsplash.com/photo-1581291518655-9523c932deda?auto=format&fit=crop&w=800&q=80", // 8. UI/UX: Design workstation with swatches & tablet
  cloudarch: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80", // 9. Cloud Architecture: Global cyber telemetry
  fallback: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80" // Universal tech fallback
};

export function getCuratedThumbnail(course) {
  if (!course) return TOPIC_IMAGES.web;

  const id = String(course?._id || course?.id || "").toLowerCase();
  const name = String(course?.name || "").toLowerCase();
  const slug = String(course?.slug || "").toLowerCase();
  const cat = String(course?.category || course?.branch || "").toLowerCase();

  // 1. Web3 / Blockchain / Solidity (MUST BE EVALUATED BEFORE "web" to prevent collision!)
  if (
    id.includes("web3") ||
    id.includes("blockchain") ||
    name.includes("web3") ||
    name.includes("blockchain") ||
    name.includes("smart contract") ||
    name.includes("solidity") ||
    name.includes("crypto") ||
    slug.includes("web3")
  ) {
    return TOPIC_IMAGES.web3;
  }

  // 2. Generative AI & Autonomous LLM Agents
  if (
    id.includes("ai") ||
    name.includes("generative") ||
    name.includes("llm") ||
    name.includes("agent") ||
    name.includes("artificial intelligence") ||
    slug.includes("ai")
  ) {
    return TOPIC_IMAGES.ai;
  }

  // 3. DevOps, Docker, Kubernetes & Cloud Architecture
  if (
    id.includes("devops") ||
    id.includes("docker") ||
    id.includes("kubernetes") ||
    name.includes("devops") ||
    name.includes("docker") ||
    name.includes("kubernetes") ||
    name.includes("cloud engineering") ||
    slug.includes("devops") ||
    cat.includes("devops")
  ) {
    return TOPIC_IMAGES.devops;
  }

  // 4. Cyber Security & Ethical Hacking
  if (
    id.includes("cyber") ||
    name.includes("cyber") ||
    name.includes("security") ||
    name.includes("penetration") ||
    name.includes("hacker") ||
    name.includes("soc") ||
    slug.includes("cyber")
  ) {
    return TOPIC_IMAGES.cyber;
  }

  // 5. Data Science, Analytics & Python ML
  if (
    id.includes("data") ||
    name.includes("data science") ||
    name.includes("analytics") ||
    name.includes("pandas") ||
    name.includes("predictive modeling") ||
    name.includes("python") ||
    slug.includes("data")
  ) {
    return TOPIC_IMAGES.data;
  }

  // 6. Mobile App Engineering (React Native / Flutter / Android / iOS)
  if (
    id.includes("mobile") ||
    name.includes("mobile") ||
    name.includes("react native") ||
    name.includes("flutter") ||
    name.includes("android") ||
    name.includes("ios") ||
    slug.includes("mobile")
  ) {
    return TOPIC_IMAGES.mobile;
  }

  // 7. UI/UX & Design Systems
  if (
    id.includes("uiux") ||
    id.includes("design") ||
    name.includes("ui/ux") ||
    name.includes("uiux") ||
    name.includes("product design") ||
    name.includes("figma") ||
    cat.includes("design") ||
    slug.includes("ui")
  ) {
    return TOPIC_IMAGES.design;
  }

  // 8. Full-Stack Web Development (MERN, Next.js, Web Development)
  // Evaluated ONLY after Web3 is checked
  if (
    id.includes("fsd") ||
    id.includes("mern") ||
    (id.includes("web") && !id.includes("web3")) ||
    name.includes("full-stack") ||
    name.includes("mern") ||
    name.includes("web development") ||
    name.includes("next.js") ||
    name.includes("react") ||
    slug.includes("mern") ||
    slug.includes("full-stack")
  ) {
    return TOPIC_IMAGES.web;
  }

  // 9. Secondary Keyword / Category Fallbacks
  if (name.includes("cloud") || cat.includes("cloud")) return TOPIC_IMAGES.cloudarch;
  if (cat.includes("data") || cat.includes("analytics")) return TOPIC_IMAGES.data;

  // 10. Custom user-uploaded photo if clean and valid
  const raw = course?.thumbnail || course?.image;
  if (raw && typeof raw === "string" && raw.startsWith("http") && !raw.includes("1667372393119") && !raw.includes("1526374965328") && !raw.includes("1633356122544")) {
    return raw;
  }

  // 11. Deterministic fallback by course name hash
  const imageList = [
    TOPIC_IMAGES.web,
    TOPIC_IMAGES.ai,
    TOPIC_IMAGES.devops,
    TOPIC_IMAGES.data,
    TOPIC_IMAGES.cyber,
    TOPIC_IMAGES.mobile,
    TOPIC_IMAGES.web3,
    TOPIC_IMAGES.design
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  return imageList[Math.abs(hash) % imageList.length];
}

export default function CourseCard({ course, progress }) {
  const initialThumb = getCuratedThumbnail(course);
  const [imgSrc, setImgSrc] = useState(initialThumb);

  useEffect(() => {
    setImgSrc(getCuratedThumbnail(course));
  }, [course]);

  const isFree = (course.price || 0) <= 0;
  const sale = course.discountPrice && course.price > course.discountPrice;
  const discountPct = sale ? Math.round(((course.price - course.discountPrice) / course.price) * 100) : 0;

  return (
    <article className="course-card">
      <div className="course-card-thumb-wrap">
        <img
          src={imgSrc}
          alt={course.name}
          className="course-card-thumb"
          loading="eager"
          onError={() => {
            if (imgSrc !== TOPIC_IMAGES.fallback) {
              setImgSrc(TOPIC_IMAGES.fallback);
            }
          }}
        />
        <div className="thumb-vignette" />
        <span className="course-badge-level">{course.level || "All Levels"}</span>
        {discountPct > 0 && (
          <span className="course-badge-discount">{discountPct}% OFF</span>
        )}
      </div>

      <div className="course-card-body">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px", gap: "8px" }}>
          <span className="course-category-tag">
            {course.category || course.branch || "Technology"}
          </span>
          <span className="course-rating-pill">
            <FiStar style={{ color: "#F59E0B", fill: "#F59E0B", fontSize: 13 }} />
            <span>{course.rating || "4.9"}</span>
          </span>
        </div>

        <h3 className="course-card-title">{course.name}</h3>
        <p className="course-card-desc">
          {course.shortDescription || course.description || "Professional technical training with structured lessons and career-focused practice."}
        </p>

        <div className="course-card-meta">
          {course.instructor?.name && (
            <span><FiUser style={{ color: "#7C3AED" }} /> {course.instructor.name}</span>
          )}
          <span><FiUsers style={{ color: "#7C3AED" }} /> {(course.studentsCount || 1240).toLocaleString()} Learners</span>
          <span><FiClock style={{ color: "#7C3AED" }} /> {course.duration || "12 Weeks"}</span>
        </div>

        {progress !== undefined && (
          <div style={{ margin: "10px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: "var(--primary)" }}>
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="progress-bar-wrap">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        <div className="course-card-footer">
          <div className="course-price-wrap">
            {isFree ? (
              <span className="course-card-price free">Free</span>
            ) : (
              <>
                <span className="course-card-price">
                  ₹{(course.discountPrice || course.price)?.toLocaleString()}
                </span>
                {sale && (
                  <span className="original-price">
                    ₹{course.price?.toLocaleString()}
                  </span>
                )}
              </>
            )}
          </div>

          <Link className="btn-course-explore" to={`/courses/${course._id || course.slug}`}>
            <span>View Syllabus</span> <FiArrowRight />
          </Link>
        </div>
      </div>
    </article>
  );
}
