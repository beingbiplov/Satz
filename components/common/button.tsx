import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
}

type ButtonAsButton = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = BaseProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", size = "md", className, children, ...rest } = props as any;

  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-150 " +
    "focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary)/0.35)] " +
    "disabled:opacity-50 disabled:pointer-events-none cursor-pointer active:translate-y-[0.5px]";

  const sizes: Record<ButtonSize, string> = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-6 text-base",
  };

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] " +
      "hover:bg-[rgb(var(--primary)/0.9)] shadow-sm",

    outline:
      "border border-[rgb(var(--primary)/0.4)] bg-background text-foreground " +
      "hover:bg-[rgb(var(--primary)/0.08)] hover:border-[rgb(var(--primary)/0.6)]",

    ghost: "bg-transparent text-foreground hover:bg-[rgb(var(--primary)/0.08)]",

    danger: "bg-destructive text-destructive-foreground hover:opacity-90 shadow-sm",
  };

  const classes = cn(base, sizes[size], variants[variant], className);

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
