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
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [media, setMedia] = useState<{
    url: string;
    media_type: 'image'|'video'|'gif';
    mime: string;
    thumb_url: string | null;
    width: number | null;
    height: number | null;
    duration_ms: number | null;
  } | null>(null);

  const max = 2000;
  const used = text.length;
  const ratio = Math.min(used / max, 1);
  const nearLimit = used > max * 0.9;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/submissions/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || 'Upload fehlgeschlagen');
      }
      setMedia({
        url: data.url,
        media_type: data.media_type,
        mime: data.mime,
        thumb_url: data.thumb_url,
        width: data.width,
        height: data.height,
        duration_ms: data.duration_ms,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload fehlgeschlagen';
      setUploadError(msg);
      setMedia(null);
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={action} className="space-y-6">
      <div>
        <label
          htmlFor="text"
          className="block text-sm font-semibold mb-3 text-[#f5f1ed]"
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
              nearLimit ? "text-[#d97757]" : "text-[#8faf9d]"
            )}
            aria-live="polite"
          >
            {used} / {max} Zeichen
          </span>
          <span className="text-[#b8aea5]">
            {max - used} verbleibend
          </span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-[#e89a7a]/10 overflow-hidden shadow-inner">
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
          className="block text-sm font-semibold mb-3 text-[#f5f1ed]"
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
        <p className="mt-2 text-xs text-[#b8aea5]">
          Hilft uns, deinen Beitrag richtig einzuordnen
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold mb-3 text-[#f5f1ed]"
          >
            Name{" "}
            <span className="text-[#b8aea5] font-normal">
              (optional)
            </span>
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8faf9d] pointer-events-none" />
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
            className="block text-sm font-semibold mb-3 text-[#f5f1ed]"
          >
            Telefon{" "}
            <span className="text-[#b8aea5] font-normal">
              (optional)
            </span>
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8faf9d] pointer-events-none" />
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

      {/* Media Upload */}
      <div>
        <label className="block text-sm font-semibold mb-3 text-[#f5f1ed]">
          Foto, Video oder GIF hochladen <span className="text-[#b8aea5] font-normal">(optional)</span>
        </label>
        <input
          type="file"
          accept="image/*,video/mp4,video/webm,video/quicktime"
          onChange={handleFileChange}
          className="block text-sm text-[#b8aea5] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#e89a7a]/20 file:text-[#e89a7a] hover:file:bg-[#e89a7a]/30"
        />
        <p className="text-xs text-[#8faf9d] mt-2">Bilder bis 10MB, Videos bis 60MB. Erlaubt: JPG, PNG, WEBP, GIF, MP4, WEBM, MOV.</p>
        {uploadError && <div className="text-sm text-red-400 mt-2">{uploadError}</div>}
        {uploading && <div className="text-sm text-[#b8aea5] mt-2">Upload läuft...</div>}
        {media && (
          <div className="mt-3 rounded-lg border border-[#e89a7a]/20 p-3 bg-[#2a2520]/40">
            <div className="text-xs text-[#b8aea5] mb-2">Vorschau:</div>
            {media.media_type === 'video' ? (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video src={media.url} controls className="w-full max-h-64 rounded-md" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={media.url} alt="Upload Vorschau" className="max-h-64 rounded-md" />
            )}
          </div>
        )}
      </div>

      {/* Hidden fields for media */}
      {media && (
        <>
          <input type="hidden" name="media_url" value={media.url} />
          <input type="hidden" name="media_type" value={media.media_type} />
          <input type="hidden" name="media_mime" value={media.mime} />
          {media.thumb_url && <input type="hidden" name="media_thumb_url" value={media.thumb_url} />}
          {media.width && <input type="hidden" name="media_width" value={String(media.width)} />}
          {media.height && <input type="hidden" name="media_height" value={String(media.height)} />}
          {media.duration_ms && <input type="hidden" name="media_duration_ms" value={String(media.duration_ms)} />}
        </>
      )}

      <div className="pt-4 border-t border-[#e89a7a]/10">
        <SubmitButton />
      </div>
    </form>
  );
}
