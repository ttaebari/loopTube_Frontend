import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "default" | "sm" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-loop-primary text-white hover:bg-red-600",
  secondary: "bg-white/10 text-white hover:bg-white/15",
  ghost: "bg-transparent text-loop-muted hover:bg-white/10 hover:text-white",
  danger: "bg-red-950/60 text-red-100 hover:bg-red-900"
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-11 px-4 text-sm",
  sm: "h-9 px-3 text-sm",
  icon: "h-10 w-10 p-0"
};

export function Button({
  children,
  className,
  type = "button",
  variant = "secondary",
  size = "default",
  ...props
}: ButtonProps) {
  const classes = [
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} type={type} {...props}>
      {children}
    </button>
  );
}
