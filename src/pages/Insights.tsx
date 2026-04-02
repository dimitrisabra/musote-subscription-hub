import { InsightsPanel } from "@/components/dashboard/InsightsPanel";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { subscriptions } from "@/lib/mock-data";

const topSubs = [...subscriptions]
  .filter(s => s.active && s.billingCycle === "monthly")
  .sort((a, b) => b.price - a.price)
  .slice(0, 6)
  .map(s => ({ name: s.name, amount: s.price }));

export default function Insights() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Smart Insights</h1>
        <p className="text-muted-foreground text-sm mt-1">AI-powered recommendations to optimize your spending</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <InsightsPanel />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl border border-border p-5"
        >
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Top Subscriptions by Cost</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topSubs} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={80} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                formatter={(v: number) => [`$${v.toFixed(2)}`, "Cost"]}
              />
              <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
