import { AdminUser, Subscription } from "./types";

// ─── Random Users (30+) ───
const firstNames = ["James","Emma","Liam","Olivia","Noah","Ava","William","Sophia","Benjamin","Isabella","Mason","Mia","Ethan","Charlotte","Alexander","Amelia","Henry","Harper","Sebastian","Evelyn","Jack","Abigail","Daniel","Emily","Michael","Luna","Owen","Camila","Lucas","Aria","Mateo","Scarlett","Aiden","Penelope","David","Layla","Joseph","Chloe","Jackson","Riley","Leo","Zoey","Gabriel","Nora","Samuel","Lily","Carter","Eleanor","Jayden","Hannah"];
const lastNames = ["Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Rodriguez","Martinez","Hernandez","Lopez","Gonzalez","Wilson","Anderson","Thomas","Taylor","Moore","Jackson","Martin","Lee","Perez","Thompson","White","Harris","Sanchez","Clark","Ramirez","Lewis","Robinson","Walker","Young","Allen","King","Wright","Scott","Torres","Nguyen","Hill","Flores","Green","Adams","Nelson","Baker","Hall","Rivera","Campbell","Mitchell","Carter"];

const statuses: ("active" | "banned")[] = ["active", "active", "active", "active", "active", "active", "active", "active", "active", "banned"];
const roles: ("user" | "admin")[] = ["user", "user", "user", "user", "user", "user", "user", "user", "user", "admin"];

function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split("T")[0];
}

function generateUsers(count: number): AdminUser[] {
  const users: AdminUser[] = [];
  for (let i = 0; i < count; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[i % lastNames.length];
    users.push({
      id: `u${i + 1}`,
      name: `${fn} ${ln}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@example.com`,
      role: roles[i % roles.length],
      subscriptions: Math.floor(Math.random() * 15) + 1,
      spending: Math.round((Math.random() * 500 + 10) * 100) / 100,
      joined: randomDate(new Date("2023-01-01"), new Date("2026-03-01")),
      status: statuses[i % statuses.length],
      lastActive: randomDate(new Date("2026-03-01"), new Date("2026-03-31")),
      country: ["US", "UK", "DE", "FR", "CA", "AU", "JP", "BR", "IN", "NL"][i % 10],
    });
  }
  return users;
}

export const adminUsers: AdminUser[] = generateUsers(42);

