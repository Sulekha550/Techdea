import { useEffect, useMemo, useState } from "react";
import { FiSearch, FiBookOpen } from "react-icons/fi";
import { getCourses } from "../../services/courseService.js";
import CourseCard from "../../components/course/CourseCard.jsx";
import Skeleton from "../../components/common/Skeleton.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";

export default function Courses() {
  const [courses, setCourses] = useState([]);
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
    const params = {};
    if (search.trim()) params.search = search.trim();
    if (selectedCategory !== "All") params.category = selectedCategory;
    if (selectedLevel !== "All") params.level = selectedLevel;

    getCourses(params)
      .then(({ data }) => {
        if (isMounted) setCourses(data.courses || []);
      })
      .catch((err) => {
        console.error("Failed to load courses:", err);
        if (isMounted) setError("Courses could not be loaded. Please try again.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [search, selectedCategory, selectedLevel]);

  const visible = useMemo(() => {
    return courses.filter((c) => {
      const price = c.discountPrice || c.price || 0;
      if (priceFilter === "Free") return price <= 0;
      if (priceFilter === "Paid") return price > 0;
      return true;
    });
  }, [courses, priceFilter]);

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
