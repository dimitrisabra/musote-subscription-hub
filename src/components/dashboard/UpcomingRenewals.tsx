import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { upcomingRenewals } from "@/lib/mock-data";

export function UpcomingRenewals() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="bg-card rounded-xl border border-border p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-card-foreground">Upcoming Renewals</h3>
        <Calendar className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="space-y-3">
        {upcomingRenewals.map((sub) => (
          <div key={sub.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <div className="flex items-center gap-3">
              <span className="text-xl">{sub.logo}</span>
              <div>
                <p className="text-sm font-medium text-card-foreground">{sub.name}</p>
                <p className="text-xs text-muted-foreground">{new Date(sub.renewalDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-card-foreground">${sub.price.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
