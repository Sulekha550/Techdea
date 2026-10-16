export default function Loader({ text = "Loading..." }) {
  return <div className="loader-wrap"><span className="spinner"></span><span>{text}</span></div>;
}