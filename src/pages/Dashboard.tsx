import { DollarSign, CreditCard, TrendingUp, CalendarClock } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { CategoryChart } from "@/components/dashboard/CategoryChart";
import { UpcomingRenewals } from "@/components/dashboard/UpcomingRenewals";
import { InsightsPanel } from "@/components/dashboard/InsightsPanel";
import { subscriptions } from "@/lib/mock-data";

const activeSubs = subscriptions.filter(s => s.active);
const monthlyTotal = activeSubs.reduce((sum, s) => sum + (s.billingCycle === "monthly" ? s.price : s.price / 12), 0);
const yearlyTotal = monthlyTotal * 12;

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview of your subscription spending</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Monthly Spending" value={`$${monthlyTotal.toFixed(2)}`} change="+4.2% from last month" changeType="negative" icon={DollarSign} index={0} />
        <StatCard title="Yearly Estimate" value={`$${yearlyTotal.toFixed(0)}`} change="Based on current subs" icon={TrendingUp} index={1} />
        <StatCard title="Active Subscriptions" value={String(activeSubs.length)} change="1 inactive" changeType="neutral" icon={CreditCard} index={2} />
        <StatCard title="Next Renewal" value="Apr 1" change="3 renewals this week" changeType="neutral" icon={CalendarClock} index={3} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <SpendingChart />
        <CategoryChart />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <UpcomingRenewals />
        <InsightsPanel />
      </div>
    </div>
  );
}
