import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import heroPasta from "@/assets/hero-pappardelle.jpg";
import dishFocaccia from "@/assets/dish-focaccia.jpg";
import dishBurrata from "@/assets/dish-burrata.jpg";
import dishRagu from "@/assets/dish-ragu.jpg";
import dishCake from "@/assets/dish-cake.jpg";
import dishVeg from "@/assets/dish-veg.jpg";

export type Category = { id: string; name: string; order: number };

export type Item = {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: string;
  available: boolean;
  soldOut: boolean;
  featured: boolean;
  popular: boolean;
  notes?: string;
};

export type PickupSlot = {
  id: string;
  label: string; // "11:00 — 11:30"
  capacity: number;
  booked: number;
};

export type PickupDay = {
  id: string;
  date: string; // ISO date "2026-06-20"
  label: string; // "Saturday, Jun 20"
  slots: PickupSlot[];
};

export type Schedule = {
  weekLabel: string;
  ordersOpenAt: string; // ISO
  ordersCloseAt: string; // ISO
  pickupDays: PickupDay[];
};

export type Business = {
  name: string;
  tagline: string;
  signatureDish: { name: string; price: number };
  story: string;
  ownerName: string;
  ownerPhoto: string;
  address: string;
  neighborhood: string;
  phone: string;
  instagram: string;
  email: string;
  hours: string;
};

export type CartLine = { itemId: string; qty: number; notes?: string };

export type Customer = {
  name: string;
  phone: string;
  email: string;
};

export type Order = {
  id: string;
  lines: CartLine[];
  customer: Customer;
  pickupDayId: string;
  pickupSlotId: string;
  payment: "card" | "applepay" | "cash";
  subtotal: number;
  total: number;
  createdAt: string;
  status: "received";
};

export type Reminders = {
  dayBefore: boolean;
  hoursBefore: number | null; // hours before pickup, e.g. 2
  template: string;
};

export type Account = { name: string; email: string; phone: string } | null;

// ---------- Seed data ----------
const cats: Category[] = [
  { id: "mains", name: "Mains", order: 1 },
  { id: "breads", name: "Breads & Sides", order: 2 },
  { id: "sweets", name: "Sweets", order: 3 },
];

const seedItems: Item[] = [
  {
    id: "pappardelle",
    name: "Hand-Cut Pappardelle",
    description: "Wide ribbons of fresh egg pasta, tossed in brown butter and sage. Serves one generously.",
    price: 24,
    categoryId: "mains",
    image: heroPasta,
    available: true,
    soldOut: false,
    featured: true,
    popular: true,
  },
  {
    id: "ragu",
    name: "Beef Ragù with Tagliatelle",
    description: "Eight-hour braised chuck in tomato and red wine, finished with parmesan.",
    price: 26,
    categoryId: "mains",
    image: dishRagu,
    available: true,
    soldOut: false,
    featured: true,
    popular: true,
  },
  {
    id: "veg",
    name: "Roasted Market Vegetables",
    description: "Whatever's best this week, roasted hot, with whipped lemon ricotta.",
    price: 16,
    categoryId: "mains",
    image: dishVeg,
    available: true,
    soldOut: false,
    featured: false,
    popular: false,
  },
  {
    id: "focaccia",
    name: "Rosemary Focaccia",
    description: "Slow-fermented, finished with garden rosemary and flaky sea salt.",
    price: 12,
    categoryId: "breads",
    image: dishFocaccia,
    available: true,
    soldOut: false,
    featured: true,
    popular: true,
  },
  {
    id: "burrata",
    name: "Burrata & Heirlooms",
    description: "Creamy burrata, late-summer tomatoes, basil oil, black pepper.",
    price: 18,
    categoryId: "breads",
    image: dishBurrata,
    available: true,
    soldOut: true,
    featured: false,
    popular: false,
  },
  {
    id: "cake",
    name: "Lemon Polenta Cake",
    description: "Gluten-free, syrup-soaked, with crème fraîche on the side.",
    price: 9,
    categoryId: "sweets",
    image: dishCake,
    available: true,
    soldOut: false,
    featured: false,
    popular: true,
  },
];

