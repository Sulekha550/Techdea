export default function PageHeader({ eyebrow, title, text, children }) {
  return (
    <div className="section-heading">
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      {title && <h1>{title}</h1>}
      {text && <p>{text}</p>}
      {children}
    </div>
  );
}
