import type { CSSProperties, ReactNode } from "react";

interface DashboardCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  glow?: "blue" | "violet" | "muted";
  id?: string;
}

export function DashboardCard({
  children,
  className = "",
  delay = 0,
  glow = "blue",
  id,
}: DashboardCardProps) {
  return (
    <section
      id={id}
      className={`dashboard-card dashboard-card-${glow} ${className}`}
      style={{ "--card-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </section>
  );
}