function isoFromNow(days: number, hour: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

const nextSaturday = () => {
  const d = new Date();
  const diff = (6 - d.getDay() + 7) % 7 || 7;
  d.setDate(d.getDate() + diff);
  return d;
};

const sat = nextSaturday();
const satLabel = sat.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
const satIso = sat.toISOString().slice(0, 10);

const sun = new Date(sat);
sun.setDate(sun.getDate() + 1);
const sunLabel = sun.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
const sunIso = sun.toISOString().slice(0, 10);

const seedSchedule: Schedule = {
  weekLabel: `Week of ${satLabel}`,
  ordersOpenAt: isoFromNow(-3, 9),
  ordersCloseAt: isoFromNow(2, 20), // Thu 8pm-ish
  pickupDays: [
    {
      id: "sat",
      date: satIso,
      label: satLabel,
      slots: [
        { id: "sat-1100", label: "11:00 — 11:30", capacity: 8, booked: 3 },
        { id: "sat-1130", label: "11:30 — 12:00", capacity: 8, booked: 6 },
        { id: "sat-1200", label: "12:00 — 12:30", capacity: 8, booked: 2 },
        { id: "sat-1230", label: "12:30 — 13:00", capacity: 8, booked: 8 },
        { id: "sat-1300", label: "13:00 — 13:30", capacity: 8, booked: 1 },
        { id: "sat-1330", label: "13:30 — 14:00", capacity: 8, booked: 0 },
      ],
    },
    {
      id: "sun",
      date: sunIso,
      label: sunLabel,
      slots: [
        { id: "sun-1100", label: "11:00 — 12:00", capacity: 10, booked: 4 },
        { id: "sun-1200", label: "12:00 — 13:00", capacity: 10, booked: 7 },
      ],
    },
  ],
};

const seedBusiness: Business = {
  name: "DEV'S\u00a0KITCHEN",
  tagline: "Hand-rolled pasta and slow-fermented bread, made one weekend at a time.",
  signatureDish: { name: "Hand-Cut Pappardelle", price: 24 },
  story:
    "Hi, I'm Dev. Dev's Kitchen started as Sunday dinners for friends and grew into a weekly thing. Every batch is made by hand in my home kitchen — small, intentional, and meant to be shared at the table.",
  ownerName: "Dev",
  ownerPhoto: "/owner",
  address: "1244 Harbor View Dr · Apt 4B",
  neighborhood: "San Francisco, CA",
  phone: "(415) 555-0142",
  instagram: "@Dev'skitchen_sf",
  email: "hello@Dev'skitchen.example",
  hours: "Pickup Saturdays 11–2pm",
};

const seedReminders: Reminders = {
  dayBefore: true,
  hoursBefore: 2,
  template:
    "Hi {{name}} — friendly reminder your Dev's Kitchen pickup is {{pickup}}. Address: 1244 Harbor View Dr, Apt 4B. See you soon! — Elena",
};

// ---------- Store ----------
type State = {
  categories: Category[];
  items: Item[];
  schedule: Schedule;
  business: Business;
  reminders: Reminders;
  cart: CartLine[];
  orders: Order[];
  account: Account;

  // cart
  addToCart: (itemId: string, qty?: number) => void;
  updateQty: (itemId: string, qty: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;

  // checkout
  placeOrder: (
    input: Omit<Order, "id" | "createdAt" | "status" | "lines" | "subtotal" | "total"> & { lines?: CartLine[] },
  ) => Order;

  // items
  saveItem: (item: Item) => void;
  deleteItem: (id: string) => void;
  duplicateItem: (id: string) => void;
  moveItem: (id: string, dir: -1 | 1) => void;
  toggleItem: (id: string, key: "soldOut" | "featured" | "available") => void;

  // schedule / business / reminders
  updateSchedule: (s: Partial<Schedule>) => void;
  updatePickupDay: (dayId: string, patch: Partial<PickupDay>) => void;
  updateBusiness: (b: Partial<Business>) => void;
  updateReminders: (r: Partial<Reminders>) => void;

  // account
  setAccount: (a: Account) => void;
};

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      categories: cats,
      items: seedItems,
      schedule: seedSchedule,
      business: seedBusiness,
      reminders: seedReminders,
      cart: [],
      orders: [],
      account: null,

      addToCart: (itemId, qty = 1) =>
        set((s) => {
          const existing = s.cart.find((l) => l.itemId === itemId);
          if (existing) {
            return { cart: s.cart.map((l) => (l.itemId === itemId ? { ...l, qty: l.qty + qty } : l)) };
          }
          return { cart: [...s.cart, { itemId, qty }] };
        }),
      updateQty: (itemId, qty) =>
        set((s) => ({
          cart:
            qty <= 0
              ? s.cart.filter((l) => l.itemId !== itemId)
              : s.cart.map((l) => (l.itemId === itemId ? { ...l, qty } : l)),
        })),
      removeFromCart: (itemId) => set((s) => ({ cart: s.cart.filter((l) => l.itemId !== itemId) })),
      clearCart: () => set({ cart: [] }),

      placeOrder: (input) => {
        const s = get();
        const lines = input.lines ?? s.cart;
        const subtotal = lines.reduce((sum, l) => {
          const it = s.items.find((i) => i.id === l.itemId);
          return sum + (it ? it.price * l.qty : 0);
        }, 0);
        const order: Order = {
          id: `o_${Date.now()}`,
          lines,
          customer: input.customer,
          pickupDayId: input.pickupDayId,
          pickupSlotId: input.pickupSlotId,
          payment: input.payment,
          subtotal,
          total: subtotal,
          createdAt: new Date().toISOString(),
          status: "received",
        };
        set((st) => ({ orders: [order, ...st.orders], cart: [] }));
        return order;
      },

      saveItem: (item) =>
        set((s) => {
          const exists = s.items.find((i) => i.id === item.id);
          return { items: exists ? s.items.map((i) => (i.id === item.id ? item : i)) : [...s.items, item] };
        }),
      deleteItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      duplicateItem: (id) =>
        set((s) => {
          const it = s.items.find((i) => i.id === id);
          if (!it) return s;
          const copy = { ...it, id: `${it.id}_copy_${Date.now()}`, name: `${it.name} (Copy)`, featured: false };
          return { items: [...s.items, copy] };
        }),
      moveItem: (id, dir) =>
        set((s) => {
          const items = [...s.items];
          const idx = items.findIndex((i) => i.id === id);
          const target = idx + dir;
          if (idx < 0 || target < 0 || target >= items.length) return s;
          [items[idx], items[target]] = [items[target], items[idx]];
          return { items };
        }),
      toggleItem: (id, key) =>
        set((s) => ({ items: s.items.map((i) => (i.id === id ? { ...i, [key]: !i[key] } : i)) })),

      updateSchedule: (patch) => set((s) => ({ schedule: { ...s.schedule, ...patch } })),
      updatePickupDay: (dayId, patch) =>
        set((s) => ({
          schedule: {
            ...s.schedule,
            pickupDays: s.schedule.pickupDays.map((d) => (d.id === dayId ? { ...d, ...patch } : d)),
          },
        })),
      updateBusiness: (patch) => set((s) => ({ business: { ...s.business, ...patch } })),
      updateReminders: (patch) => set((s) => ({ reminders: { ...s.reminders, ...patch } })),

      setAccount: (a) => set({ account: a }),
    }),
    {
      name: "Dev's-kitchen-v1",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : (undefined as unknown as Storage),
      ),
      // Reseed images if the persisted version stored stale src paths from a previous build.
      version: 1,
    },
  ),
);

// Helpers
export const fmtMoney = (n: number) => `$${n.toFixed(2)}`;
export const fmtMoneyShort = (n: number) => `$${n.toFixed(0)}`;

export const useCartCount = () => useStore((s) => s.cart.reduce((sum, l) => sum + l.qty, 0));
export const useCartTotal = () =>
  useStore((s) =>
    s.cart.reduce((sum, l) => {
      const it = s.items.find((i) => i.id === l.itemId);
      return sum + (it ? it.price * l.qty : 0);
    }, 0),
  );
