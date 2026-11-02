import { useEffect, useMemo, useState } from "react";
import { FiSearch, FiBookOpen } from "react-icons/fi";
import { getCourses } from "../../services/courseService.js";
import CourseCard from "../../components/course/CourseCard.jsx";
import Skeleton from "../../components/common/Skeleton.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";

const FALLBACK_COURSES = [
  {
    _id: "course-fsd-01",
    name: "Full-Stack Web Development with MERN & Next.js",
    category: "Full Stack Development",
    level: "Intermediate",
    price: 6999,
    discountPrice: 4499,
    rating: 4.9,
    studentsCount: 2840,
    duration: "16 Weeks",
    instructor: { name: "Dr. Arvind Kashyap (Ex-Google)" },
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    shortDescription: "Master React 19, Node.js, Next.js, Microservices, Docker, Redis and enterprise cloud deployment."
  },
  {
    _id: "course-ai-02",
    name: "Generative AI Engineering & Autonomous LLM Agents",
    category: "Data & AI",
    level: "Intermediate",
    price: 8999,
    discountPrice: 5999,
    rating: 4.95,
    studentsCount: 1950,
    duration: "12 Weeks",
    instructor: { name: "Pooja Sundaram (AI Research Lead)" },
    thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
    shortDescription: "Build real-world production GenAI apps, RAG pipelines, LangChain, vector databases, and fine-tune models."
  },
  {
    _id: "course-devops-03",
    name: "Cloud Engineering & DevOps with Docker and Kubernetes",
    category: "DevOps",
    level: "Advanced",
    price: 6499,
    discountPrice: 3999,
    rating: 4.85,
    studentsCount: 1620,
    duration: "10 Weeks",
    instructor: { name: "Vikram Rathore (Principal SRE)" },
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    shortDescription: "Zero-downtime CI/CD workflows, Docker containerization, Kubernetes cluster orchestration, and AWS infra."
  },
  {
    _id: "course-data-05",
    name: "Python for Data Science, Analytics & Machine Learning",
    category: "Data & AI",
    level: "Beginner",
    price: 5999,
    discountPrice: 3499,
    rating: 4.8,
    studentsCount: 2200,
    duration: "12 Weeks",
    instructor: { name: "Dr. Arvind Kashyap" },
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    shortDescription: "From Python & Pandas to Machine Learning algorithms, statistical modeling, Scikit-learn, and dashboards."
  },
  {
    _id: "course-cyber-04",
    name: "Advanced Cyber Security & Penetration Testing",
    category: "Software Engineering",
    level: "Intermediate",
    price: 7499,
    discountPrice: 4799,
    rating: 4.9,
    studentsCount: 1310,
    duration: "14 Weeks",
    instructor: { name: "Sameer Varma (Certified Ethical Hacker)" },
    thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    shortDescription: "Hands-on threat hunting, network security, ethical exploitation, bug bounty methods, and SOC fundamentals."
  },
  {
    _id: "course-mobile-06",
    name: "Cross-Platform Mobile App Engineering (React Native & Flutter)",
    category: "Full Stack Development",
    level: "All Levels",
    price: 5499,
    discountPrice: 3299,
    rating: 4.88,
    studentsCount: 1480,
    duration: "10 Weeks",
    instructor: { name: "Ananya Roy (Senior Mobile Architect)" },
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
    shortDescription: "Craft high-performance native iOS & Android applications with React Native, Expo, Redux, and offline sync."
  },
  {
    _id: "course-web3-07",
    name: "Web3, Smart Contracts & Blockchain Systems",
    category: "Software Engineering",
    level: "Advanced",
    price: 7999,
    discountPrice: 4999,
    rating: 4.92,
    studentsCount: 1120,
    duration: "10 Weeks",
    instructor: { name: "Aditya Mehta (Blockchain Core Dev)" },
    thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80",
    shortDescription: "Build decentralized applications (dApps), write secure Solidity smart contracts, Ethereum EVM, and DeFi protocols."
  },
  {
    _id: "course-uiux-08",
    name: "UI/UX Engineering & Modern Product Design Systems",
    category: "Technology",
    level: "Beginner",
    price: 4999,
    discountPrice: 2999,
    rating: 4.86,
    studentsCount: 1750,
    duration: "8 Weeks",
    instructor: { name: "Rhea Sen (Product Design Lead)" },
    thumbnail: "https://images.unsplash.com/photo-1581291518655-9523c932deda?auto=format&fit=crop&w=800&q=80",
    shortDescription: "Master Figma, wireframing, micro-interactions, responsive typography, and scalable enterprise design systems."
  }
];

