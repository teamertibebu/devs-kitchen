import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/schedule")({
  component: Schedule,
});

function Schedule() {
  const schedule = useStore((s) => s.schedule);
  const updateSchedule = useStore((s) => s.updateSchedule);
  const updatePickupDay = useStore((s) => s.updatePickupDay);

  return (
    <div className="p-5 md:p-10 max-w-4xl">
      <span className="eyebrow block mb-2">Schedule</span>
      <h1 className="font-display text-4xl md:text-5xl uppercase leading-none mb-2">Pre-order window</h1>
      <p className="text-ink-soft mb-8">Set when ordering opens and closes, and the pickup days for {schedule.weekLabel}.</p>

      <div className="bg-paper border border-rule p-5 md:p-6 mb-6">
        <p className="eyebrow mb-4">Ordering window</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="eyebrow block mb-1.5">Opens</span>
            <input
              type="datetime-local"
              value={schedule.ordersOpenAt.slice(0, 16)}
              onChange={(e) => updateSchedule({ ordersOpenAt: new Date(e.target.value).toISOString() })}
              className="w-full border border-ink/20 bg-paper p-3 font-body"
            />
          </label>
          <label className="block">
            <span className="eyebrow block mb-1.5">Closes</span>
            <input
              type="datetime-local"
              value={schedule.ordersCloseAt.slice(0, 16)}
              onChange={(e) => updateSchedule({ ordersCloseAt: new Date(e.target.value).toISOString() })}
              className="w-full border border-ink/20 bg-paper p-3 font-body"
            />
          </label>
        </div>
        <label className="block mt-4">
          <span className="eyebrow block mb-1.5">Week label</span>
          <input value={schedule.weekLabel} onChange={(e) => updateSchedule({ weekLabel: e.target.value })} className="w-full border border-ink/20 bg-paper p-3 font-body" />
        </label>
      </div>

      <div className="space-y-5">
        {schedule.pickupDays.map((day) => (
          <div key={day.id} className="bg-paper border border-rule p-5">
            <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
              <div>
                <p className="eyebrow mb-1">Pickup day</p>
                <input value={day.label} onChange={(e) => updatePickupDay(day.id, { label: e.target.value })} className="font-display text-xl uppercase border-b border-ink/20 bg-transparent focus:outline-none focus:border-brand" />
              </div>
            </div>
            <p className="eyebrow mb-3">Time slots</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {day.slots.map((slot) => (
                <div key={slot.id} className="border border-rule p-3">
                  <input
                    value={slot.label}
                    onChange={(e) => updatePickupDay(day.id, { slots: day.slots.map((s) => s.id === slot.id ? { ...s, label: e.target.value } : s) })}
                    className="w-full text-sm font-medium bg-transparent focus:outline-none border-b border-transparent focus:border-brand"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] uppercase tracking-widest text-ink-soft">Capacity</span>
                    <input
                      type="number"
                      value={slot.capacity}
                      onChange={(e) => updatePickupDay(day.id, { slots: day.slots.map((s) => s.id === slot.id ? { ...s, capacity: Number(e.target.value) } : s) })}
                      className="w-14 text-sm border border-ink/15 px-2 py-1"
                    />
                    <span className="text-[10px] text-ink-soft">· {slot.booked} booked</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => toast.success("Schedule saved")} className="mt-8 bg-brand text-brand-ink px-7 py-3 font-bold uppercase text-xs tracking-[0.2em]">Save schedule</button>
    </div>
  );
}
