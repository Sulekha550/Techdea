export default function Button({ children, className = "", loading = false, ...props }) {
  return (
    <button className={`btn btn-primary ${className}`} disabled={loading || props.disabled} {...props}>
      {loading ? "Please wait..." : children}
    </button>
  );
}