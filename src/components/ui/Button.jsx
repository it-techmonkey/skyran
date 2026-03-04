export default function Button({ 
  children, 
  variant = "primary", 
  onClick, 
  className = "",
  icon: Icon,
  iconPosition = "right",
  type = "button"
}) {
  const variants = {
    primary: "bg-black text-white hover:bg-gray-800",
    secondary: "bg-transparent border border-white/30 text-white hover:bg-white/10",
    blue: "bg-primary-blue text-white hover:bg-blue-600",
    outline: "border border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white",
  };

  const iconClasses = Icon ? (iconPosition === "left" ? "mr-2" : "ml-2") : "";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${variants[variant]} ${className}`}
    >
      {Icon && iconPosition === "left" && <Icon className="w-5 h-5" />}
      {children}
      {Icon && iconPosition === "right" && <Icon className="w-5 h-5" />}
    </button>
  );
}