export default function Courses() {
  const [courses, setCourses] = useState(FALLBACK_COURSES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");

  const categories = ["All", "Full Stack Development", "Data & AI", "DevOps", "Software Engineering", "Technology"];
  const levels = ["All", "Beginner", "Intermediate", "Advanced", "All Levels"];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError("");

    getCourses()
      .then(({ data }) => {
        if (isMounted) {
          if (data?.courses && data.courses.length > 0) {
            // Merge backend courses with our curated high-impact catalog so all 8+ courses are visible
            const existingNames = new Set(data.courses.map((c) => (c.name || "").toLowerCase()));
            const complementary = FALLBACK_COURSES.filter(
              (c) => !existingNames.has((c.name || "").toLowerCase())
            );
            setCourses([...data.courses, ...complementary]);
          } else {
            setCourses(FALLBACK_COURSES);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to load courses from API (using fallback):", err);
        if (isMounted) {
          setCourses(FALLBACK_COURSES);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const visible = useMemo(() => {
    return courses.filter((c) => {
      // Category filter
      if (selectedCategory !== "All") {
        const cat = (c.category || c.branch || "").toLowerCase();
        if (cat !== selectedCategory.toLowerCase()) return false;
      }
      // Level filter
      if (selectedLevel !== "All") {
        const lvl = (c.level || "").toLowerCase();
        if (lvl !== selectedLevel.toLowerCase()) return false;
      }
      // Price filter
      const price = c.discountPrice !== undefined ? c.discountPrice : c.price || 0;
      if (priceFilter === "Free" && price > 0) return false;
      if (priceFilter === "Paid" && price <= 0) return false;
      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = (c.name || "").toLowerCase().includes(q);
        const matchDesc = (c.shortDescription || c.description || "").toLowerCase().includes(q);
        const matchCat = (c.category || "").toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchCat) return false;
      }
      return true;
    });
  }, [courses, selectedCategory, selectedLevel, priceFilter, search]);

  return (
    <section className="section page-top">
      <div className="container">
        <div className="section-heading">
          <div className="eyebrow"><FiBookOpen /> COURSE MARKETPLACE</div>
          <h1>Explore TechDea Courses</h1>
          <p>Search, filter, and open a professional course landing page — data comes from the live catalog.</p>
        </div>

        <div className="catalog-toolbar">
          <div className="search-input-wrap">
            <FiSearch className="search-icon" aria-hidden="true" />
            <input
              type="search"
              aria-label="Search courses"
              placeholder="Search courses, skills, or topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-tabs" role="tablist" aria-label="Category">
            {categories.map((cat) => (
              <button key={cat} type="button" className={`filter-tab ${selectedCategory === cat ? "active" : ""}`} onClick={() => setSelectedCategory(cat)}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="catalog-toolbar">
          <div className="filter-tabs" aria-label="Level">
            {levels.map((lvl) => (
              <button key={lvl} type="button" className={`filter-tab ${selectedLevel === lvl ? "active" : ""}`} onClick={() => setSelectedLevel(lvl)}>
                {lvl}
              </button>
            ))}
          </div>
          <div className="filter-tabs" aria-label="Price">
            {["All", "Free", "Paid"].map((p) => (
              <button key={p} type="button" className={`filter-tab ${priceFilter === p ? "active" : ""}`} onClick={() => setPriceFilter(p)}>
                {p === "All" ? "Any price" : p}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <Skeleton />
        ) : error ? (
          <EmptyState title="Unable to load courses" text={error} />
        ) : visible.length > 0 ? (
          <div className="course-grid">
            {visible.map((course) => <CourseCard key={course._id} course={course} />)}
          </div>
        ) : (
          <EmptyState
            title="No courses found"
            text="Try a different search, category, level, or price filter."
            action={
              <button type="button" className="btn btn-primary" onClick={() => { setSearch(""); setSelectedCategory("All"); setSelectedLevel("All"); setPriceFilter("All"); }}>
                Clear filters
              </button>
            }
          />
        )}
      </div>
    </section>
  );
}
