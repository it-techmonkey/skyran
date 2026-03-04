export default function Card({ children, className = "", hover = false }) {
  return (
    <div className={`bg-white rounded-xl ${hover ? "transition-all duration-300 hover:shadow-xl" : ""} ${className}`}>
      {children}
    </div>
  );
}

