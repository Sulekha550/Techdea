import { Link } from "react-router-dom";
import { FiArrowRight, FiClock, FiStar, FiUsers, FiUser } from "react-icons/fi";

// Distinct 100% Unique Curated Tech Photography (Each course has a dedicated distinct photo)
const TOPIC_IMAGES = {
  web: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80", // 1. Web Dev: Sleek dark code editor with syntax
  ai: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80", // 2. Gen AI: Glowing violet neural network
  devops: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80", // 3. DevOps: High-tech blue server racks & datacenter
  data: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80", // 4. Data Science: Multi-chart analytics dashboard
  cyber: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80", // 5. Cyber Security: Holographic shield & security terminal
  mobile: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80", // 6. Mobile: Handheld smartphone with modern app UI
  web3: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80", // 7. Web3: Luminous 3D blockchain geometric cubes
  design: "https://images.unsplash.com/photo-1581291518655-9523c932deda?auto=format&fit=crop&w=800&q=80", // 8. UI/UX: Design workstation with swatches & tablet
  cloudarch: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80" // 9. Cloud Architecture: Global cyber telemetry
};

function getCuratedThumbnail(course) {
  const id = String(course?._id || course?.id || "");
  const name = (course?.name || "").toLowerCase();
  const slug = (course?.slug || "").toLowerCase();
  const cat = (course?.category || "").toLowerCase();

  // 1. Direct ID / Specific Topic Matches (Guaranteed Distinct)
  if (
    id.includes("fsd") ||
    id.includes("web") ||
    name.includes("mern") ||
    name.includes("full-stack") ||
    name.includes("web development") ||
    slug.includes("mern")
  ) {
    return TOPIC_IMAGES.web;
  }

  if (
    id.includes("ai") ||
    name.includes("generative ai") ||
    name.includes("llm") ||
    name.includes("autonomous agent") ||
    slug.includes("ai")
  ) {
    return TOPIC_IMAGES.ai;
  }

  if (
    id.includes("devops") ||
    name.includes("devops") ||
    name.includes("docker") ||
    name.includes("kubernetes") ||
    slug.includes("devops")
  ) {
    return TOPIC_IMAGES.devops;
  }

  if (
    id.includes("cyber") ||
    name.includes("cyber security") ||
    name.includes("penetration") ||
    name.includes("ethical hacker") ||
    slug.includes("cyber")
  ) {
    return TOPIC_IMAGES.cyber;
  }

  if (
    id.includes("data") ||
    name.includes("data science") ||
    name.includes("predictive modeling") ||
    name.includes("analytics") ||
    slug.includes("data")
  ) {
    return TOPIC_IMAGES.data;
  }

  if (
    id.includes("mobile") ||
    name.includes("mobile app") ||
    name.includes("react native") ||
    name.includes("flutter") ||
    slug.includes("mobile")
  ) {
    return TOPIC_IMAGES.mobile;
  }

  if (
    id.includes("web3") ||
    name.includes("blockchain") ||
    name.includes("smart contract") ||
    name.includes("solidity") ||
    name.includes("crypto") ||
    slug.includes("web3")
  ) {
    return TOPIC_IMAGES.web3;
  }

  if (
    id.includes("uiux") ||
    name.includes("ui/ux") ||
    name.includes("product design") ||
    name.includes("figma") ||
    slug.includes("ui")
  ) {
    return TOPIC_IMAGES.design;
  }

  // 2. Secondary Keyword Fallbacks
  if (name.includes("python")) return TOPIC_IMAGES.data;
  if (cat.includes("devops") || name.includes("cloud")) return TOPIC_IMAGES.cloudarch;
  if (cat.includes("design")) return TOPIC_IMAGES.design;

  // 3. Custom user-uploaded photo if clean
  const raw = course?.thumbnail || course?.image;
  if (raw && !raw.includes("1667372393119") && !raw.includes("1526374965328") && !raw.includes("1633356122544")) {
    return raw;
  }

  // 4. Deterministic fallback by course name hash so no random collisions occur
  const imageList = Object.values(TOPIC_IMAGES);
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  return imageList[Math.abs(hash) % imageList.length];
}

export default function CourseCard({ course, progress }) {
  const thumbnail = getCuratedThumbnail(course);
  const isFree = (course.price || 0) <= 0;
  const sale = course.discountPrice && course.price > course.discountPrice;
  const discountPct = sale ? Math.round(((course.price - course.discountPrice) / course.price) * 100) : 0;

  return (
    <article className="course-card">
      <div className="course-card-thumb-wrap">
        <img
          src={thumbnail}
          alt={course.name}
          className="course-card-thumb"
          loading="lazy"
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
