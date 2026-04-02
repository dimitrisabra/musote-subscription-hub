import { motion } from "framer-motion";
import { Plus, Minus, Edit, Monitor, ArrowUpCircle, History } from "lucide-react";
import { activityLog } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const iconMap = {
  add: Plus,
  cancel: Minus,
  edit: Edit,
  system: Monitor,
  upgrade: ArrowUpCircle,
};

const colorMap = {
  add: "text-success bg-success/10",
  cancel: "text-destructive bg-destructive/10",
  edit: "text-info bg-info/10",
  system: "text-muted-foreground bg-muted",
  upgrade: "text-accent bg-accent/10",
};

export default function Activity() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <History className="w-6 h-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Activity Log</h1>
          <p className="text-muted-foreground text-sm mt-1">Recent account activity and changes</p>
        </div>
      </div>

      <div className="space-y-3">
        {activityLog.map((entry, i) => {
          const Icon = iconMap[entry.type];
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-xl border border-border p-4 flex items-center gap-4"
            >
              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", colorMap[entry.type])}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-card-foreground">{entry.action}</p>
                <p className="text-xs text-muted-foreground">by {entry.user}</p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{entry.timestamp}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
