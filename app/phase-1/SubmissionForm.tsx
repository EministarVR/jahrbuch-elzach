"use client";

import { useState } from "react";
import GlowButton from "@/components/ui/GlowButton";
import { User, Phone } from "lucide-react";
import clsx from "clsx";
import { useFormStatus } from "react-dom";
import { CATEGORIES } from "@/lib/constants";

type Props = {
  action: (formData: FormData) => Promise<void>;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <GlowButton type="submit" variant="gradient" className="w-full sm:w-auto" loading={pending}>
      Absenden
    </GlowButton>
  );
}

export default function SubmissionForm({ action }: Props) {
  const [text, setText] = useState("");
  const max = 2000;
  const used = text.length;
  const ratio = Math.min(used / max, 1);
  const nearLimit = used > max * 0.9;

  return (
    <form action={action} className="space-y-5">
      <div>
        <label htmlFor="text" className="block text-sm font-medium mb-2 text-base-strong">
          Text
        </label>
        <textarea
          id="text"
          name="text"
          required
          maxLength={max}
          rows={8}
          placeholder="Dein Text..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={clsx(
            // Mobile: strukturierte Surface mit Verlauf, sichtbarer Rahmen/Schatten
            "textarea-base",
            // Desktop darf leicht transparenter wirken über Card
            "md:bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(255,255,255,0.8))] md:dark:bg-[linear-gradient(145deg,rgba(34,43,56,0.92),rgba(28,36,52,0.8))]"
          )}
        />
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className={clsx("text-base-muted", nearLimit && "text-amber-600 dark:text-amber-400")} aria-live="polite">
            {used}/{max} Zeichen
          </span>
          <span className="text-base-muted">Bis zu {max} Zeichen</span>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-slate-200/70 dark:bg-white/10 ring-1 ring-black/5 dark:ring-white/10 overflow-hidden">
          <div
            className={clsx(
              "h-full rounded-full transition-all duration-300",
              nearLimit
                ? "bg-[linear-gradient(90deg,rgba(245,158,11,0.9),rgba(251,191,36,0.9))]"
                : "bg-[linear-gradient(90deg,rgba(99,102,241,0.9),rgba(59,130,246,0.9))]"
            )}
            style={{ width: `${ratio * 100}%` }}
          />
        </div>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-2 text-base-strong">
          Kategorie
        </label>
        <select
          id="category"
          name="category"
          required
          className={clsx(
            "input-base",
            // Select braucht kein Icon-Padding links
            "pl-4 pr-10",
            "md:bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(255,255,255,0.8))] md:dark:bg-[linear-gradient(145deg,rgba(34,43,56,0.92),rgba(28,36,52,0.8))]"
          )}
          defaultValue=""
        >
          <option value="" disabled>
            Bitte auswählen...
          </option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2 text-base-strong">
            Name (optional)
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-600/70" />
            <input
              id="name"
              name="name"
              placeholder="Vor- und Nachname"
              className={clsx(
                "input-base pl-10",
                "md:bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(255,255,255,0.8))] md:dark:bg-[linear-gradient(145deg,rgba(34,43,56,0.92),rgba(28,36,52,0.8))]",
                "placeholder:text-base-muted"
              )}
            />
          </div>
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2 text-base-strong">
            Telefon (optional)
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-600/70" />
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              placeholder="z. B. 0176 12345678"
              className={clsx(
                "input-base pl-10",
                "md:bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(255,255,255,0.8))] md:dark:bg-[linear-gradient(145deg,rgba(34,43,56,0.92),rgba(28,36,52,0.8))]",
                "placeholder:text-base-muted"
              )}
            />
          </div>
        </div>
      </div>

      <div className="pt-2 flex items-center gap-3">
        <SubmitButton />
      </div>
    </form>
  );
}
