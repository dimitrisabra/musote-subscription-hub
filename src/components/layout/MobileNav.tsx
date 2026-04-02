import { NavLink } from "react-router-dom";
import { LayoutDashboard, CreditCard, Zap, Settings, Shield, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export function MobileNav() {
  const { isAdmin } = useAuth();

  const items = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Home" },
    { to: "/subscriptions", icon: CreditCard, label: "Subs" },
    { to: "/budget", icon: Wallet, label: "Budget" },
    { to: "/insights", icon: Zap, label: "Insights" },
    ...(isAdmin ? [{ to: "/admin", icon: Shield, label: "Admin" }] : [{ to: "/settings", icon: Settings, label: "Settings" }]),
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border z-50">
      <div className="flex justify-around py-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-0.5 px-2 py-1.5 text-xs transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
