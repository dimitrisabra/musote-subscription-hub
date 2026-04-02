import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const [name, setName] = useState("Alex Johnson");
  const [email, setEmail] = useState("alex@example.com");
  const [notifications, setNotifications] = useState({ renewals: true, insights: true, marketing: false });

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account preferences</p>
      </div>

      {/* Profile */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <h2 className="font-semibold text-card-foreground">Profile</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Full Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={email} onChange={e => setEmail(e.target.value)} />
          </div>
        </div>
        <Button onClick={() => toast({ title: "Profile updated" })} className="gradient-primary text-primary-foreground border-0">
          Save Changes
        </Button>
      </div>

      {/* Notifications */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <h2 className="font-semibold text-card-foreground">Notifications</h2>
        <div className="space-y-4">
          {[
            { key: "renewals" as const, label: "Renewal Reminders", desc: "Get notified 3 days before renewals" },
            { key: "insights" as const, label: "Smart Insights", desc: "Receive saving recommendations" },
            { key: "marketing" as const, label: "Product Updates", desc: "News about new features" },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-card-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Switch
                checked={notifications[item.key]}
                onCheckedChange={v => setNotifications({ ...notifications, [item.key]: v })}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Plan */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <h2 className="font-semibold text-card-foreground">Subscription Plan</h2>
        <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div>
            <p className="font-semibold text-card-foreground">Pro Plan</p>
            <p className="text-sm text-muted-foreground">$9/month · Unlimited subscriptions</p>
          </div>
          <Button variant="outline" size="sm">Manage</Button>
        </div>
      </div>

      {/* Danger */}
      <div className="bg-card rounded-xl border border-destructive/30 p-6 space-y-4">
        <h2 className="font-semibold text-destructive">Danger Zone</h2>
        <p className="text-sm text-muted-foreground">Permanently delete your account and all data.</p>
        <Button variant="destructive" size="sm">Delete Account</Button>
      </div>
    </div>
  );
}
