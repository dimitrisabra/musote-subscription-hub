import { motion } from "framer-motion";
import { Zap, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { insights } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const iconMap = {
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle,
};

export function InsightsPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      className="bg-card rounded-xl border border-border p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-card-foreground">Smart Insights</h3>
      </div>
      <div className="space-y-3">
        {insights.map((insight, i) => {
          const Icon = iconMap[insight.type];
          return (
            <div
              key={i}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg",
                insight.type === "warning" && "bg-warning/10",
                insight.type === "info" && "bg-info/10",
                insight.type === "success" && "bg-success/10",
              )}
            >
              <Icon className={cn(
                "w-4 h-4 mt-0.5 shrink-0",
                insight.type === "warning" && "text-warning",
                insight.type === "info" && "text-info",
                insight.type === "success" && "text-success",
              )} />
              <div>
                <p className="text-sm text-card-foreground">{insight.message}</p>
                {insight.saving > 0 && (
                  <p className="text-xs text-primary font-medium mt-1">Save ${insight.saving}/mo</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
