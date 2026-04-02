import { motion } from "framer-motion";
import { Bell, CheckCircle } from "lucide-react";
import { upcomingRenewals } from "@/lib/mock-data";

const notifications = [
  { id: "1", type: "renewal", title: "Netflix renewal in 3 days", desc: "$15.99 will be charged on Apr 15", time: "2h ago", read: false },
  { id: "2", type: "insight", title: "New saving opportunity", desc: "Switch Spotify to yearly plan and save $24/year", time: "5h ago", read: false },
  { id: "3", type: "alert", title: "Notion unused for 30 days", desc: "Consider canceling to save $8/mo", time: "1d ago", read: true },
  { id: "4", type: "renewal", title: "3 subscriptions renewing this week", desc: "Total: $45.98 across Spotify, AWS, Gym", time: "2d ago", read: true },
  { id: "5", type: "system", title: "Welcome to Musote Pro!", desc: "You now have access to unlimited subscriptions and advanced analytics", time: "3d ago", read: true },
];

export default function Notifications() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground text-sm mt-1">{notifications.filter(n => !n.read).length} unread</p>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map((n, i) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`bg-card rounded-xl border p-4 flex items-start gap-4 transition-colors ${
              n.read ? "border-border" : "border-primary/30 bg-primary/5"
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${n.read ? "bg-muted" : "bg-primary/10"}`}>
              {n.read ? <CheckCircle className="w-4 h-4 text-muted-foreground" /> : <Bell className="w-4 h-4 text-primary" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${n.read ? "text-muted-foreground" : "text-card-foreground"}`}>{n.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
            </div>
            <span className="text-xs text-muted-foreground shrink-0">{n.time}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
