import { useState } from "react";
import { ExternalLink } from "lucide-react";

export type ImageCardProps = {
  url: string;
  index: number;
};

export function ImageCard({ url, index }: ImageCardProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    "loading"
  );

  return (
    <div className="glass-panel rounded-2xl overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white">
            {index + 1}
          </span>
          单张图片预览
        </div>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-slate-500 hover:text-slate-900 inline-flex items-center gap-1"
        >
          打开原图
          <ExternalLink size={14} />
        </a>
      </div>
      <div className="relative aspect-[3/4] bg-slate-50">
        {status === "loading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 text-sm">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
            正在加载…
          </div>
        )}
        {status === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-red-400 text-sm gap-2 px-3 text-center">
            <span>图片加载失败</span>
            <code className="text-xs text-red-500 break-all">{url}</code>
          </div>
        )}
        <img
          src={url}
          alt={`解析出的图片 ${index + 1}`}
          className={`h-full w-full object-cover transition-opacity duration-500 ${
            status === "loaded" ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
        />
      </div>
      <div className="px-4 py-3 text-xs text-slate-500 border-t border-slate-100 break-all">
        {url}
      </div>
    </div>
  );
}