// ─── Subscriptions ───
export const subscriptions: Subscription[] = [
  { id: "1", name: "Netflix", category: "Entertainment", price: 15.99, billingCycle: "monthly", startDate: "2024-01-15", renewalDate: "2026-04-15", paymentMethod: "Visa •••• 4242", logo: "🎬", color: "#E50914", active: true, currency: "USD" },
  { id: "2", name: "Spotify", category: "Entertainment", price: 9.99, billingCycle: "monthly", startDate: "2023-06-01", renewalDate: "2026-04-01", paymentMethod: "Visa •••• 4242", logo: "🎵", color: "#1DB954", active: true, currency: "USD" },
  { id: "3", name: "Figma", category: "SaaS", price: 12.00, billingCycle: "monthly", startDate: "2024-03-10", renewalDate: "2026-04-10", paymentMethod: "Mastercard •••• 5555", logo: "🎨", color: "#A259FF", active: true, currency: "USD" },
  { id: "4", name: "AWS", category: "SaaS", price: 150.00, billingCycle: "monthly", startDate: "2023-01-01", renewalDate: "2026-04-01", paymentMethod: "Visa •••• 4242", logo: "☁️", color: "#FF9900", active: true, currency: "USD" },
  { id: "5", name: "Gym Membership", category: "Fitness", price: 49.99, billingCycle: "monthly", startDate: "2024-09-01", renewalDate: "2026-04-01", paymentMethod: "Visa •••• 4242", logo: "💪", color: "#FF6B6B", active: true, currency: "USD" },
  { id: "6", name: "ChatGPT Plus", category: "SaaS", price: 20.00, billingCycle: "monthly", startDate: "2024-02-01", renewalDate: "2026-04-01", paymentMethod: "Mastercard •••• 5555", logo: "🤖", color: "#10A37F", active: true, currency: "USD" },
  { id: "7", name: "iCloud", category: "Storage", price: 2.99, billingCycle: "monthly", startDate: "2022-08-15", renewalDate: "2026-04-15", paymentMethod: "Visa •••• 4242", logo: "☁️", color: "#3693F5", active: true, currency: "USD" },
  { id: "8", name: "YouTube Premium", category: "Entertainment", price: 13.99, billingCycle: "monthly", startDate: "2024-05-20", renewalDate: "2026-04-20", paymentMethod: "Visa •••• 4242", logo: "📺", color: "#FF0000", active: true, currency: "USD" },
  { id: "9", name: "Adobe CC", category: "SaaS", price: 599.88, billingCycle: "yearly", startDate: "2024-01-01", renewalDate: "2027-01-01", paymentMethod: "Mastercard •••• 5555", logo: "🎯", color: "#FF0000", active: true, currency: "USD" },
  { id: "10", name: "Notion", category: "SaaS", price: 8.00, billingCycle: "monthly", startDate: "2024-04-01", renewalDate: "2026-04-01", paymentMethod: "Visa •••• 4242", logo: "📝", color: "#000000", active: false, currency: "USD" },
  { id: "11", name: "Slack", category: "SaaS", price: 7.25, billingCycle: "monthly", startDate: "2024-06-01", renewalDate: "2026-04-01", paymentMethod: "Visa •••• 4242", logo: "💬", color: "#4A154B", active: true, currency: "USD" },
  { id: "12", name: "Dropbox", category: "Storage", price: 11.99, billingCycle: "monthly", startDate: "2023-11-15", renewalDate: "2026-04-15", paymentMethod: "Mastercard •••• 5555", logo: "📦", color: "#0061FF", active: true, currency: "USD" },
  { id: "13", name: "Disney+", category: "Entertainment", price: 7.99, billingCycle: "monthly", startDate: "2024-08-01", renewalDate: "2026-04-01", paymentMethod: "Visa •••• 4242", logo: "🏰", color: "#113CCF", active: true, currency: "USD" },
  { id: "14", name: "LinkedIn Premium", category: "SaaS", price: 29.99, billingCycle: "monthly", startDate: "2024-02-10", renewalDate: "2026-04-10", paymentMethod: "Visa •••• 4242", logo: "💼", color: "#0077B5", active: true, currency: "USD" },
  { id: "15", name: "Headspace", category: "Health", price: 12.99, billingCycle: "monthly", startDate: "2025-01-01", renewalDate: "2026-04-01", paymentMethod: "Mastercard •••• 5555", logo: "🧘", color: "#F47D31", active: true, currency: "USD" },
  { id: "16", name: "GitHub Pro", category: "SaaS", price: 4.00, billingCycle: "monthly", startDate: "2023-03-01", renewalDate: "2026-04-01", paymentMethod: "Visa •••• 4242", logo: "🐙", color: "#333333", active: true, currency: "USD" },
  { id: "17", name: "Duolingo Plus", category: "Education", price: 6.99, billingCycle: "monthly", startDate: "2025-02-01", renewalDate: "2026-04-01", paymentMethod: "Visa •••• 4242", logo: "🦉", color: "#58CC02", active: false, currency: "USD" },
  { id: "18", name: "Grammarly", category: "SaaS", price: 12.00, billingCycle: "monthly", startDate: "2024-07-15", renewalDate: "2026-04-15", paymentMethod: "Mastercard •••• 5555", logo: "✍️", color: "#15C39A", active: true, currency: "USD" },
];

export const categories = ["Entertainment", "SaaS", "Fitness", "Storage", "Education", "Health", "Finance"];

export const monthlySpendingData = [
  { month: "Jul", amount: 210 },
  { month: "Aug", amount: 228 },
  { month: "Sep", amount: 235 },
  { month: "Oct", amount: 245 },
  { month: "Nov", amount: 268 },
  { month: "Dec", amount: 290 },
  { month: "Jan", amount: 275 },
  { month: "Feb", amount: 282 },
  { month: "Mar", amount: 295 },
];

