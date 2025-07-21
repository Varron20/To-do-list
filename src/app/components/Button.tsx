import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`px-3 py-1 rounded font-bold text-xs bg-[var(--color-muted-blue)] text-[var(--color-off-white)] hover:bg-[var(--color-dark-blue)] hover:text-[var(--color-off-white)] transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 