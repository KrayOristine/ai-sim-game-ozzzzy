import React from "react";
import "#/assets/btn_X.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning" | "special" | "info";
}

const Button: React.FC<ButtonProps> = ({
  children,
  icon,
  variant = "primary",
  className = "",
  ...props
}) => {
  return (
    <button className={`btn_X_base ${"btn_X_variant_" + variant} ${className}`} {...props}>
      {icon && <span className="mr-3">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
