import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Trash2, Edit, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { subscriptions as initialSubs, categories } from "@/lib/mock-data";
import type { Subscription } from "@/lib/types";
import { toast } from "@/hooks/use-toast";

export default function Subscriptions() {
  const [subs, setSubs] = useState<Subscription[]>(initialSubs);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);
  const [form, setForm] = useState<{ name: string; category: string; price: string; billingCycle: "monthly" | "yearly"; paymentMethod: string }>({ name: "", category: "Entertainment", price: "", billingCycle: "monthly", paymentMethod: "" });

  const filtered = subs.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "all" || s.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const resetForm = () => {
    setForm({ name: "", category: "Entertainment", price: "", billingCycle: "monthly", paymentMethod: "" });
    setEditingSub(null);
  };

  const openAddDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (sub: Subscription) => {
    setEditingSub(sub);
    setForm({
      name: sub.name,
      category: sub.category,
      price: sub.price.toString(),
      billingCycle: sub.billingCycle,
      paymentMethod: sub.paymentMethod,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.price) return;

    if (editingSub) {
      setSubs(subs.map(s => s.id === editingSub.id ? {
        ...s,
        name: form.name,
        category: form.category,
        price: parseFloat(form.price),
        billingCycle: form.billingCycle,
        paymentMethod: form.paymentMethod || s.paymentMethod,
      } : s));
      toast({ title: "Subscription updated", description: `${form.name} has been updated.` });
    } else {
      const newSub: Subscription = {
        id: Date.now().toString(),
        name: form.name,
        category: form.category,
        price: parseFloat(form.price),
        billingCycle: form.billingCycle,
        startDate: new Date().toISOString().split("T")[0],
        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        paymentMethod: form.paymentMethod || "Card",
        logo: "📦",
        color: "#6366f1",
        active: true,
        currency: "USD",
      };
      setSubs([newSub, ...subs]);
      toast({ title: "Subscription added", description: `${form.name} has been added.` });
    }

    resetForm();
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setSubs(subs.filter(s => s.id !== id));
    toast({ title: "Deleted", description: "Subscription removed." });
  };

  const handleExportCSV = () => {
    const csv = "Name,Category,Price,Billing,Start,Renewal,Active\n" +
      subs.map(s => `${s.name},${s.category},${s.price},${s.billingCycle},${s.startDate},${s.renewalDate},${s.active}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "subscriptions.csv"; a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported!", description: "CSV downloaded" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Subscriptions</h1>
          <p className="text-muted-foreground text-sm mt-1">{subs.length} total · {subs.filter(s => s.active).length} active</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground border-0" onClick={openAddDialog}>
                <Plus className="w-4 h-4 mr-2" /> Add Subscription
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingSub ? "Edit Subscription" : "Add Subscription"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Name</Label>
                  <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Netflix" />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Price</Label>
                    <Input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="9.99" />
                  </div>
                  <div>
                    <Label>Billing Cycle</Label>
                    <Select value={form.billingCycle} onValueChange={v => setForm({ ...form, billingCycle: v as "monthly" | "yearly" })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Payment Method</Label>
                  <Input value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })} placeholder="Visa •••• 4242" />
                </div>
                <Button onClick={handleSave} className="w-full gradient-primary text-primary-foreground border-0">
                  {editingSub ? "Save Changes" : "Add Subscription"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((sub, i) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: i * 0.03 }}
              className="bg-card rounded-xl border border-border p-4 flex items-center gap-4 hover:border-primary/20 transition-colors"
            >
              <span className="text-2xl">{sub.logo}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-card-foreground truncate">{sub.name}</p>
                  {!sub.active && <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Inactive</span>}
                </div>
                <p className="text-xs text-muted-foreground">{sub.category} · {sub.billingCycle} · {sub.paymentMethod}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-semibold text-card-foreground">${sub.price.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">/{sub.billingCycle === "monthly" ? "mo" : "yr"}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" className="text-muted-foreground h-8 w-8" onClick={() => openEditDialog(sub)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => handleDelete(sub.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