export const categorySpendingData = [
  { name: "Entertainment", value: 47.96, fill: "hsl(160, 84%, 39%)" },
  { name: "SaaS", value: 243.24, fill: "hsl(262, 83%, 58%)" },
  { name: "Fitness", value: 49.99, fill: "hsl(32, 95%, 54%)" },
  { name: "Storage", value: 14.98, fill: "hsl(197, 87%, 52%)" },
  { name: "Health", value: 12.99, fill: "hsl(340, 75%, 55%)" },
  { name: "Education", value: 6.99, fill: "hsl(120, 60%, 45%)" },
];

export const insights = [
  { type: "warning" as const, message: "You have 4 entertainment subscriptions totaling $47.96/mo — consider consolidating", saving: 13.99 },
  { type: "info" as const, message: "SaaS tools account for 63% of your monthly spending", saving: 0 },
  { type: "success" as const, message: "Switching Netflix to yearly could save $19/year", saving: 19 },
  { type: "warning" as const, message: "Notion hasn't been used in 30 days — consider canceling", saving: 8 },
  { type: "warning" as const, message: "Duolingo Plus hasn't been used in 45 days", saving: 6.99 },
  { type: "info" as const, message: "You have duplicate cloud storage: iCloud + Dropbox ($14.98/mo)", saving: 11.99 },
  { type: "success" as const, message: "Your gym membership usage is high — great value!", saving: 0 },
];

export const upcomingRenewals = subscriptions
  .filter(s => s.active)
  .sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime())
  .slice(0, 7);

export const activityLog = [
  { id: "a1", action: "Added Netflix subscription", user: "Alex Johnson", timestamp: "2026-03-31 09:15", type: "add" as const },
  { id: "a2", action: "Cancelled Notion subscription", user: "Alex Johnson", timestamp: "2026-03-30 14:22", type: "cancel" as const },
  { id: "a3", action: "Updated AWS billing to yearly", user: "Alex Johnson", timestamp: "2026-03-29 11:05", type: "edit" as const },
  { id: "a4", action: "New user registered: Emma Wilson", user: "System", timestamp: "2026-03-28 08:30", type: "system" as const },
  { id: "a5", action: "Upgraded to Pro plan", user: "Sarah Chen", timestamp: "2026-03-27 16:45", type: "upgrade" as const },
  { id: "a6", action: "Added Headspace subscription", user: "Alex Johnson", timestamp: "2026-03-26 10:12", type: "add" as const },
  { id: "a7", action: "Password changed", user: "Mike Ross", timestamp: "2026-03-25 13:00", type: "system" as const },
  { id: "a8", action: "User banned: Emma Wilson", user: "Admin", timestamp: "2026-03-24 09:30", type: "system" as const },
  { id: "a9", action: "Exported subscription data (CSV)", user: "Alex Johnson", timestamp: "2026-03-23 15:20", type: "system" as const },
  { id: "a10", action: "Bulk imported 3 subscriptions", user: "Benjamin Williams", timestamp: "2026-03-22 11:45", type: "add" as const },
];

export const budgetData = {
  monthly: 350,
  spent: 295,
  categories: [
    { name: "Entertainment", budget: 60, spent: 47.96 },
    { name: "SaaS", budget: 200, spent: 243.24 },
    { name: "Fitness", budget: 50, spent: 49.99 },
    { name: "Storage", budget: 20, spent: 14.98 },
    { name: "Health", budget: 20, spent: 12.99 },
  ],
};

export const currencies: Record<string, { symbol: string; rate: number }> = {
  USD: { symbol: "$", rate: 1 },
  EUR: { symbol: "€", rate: 0.92 },
  GBP: { symbol: "£", rate: 0.79 },
  JPY: { symbol: "¥", rate: 149.5 },
  CAD: { symbol: "C$", rate: 1.36 },
  AUD: { symbol: "A$", rate: 1.53 },
  INR: { symbol: "₹", rate: 83.12 },
};
