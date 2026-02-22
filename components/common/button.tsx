import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "outline" | "ghost" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  const variants: Record<ButtonVariant, string> = {
    primary: "bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98]",

    outline: "border border-border bg-card text-foreground hover:bg-muted/40",

    ghost: "bg-transparent text-foreground hover:bg-muted/40",

    danger: "bg-destructive text-destructive-foreground hover:opacity-90 active:scale-[0.98]",
  };

  return <button className={cn(base, variants[variant], className)} {...props} />;
}
