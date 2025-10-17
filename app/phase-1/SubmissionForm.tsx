"use client";

import { useState } from "react";
import GlowButton from "@/components/ui/GlowButton";
import { User, Phone, Send } from "lucide-react";
import clsx from "clsx";
import { useFormStatus } from "react-dom";
import { CATEGORIES } from "@/lib/constants";

type Props = {
  action: (formData: FormData) => Promise<void>;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <GlowButton
      type="submit"
      variant="gradient"
      className="w-full sm:w-auto px-8"
      loading={pending}
      iconLeft={<Send className="h-4 w-4" />}
    >
      {pending ? "Wird gesendet..." : "Absenden"}
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
    <form action={action} className="space-y-6">
      <div>
        <label
          htmlFor="text"
          className="block text-sm font-semibold mb-3 text-[#2a2520] dark:text-[#f5f1ed]"
        >
          Dein Text *
        </label>
        <textarea
          id="text"
          name="text"
          required
          maxLength={max}
          rows={10}
          placeholder="Schreib hier deine Geschichte, Erinnerung oder was auch immer du teilen möchtest..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="textarea-base"
        />
        <div className="mt-3 flex items-center justify-between text-xs">
          <span
            className={clsx(
              "font-medium transition-colors",
              nearLimit
                ? "text-[#c96846] dark:text-[#d97757]"
                : "text-[#7a9b88] dark:text-[#8faf9d]"
            )}
            aria-live="polite"
          >
            {used} / {max} Zeichen
          </span>
          <span className="text-[#6b635a] dark:text-[#b8aea5]">
            {max - used} verbleibend
          </span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-[#d97757]/10 dark:bg-[#e89a7a]/10 overflow-hidden shadow-inner">
          <div
            className={clsx(
              "h-full rounded-full transition-all duration-500 ease-out",
              nearLimit
                ? "bg-gradient-to-r from-[#c96846] to-[#d97757] shadow-lg shadow-[#c96846]/30"
                : "bg-gradient-to-r from-[#7a9b88] to-[#8faf9b] shadow-lg shadow-[#7a9b88]/20"
            )}
            style={{ width: `${ratio * 100}%` }}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-semibold mb-3 text-[#2a2520] dark:text-[#f5f1ed]"
        >
          Kategorie *
        </label>
        <select
          id="category"
          name="category"
          required
          className="input-base"
          defaultValue=""
        >
          <option value="" disabled>
            Wähle eine Kategorie aus...
          </option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs text-[#6b635a] dark:text-[#b8aea5]">
          Hilft uns, deinen Beitrag richtig einzuordnen
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold mb-3 text-[#2a2520] dark:text-[#f5f1ed]"
          >
            Name{" "}
            <span className="text-[#6b635a] dark:text-[#b8aea5] font-normal">
              (optional)
            </span>
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#7a9b88] dark:text-[#8faf9d] pointer-events-none" />
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Max Mustermann"
              className="input-base pl-12"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-semibold mb-3 text-[#2a2520] dark:text-[#f5f1ed]"
          >
            Telefon{" "}
            <span className="text-[#6b635a] dark:text-[#b8aea5] font-normal">
              (optional)
            </span>
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#7a9b88] dark:text-[#8faf9d] pointer-events-none" />
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+49 123 456789"
              className="input-base pl-12"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-[#d97757]/10 dark:border-[#e89a7a]/10">
        <SubmitButton />
      </div>
    </form>
  );
}
