export default function Badge({ children, variant = "default", className = "" }) {
  const variants = {
    default: "bg-primary-blue text-white",
    ready: "bg-ready-badge text-white",
    featured: "bg-featured-badge text-white",
    outline: "border border-primary-blue text-primary-blue bg-transparent",
  };

  return (
    <span className={`inline-flex items-center px-4 py-1 rounded-full text-xs font-medium uppercase ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

