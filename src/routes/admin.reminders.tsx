import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { MessageSquare } from "lucide-react";

export const Route = createFileRoute("/admin/reminders")({
  component: Reminders,
});

function Reminders() {
  const reminders = useStore((s) => s.reminders);
  const update = useStore((s) => s.updateReminders);

  const preview = reminders.template
    .replace("{{name}}", "Sam")
    .replace("{{pickup}}", "Saturday at 12:00 PM");

  return (
    <div className="p-5 md:p-10 max-w-3xl">
      <span className="eyebrow block mb-2">Reminders</span>
      <h1 className="font-display text-4xl md:text-5xl uppercase leading-none mb-2">Text message reminders</h1>
      <p className="text-ink-soft mb-8">Decide when to nudge customers before their pickup.</p>

      <div className="bg-paper border border-rule p-5 space-y-4 mb-6">
        <Toggle
          label="Send the day before"
          hint="Goes out at 6pm the day before pickup."
          checked={reminders.dayBefore}
          onChange={(v) => update({ dayBefore: v })}
        />
        <div className="border-t border-rule pt-4">
          <label className="flex items-center justify-between gap-4 cursor-pointer mb-3">
            <span className="text-sm font-medium">Send a final reminder</span>
            <span className={`relative inline-block w-10 h-6 rounded-full ${reminders.hoursBefore !== null ? "bg-brand" : "bg-ink/15"}`}>
              <input type="checkbox" checked={reminders.hoursBefore !== null} onChange={(e) => update({ hoursBefore: e.target.checked ? 2 : null })} className="sr-only" />
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${reminders.hoursBefore !== null ? "translate-x-4" : ""}`} />
            </span>
          </label>
          {reminders.hoursBefore !== null && (
            <div className="flex items-center gap-3 text-sm">
              <input
                type="number"
                min={1}
                max={12}
                value={reminders.hoursBefore}
                onChange={(e) => update({ hoursBefore: Number(e.target.value) })}
                className="w-16 border border-ink/20 p-2"
              />
              <span className="text-ink-soft">hours before the pickup slot.</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-paper border border-rule p-5 mb-6">
        <p className="eyebrow mb-3">Message template</p>
        <p className="text-xs text-ink-soft mb-3">Use <code className="bg-ink/5 px-1">{`{{name}}`}</code> and <code className="bg-ink/5 px-1">{`{{pickup}}`}</code> as placeholders.</p>
        <textarea
          value={reminders.template}
          onChange={(e) => update({ template: e.target.value })}
          rows={4}
          className="w-full border border-ink/20 bg-paper p-3 font-body text-sm"
        />
      </div>

      <div className="bg-ink text-bg p-5 rounded">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="size-4" />
          <p className="text-xs uppercase tracking-widest font-bold">Preview</p>
        </div>
        <p className="text-sm leading-relaxed">{preview}</p>
      </div>

      <button onClick={() => toast.success("Reminder settings saved")} className="mt-8 bg-brand text-brand-ink px-7 py-3 font-bold uppercase text-xs tracking-[0.2em]">
        Save reminders
      </button>
    </div>
  );
}

function Toggle({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer">
      <span>
        <span className="text-sm font-medium block">{label}</span>
        {hint && <span className="text-xs text-ink-soft block mt-0.5">{hint}</span>}
      </span>
      <span className={`relative inline-block w-10 h-6 rounded-full ${checked ? "bg-brand" : "bg-ink/15"}`}>
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${checked ? "translate-x-4" : ""}`} />
      </span>
    </label>
  );
}
