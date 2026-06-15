import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useStore, fmtMoney, useCartTotal } from "@/lib/store";
import { useHydrated } from "@/lib/hydrate";
import { Check, Lock, CreditCard, Smartphone, Banknote } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [{ title: "Checkout — Dev's Kitchen" }, { name: "description", content: "Complete your pre-order." }],
  }),
  component: Checkout,
});

type Step = 1 | 2 | 3 | 4;

function Checkout() {
  const cart = useStore((s) => s.cart);
  const items = useStore((s) => s.items);
  const schedule = useStore((s) => s.schedule);
  const placeOrder = useStore((s) => s.placeOrder);
  const account = useStore((s) => s.account);
  const total = useCartTotal();
  const hydrated = useHydrated();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>(1);
  const [customer, setCustomer] = useState({
    name: account?.name ?? "",
    email: account?.email ?? "",
    phone: account?.phone ?? "",
  });
  const [pickupDayId, setPickupDayId] = useState(schedule.pickupDays[0].id);
  const [pickupSlotId, setPickupSlotId] = useState("");
  const [payment, setPayment] = useState<"card" | "applepay" | "cash">("card");

  if (!hydrated) return null;
  if (cart.length === 0) {
    return (
      <div className="px-5 max-w-3xl mx-auto py-20 text-center">
        <p>Your bag is empty.</p>
        <Link to="/menu" className="text-brand underline mt-4 inline-block">
          See the menu →
        </Link>
      </div>
    );
  }

  const day = schedule.pickupDays.find((d) => d.id === pickupDayId)!;
  const slot = day.slots.find((s) => s.id === pickupSlotId);

  function submit() {
    if (!slot) return;
    const order = placeOrder({ customer, pickupDayId, pickupSlotId, payment });
    navigate({ to: "/checkout/success", search: { id: order.id } });
  }

  const canNext: Record<Step, boolean> = {
    1: !!(customer.name && customer.email && customer.phone),
    2: !!pickupSlotId,
    3: true,
    4: true,
  };

  return (
    <div className="pb-20">
      {/* Progress */}
      <div className="border-b border-rule sticky top-[36px] z-30 bg-bg">
        <div className="max-w-4xl mx-auto px-5 md:px-10 py-3 flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-[0.2em]">
          {(["Contact", "Pickup", "Payment", "Review"] as const).map((label, i) => {
            const n = (i + 1) as Step;
            return (
              <div key={label} className={`flex items-center gap-2 ${n <= step ? "text-ink" : "text-ink-soft/50"}`}>
                <span
                  className={`w-5 h-5 inline-flex items-center justify-center text-[10px] ${n < step ? "bg-brand text-brand-ink" : n === step ? "border border-ink" : "border border-ink-soft/30"}`}
                >
                  {n < step ? <Check className="size-3" /> : n}
                </span>
                <span className="hidden sm:inline">{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_320px] gap-10 max-w-5xl mx-auto px-5 md:px-10 py-8">
        <div>
          {step === 1 && (
            <div>
              <span className="eyebrow block mb-3">Step 1 / Contact</span>
              <h1 className="font-display text-3xl md:text-4xl uppercase mb-2 leading-tight">Who's the order for?</h1>
              <p className="text-ink-soft mb-2 text-sm">Guest checkout — no account needed.</p>
              {!account && (
                <Link to="/auth" className="text-xs text-brand underline mb-6 inline-block">
                  Have an account? Sign in →
                </Link>
              )}
              <div className="space-y-4 mt-4 max-w-md">
                <Field label="Name" value={customer.name} onChange={(v) => setCustomer({ ...customer, name: v })} />
                <Field
                  label="Phone"
                  type="tel"
                  value={customer.phone}
                  onChange={(v) => setCustomer({ ...customer, phone: v })}
                  hint="For pickup reminders."
                />
                <Field
                  label="Email"
                  type="email"
                  value={customer.email}
                  onChange={(v) => setCustomer({ ...customer, email: v })}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <span className="eyebrow block mb-3">Step 2 / Pickup</span>
              <h1 className="font-display text-3xl md:text-4xl uppercase mb-2 leading-tight">When can you grab it?</h1>
              <p className="text-ink-soft mb-6 text-sm">Choose a pickup day, then a 30-minute window.</p>

              <div className="flex gap-2 mb-6">
                {schedule.pickupDays.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      setPickupDayId(d.id);
                      setPickupSlotId("");
                    }}
                    className={`px-4 py-3 text-xs font-bold uppercase tracking-widest border ${pickupDayId === d.id ? "bg-ink text-bg border-ink" : "border-ink/20 hover:border-ink"}`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-w-2xl">
                {day.slots.map((s) => {
                  const full = s.booked >= s.capacity;
                  const selected = pickupSlotId === s.id;
                  return (
                    <button
                      key={s.id}
                      disabled={full}
                      onClick={() => setPickupSlotId(s.id)}
                      className={`px-3 py-3 text-sm border text-left ${
                        selected
                          ? "bg-brand text-brand-ink border-brand"
                          : full
                            ? "border-ink/10 text-ink-soft/40 line-through cursor-not-allowed"
                            : "border-ink/20 hover:border-ink"
                      }`}
                    >
                      <span className="block font-medium">{s.label}</span>
                      <span className="block text-[10px] uppercase tracking-widest mt-1 opacity-70">
                        {full ? "Full" : `${s.capacity - s.booked} left`}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-ink-soft mt-6 max-w-md">
                📍 Pickup is at 1244 Harbor View Dr, Apt 4B, San Francisco. Detailed instructions in your confirmation.
              </p>
            </div>
          )}

          {step === 3 && (
            <div>
              <span className="eyebrow block mb-3">Step 3 / Payment</span>
              <h1 className="font-display text-3xl md:text-4xl uppercase mb-2 leading-tight">
                How would you like to pay?
              </h1>
              <p className="text-ink-soft mb-6 text-sm flex items-center gap-2">
                <Lock className="size-3" /> Secure checkout handled by a trusted payment provider.
              </p>

              <div className="space-y-3 max-w-md">
                {[
                  { id: "applepay" as const, label: "Apple Pay", icon: Smartphone, hint: "One-tap on your phone." },
                  {
                    id: "card" as const,
                    label: "Credit / Debit Card",
                    icon: CreditCard,
                    hint: "Visa, Mastercard, Amex.",
                  },
                  {
                    id: "cash" as const,
                    label: "Pay with Cash",
                    icon: Banknote,
                    hint: "Pay in cash at pickup. Order is reserved on submit.",
                  },
                ].map((opt) => {
                  const Icon = opt.icon;
                  const selected = payment === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setPayment(opt.id)}
                      className={`w-full flex items-start gap-4 p-4 text-left border ${selected ? "border-brand bg-brand/5" : "border-ink/15 hover:border-ink/40"}`}
                    >
                      <Icon className={`size-5 mt-0.5 ${selected ? "text-brand" : "text-ink-soft"}`} />
                      <div className="flex-1">
                        <p className="font-bold text-sm">{opt.label}</p>
                        <p className="text-xs text-ink-soft mt-0.5">{opt.hint}</p>
                      </div>
                      {selected && <Check className="size-4 text-brand" />}
                    </button>
                  );
                })}
              </div>

              {payment === "cash" && (
                <div className="mt-5 max-w-md bg-paper border border-ink/15 p-4 text-xs leading-relaxed">
                  <strong>Heads up:</strong> Bring exact change if possible. Payment is due at pickup — we'll have your
                  order packed and ready.
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div>
              <span className="eyebrow block mb-3">Step 4 / Review</span>
              <h1 className="font-display text-3xl md:text-4xl uppercase mb-6 leading-tight">Looks good?</h1>

              <div className="space-y-5 max-w-md text-sm">
                <ReviewRow label="Contact" onEdit={() => setStep(1)}>
                  <p>{customer.name}</p>
                  <p className="text-ink-soft">
                    {customer.phone} · {customer.email}
                  </p>
                </ReviewRow>
                <ReviewRow label="Pickup" onEdit={() => setStep(2)}>
                  <p>{day.label}</p>
                  <p className="text-ink-soft">{slot?.label}</p>
                </ReviewRow>
                <ReviewRow label="Payment" onEdit={() => setStep(3)}>
                  <p>{payment === "applepay" ? "Apple Pay" : payment === "card" ? "Card" : "Cash at pickup"}</p>
                </ReviewRow>
                <ReviewRow label="Items">
                  <ul className="space-y-1">
                    {cart.map((l) => {
                      const it = items.find((i) => i.id === l.itemId);
                      return it ? (
                        <li key={l.itemId} className="flex justify-between">
                          <span>
                            {l.qty}× {it.name}
                          </span>
                          <span>{fmtMoney(it.price * l.qty)}</span>
                        </li>
                      ) : null;
                    })}
                  </ul>
                </ReviewRow>
              </div>

              <div className="mt-8 max-w-md flex justify-between text-lg font-display uppercase pt-4 border-t border-ink/15">
                <span>Total</span>
                <span>{fmtMoney(total)}</span>
              </div>
            </div>
          )}

          {/* Nav */}
          <div className="flex gap-3 mt-10">
            {step > 1 && (
              <button
                onClick={() => setStep((step - 1) as Step)}
                className="border border-ink/20 px-6 py-3 font-bold uppercase text-xs tracking-[0.2em] hover:bg-ink/5"
              >
                ← Back
              </button>
            )}
            {step < 4 && (
              <button
                disabled={!canNext[step]}
                onClick={() => setStep((step + 1) as Step)}
                className="bg-brand text-brand-ink px-6 py-3 font-bold uppercase text-xs tracking-[0.2em] disabled:opacity-40 hover:brightness-110"
              >
                Continue →
              </button>
            )}
            {step === 4 && (
              <button
                onClick={submit}
                className="bg-brand text-brand-ink px-6 py-3 font-bold uppercase text-xs tracking-[0.2em]"
              >
                Place pre-order — {fmtMoney(total)}
              </button>
            )}
          </div>
        </div>

        <aside className="bg-paper border border-rule p-6 h-fit md:sticky md:top-28 order-first md:order-last">
          <p className="eyebrow mb-4">{schedule.weekLabel}</p>
          <div className="space-y-3 mb-5 text-sm">
            {cart.map((l) => {
              const it = items.find((i) => i.id === l.itemId);
              if (!it) return null;
              return (
                <div key={l.itemId} className="flex justify-between gap-3">
                  <span className="text-ink-soft">
                    {l.qty}× {it.name}
                  </span>
                  <span>{fmtMoney(it.price * l.qty)}</span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between pt-4 border-t border-ink/15 font-display text-lg uppercase">
            <span>Total</span>
            <span>{fmtMoney(total)}</span>
          </div>
          <p className="text-xs text-ink-soft mt-4 leading-relaxed">
            <Lock className="size-3 inline mr-1 -mt-0.5" />
            No surprise fees. Pickup is free.
          </p>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="eyebrow block mb-1.5">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-ink/20 bg-paper p-3 text-base font-body focus:outline-none focus:border-brand"
      />
      {hint && <span className="text-xs text-ink-soft mt-1 block">{hint}</span>}
    </label>
  );
}

function ReviewRow({ label, children, onEdit }: { label: string; children: React.ReactNode; onEdit?: () => void }) {
  return (
    <div className="border-b border-ink/10 pb-4">
      <div className="flex justify-between mb-1">
        <span className="eyebrow">{label}</span>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-[10px] font-bold uppercase tracking-widest text-brand hover:underline"
          >
            Edit
          </button>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}
