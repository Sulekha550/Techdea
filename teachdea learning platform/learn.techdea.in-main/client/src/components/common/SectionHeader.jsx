export default function SectionHeader({ eyebrow, title, text, centered = true }) {
  return (
    <div className={`section-heading${centered ? " centered" : ""}`}>
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      {title && <h2>{title}</h2>}
      {text && <p>{text}</p>}
    </div>
  );
}
