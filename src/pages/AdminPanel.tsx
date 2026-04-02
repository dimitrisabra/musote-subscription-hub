import { motion } from "framer-motion";
import { Shield, Users, CreditCard, DollarSign, Ban, Trash2, ArrowUpCircle, Search, Globe, Clock, TrendingUp, Download } from "lucide-react";
import { useState } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminUsers, subscriptions } from "@/lib/mock-data";
import type { AdminUser } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const userGrowthData = [
  { month: "Aug", users: 12 }, { month: "Sep", users: 18 }, { month: "Oct", users: 24 },
  { month: "Nov", users: 29 }, { month: "Dec", users: 33 }, { month: "Jan", users: 36 },
  { month: "Feb", users: 39 }, { month: "Mar", users: 42 },
];

const revenueData = [
  { month: "Aug", revenue: 420 }, { month: "Sep", revenue: 680 }, { month: "Oct", revenue: 890 },
  { month: "Nov", revenue: 1120 }, { month: "Dec", revenue: 1540 }, { month: "Jan", revenue: 1780 },
  { month: "Feb", revenue: 2050 }, { month: "Mar", revenue: 2340 },
];

const countryData = [
  { country: "US", users: 14 }, { country: "UK", users: 7 }, { country: "DE", users: 5 },
  { country: "FR", users: 4 }, { country: "CA", users: 4 }, { country: "AU", users: 3 },
  { country: "JP", users: 2 }, { country: "BR", users: 1 }, { country: "IN", users: 1 }, { country: "NL", users: 1 },
];

export default function AdminPanel() {
  const [users, setUsers] = useState<AdminUser[]>(adminUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const handleBan = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === "banned" ? "active" as const : "banned" as const } : u));
    toast({ title: "User status updated" });
  };

  const handleDelete = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    toast({ title: "User deleted" });
  };

  const handlePromote = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, role: "admin" as const } : u));
    toast({ title: "User promoted to admin" });
  };

  const handleExportCSV = () => {
    const csv = "Name,Email,Role,Subscriptions,Spending,Joined,Status,Country\n" +
      users.map(u => `${u.name},${u.email},${u.role},${u.subscriptions},$${u.spending},${u.joined},${u.status},${u.country}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subtrackr-users.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported", description: "Users exported to CSV" });
  };

  const totalRevenue = users.reduce((s, u) => s + u.spending, 0);
  const totalSubs = users.reduce((s, u) => s + u.subscriptions, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-accent" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground text-sm mt-1">{users.length} total users · {users.filter(u => u.status === "active").length} active</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleExportCSV}>
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={String(users.length)} change="+8 this month" changeType="positive" icon={Users} index={0} />
        <StatCard title="Total Subscriptions" value={String(totalSubs)} change="Across all users" icon={CreditCard} index={1} />
        <StatCard title="Total Revenue" value={`$${totalRevenue.toFixed(0)}`} change="+12% this month" changeType="positive" icon={DollarSign} index={2} />
        <StatCard title="Banned Users" value={String(users.filter(u => u.status === "banned").length)} icon={Ban} index={3} />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">User Growth</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
              <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 3, fill: "hsl(var(--primary))" }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Revenue Trend ($)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} formatter={(v: number) => [`$${v}`, "Revenue"]} />
              <Bar dataKey="revenue" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Users by country */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-card-foreground">Users by Country</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {countryData.map(c => (
            <div key={c.country} className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full text-xs">
              <span className="font-semibold text-foreground">{c.country}</span>
              <span className="text-muted-foreground">{c.users}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search users..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Role" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="banned">Banned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-card-foreground">All Users ({filtered.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-medium text-muted-foreground">User</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Role</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden sm:table-cell">Subs</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Spending</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden lg:table-cell">Country</th>
                <th className="text-left p-4 font-medium text-muted-foreground hidden lg:table-cell">Last Active</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => (
                <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                        {user.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "text-xs font-medium px-2 py-1 rounded-full",
                      user.role === "admin" ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"
                    )}>{user.role}</span>
                  </td>
                  <td className="p-4 hidden sm:table-cell text-card-foreground">{user.subscriptions}</td>
                  <td className="p-4 hidden md:table-cell text-card-foreground">${user.spending.toFixed(2)}</td>
                  <td className="p-4 hidden lg:table-cell text-card-foreground">{user.country}</td>
                  <td className="p-4 hidden lg:table-cell text-muted-foreground text-xs">{user.lastActive}</td>
                  <td className="p-4">
                    <span className={cn(
                      "text-xs font-medium px-2 py-1 rounded-full",
                      user.status === "active" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                    )}>{user.status}</span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {user.role !== "admin" && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => handlePromote(user.id)} title="Promote">
                          <ArrowUpCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => handleBan(user.id)} title={user.status === "banned" ? "Unban" : "Ban"}>
                        <Ban className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(user.id)} title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
