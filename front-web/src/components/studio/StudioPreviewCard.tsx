import Image from "next/image";
import { ImageIcon } from "lucide-react";
import formatPreviewDate from "@/components/studio/formatPreviewDate";

export default function StudioPreviewCard({
  safeImage,
  previewTitle,
  previewTags,
  date,
  time,
}: {
  safeImage: string;
  previewTitle: string;
  previewTags: string[];
  date: string;
  time: string;
}) {
  return (
    <div className="rounded-[28px] border border-black/8 bg-white/72 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.05)] backdrop-blur-md dark:border-white/10 dark:bg-[#120b05]/60 dark:shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
      <h3 className="mb-3 text-sm font-semibold text-gray-800 dark:text-white/80">
        Aperçu de la carte live
      </h3>

      <div className="overflow-hidden rounded-2xl border border-black/8 bg-black/[0.03] dark:border-white/10 dark:bg-white/[0.04]">
        <div className="relative h-44 w-full">
          {safeImage ? (
            <Image
              src={safeImage}
              alt={previewTitle}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50 text-orange-300 dark:from-orange-950/40 dark:to-orange-950/10 dark:text-orange-900/50">
              <ImageIcon className="mb-2 h-10 w-10" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-orange-400 dark:text-orange-800">
                Aperçu
              </span>
            </div>
          )}
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-orange-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-white" />
            LIVE
          </span>
        </div>

        <div className="space-y-2 p-4">
          <div className="flex flex-wrap gap-2">
            {previewTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-medium text-orange-700 ring-1 ring-orange-100 dark:bg-white/5 dark:text-white/80 dark:ring-white/10"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="line-clamp-2 text-sm font-semibold tracking-tight text-gray-900 break-words dark:text-gray-50">
            {previewTitle}
          </p>

          <p className="text-xs text-gray-500 dark:text-white/50">
            par Vous • {formatPreviewDate(date)}, {time}
          </p>
        </div>
      </div>
    </div>
  );
}