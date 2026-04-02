export interface Subscription {
  id: string;
  name: string;
  category: string;
  price: number;
  billingCycle: "monthly" | "yearly";
  startDate: string;
  renewalDate: string;
  paymentMethod: string;
  logo: string;
  color: string;
  active: boolean;
  currency: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  subscriptions: number;
  spending: number;
  joined: string;
  status: "active" | "banned";
  lastActive: string;
  country: string;
}

export interface ActivityEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  type: "add" | "cancel" | "edit" | "system" | "upgrade";
}
