import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Music4, ArrowRight, BarChart3, Shield, Zap, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: BarChart3, title: "Visual Analytics", desc: "Track spending patterns with beautiful charts and insights" },
  { icon: Shield, title: "Smart Alerts", desc: "Get notified before renewals and detect unused subscriptions" },
  { icon: Zap, title: "AI Insights", desc: "Intelligent recommendations to optimize your spending" },
  { icon: Music4, title: "All-in-One", desc: "Manage every subscription from Netflix to AWS in one place" },
];

const plans = [
  { name: "Free", price: "$0", features: ["Up to 5 subscriptions", "Basic analytics", "Email alerts"], cta: "Get Started", highlight: false },
  { name: "Pro", price: "$9", features: ["Unlimited subscriptions", "Advanced analytics", "Smart insights", "CSV export", "Priority support"], cta: "Start Free Trial", highlight: true },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Music4 className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">Musote</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="gradient-primary text-primary-foreground border-0">Sign up</Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-36 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30 mb-6">
              <Zap className="w-3 h-3" /> Now with Smart Insights
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
              <span className="text-primary-foreground">Take Control of</span>
              <br />
              <span className="text-gradient">Your Subscriptions</span>
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{ color: "hsl(218, 11%, 65%)" }}>
              Track, analyze, and optimize all your recurring payments in one beautiful dashboard. Save money with AI-powered insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/login">
                <Button size="lg" className="gradient-primary text-primary-foreground border-0 px-8 h-12 text-base font-semibold shadow-glow">
                  Start for Free <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="h-12 text-base border-border/50 bg-card/10 text-primary-foreground hover:bg-card/20">
                  View Demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Everything you need</h2>
          <p className="text-muted-foreground text-lg">to manage your subscriptions like a pro</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl border border-border p-6 hover:border-primary/30 hover:shadow-glow transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Simple Pricing</h2>
          <p className="text-muted-foreground text-lg">Start free, upgrade when you're ready</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl border p-8 ${
                plan.highlight
                  ? "border-primary bg-primary/5 shadow-glow"
                  : "border-border bg-card"
              }`}
            >
              <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/signup">
                <Button className={`w-full ${plan.highlight ? "gradient-primary text-primary-foreground border-0" : ""}`} variant={plan.highlight ? "default" : "outline"}>
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md gradient-primary flex items-center justify-center">
              <Music4 className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm text-foreground">Musote</span>
          </div>
          <p className="text-xs text-muted-foreground">(c) 2026 Musote. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
