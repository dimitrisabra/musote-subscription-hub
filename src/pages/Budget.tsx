import { motion } from "framer-motion";
import { Wallet, TrendingUp } from "lucide-react";
import { budgetData } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function Budget() {
  const pct = Math.round((budgetData.spent / budgetData.monthly) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Budget Tracker</h1>
        <p className="text-muted-foreground text-sm mt-1">Set and monitor spending limits by category</p>
      </div>

      {/* Overall budget */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Monthly Budget</p>
              <p className="text-2xl font-bold text-card-foreground">${budgetData.spent.toFixed(0)} <span className="text-sm font-normal text-muted-foreground">/ ${budgetData.monthly}</span></p>
            </div>
          </div>
          <span className={cn(
            "text-sm font-semibold px-3 py-1 rounded-full",
            pct > 90 ? "bg-destructive/10 text-destructive" : pct > 70 ? "bg-warning/10 text-warning" : "bg-success/10 text-success"
          )}>
            {pct}% used
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(pct, 100)}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={cn(
              "h-full rounded-full",
              pct > 90 ? "bg-destructive" : pct > 70 ? "bg-warning" : "bg-primary"
            )}
          />
        </div>
      </motion.div>

      {/* Category budgets */}
      <div className="grid gap-4">
        {budgetData.categories.map((cat, i) => {
          const catPct = Math.round((cat.spent / cat.budget) * 100);
          const isOver = cat.spent > cat.budget;
          return (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className={cn(
                "bg-card rounded-xl border p-5",
                isOver ? "border-destructive/30" : "border-border"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium text-card-foreground">{cat.name}</p>
                  <p className="text-xs text-muted-foreground">${cat.spent.toFixed(2)} of ${cat.budget} budget</p>
                </div>
                <div className="text-right">
                  <span className={cn(
                    "text-sm font-semibold",
                    isOver ? "text-destructive" : catPct > 80 ? "text-warning" : "text-success"
                  )}>
                    {catPct}%
                  </span>
                  {isOver && <p className="text-xs text-destructive">Over by ${(cat.spent - cat.budget).toFixed(2)}</p>}
                </div>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    isOver ? "bg-destructive" : catPct > 80 ? "bg-warning" : "bg-primary"
                  )}
                  style={{ width: `${Math.min(catPct, 100)}%` }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
