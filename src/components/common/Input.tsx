import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export function Input({ className, hasError = false, ...props }: InputProps) {
  const classes = [
    "h-11 w-full rounded-lg border bg-black/30 px-3 text-sm text-white outline-none transition placeholder:text-loop-muted",
    hasError
      ? "border-loop-primary focus:border-loop-primary"
      : "border-white/10 focus:border-white/35",
    className
  ]
    .filter(Boolean)
    .join(" ");

  return <input className={classes} {...props} />;
}
