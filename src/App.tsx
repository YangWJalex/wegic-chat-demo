import { useMemo, useState } from "react";
import { Sparkles, Wand2, RotateCw, AlertCircle } from "lucide-react";
import { ImageCard } from "./components/ImageCard";

type ParseResult = {
  urls: string[];
  invalid: string[];
};

const defaultInput = `https://cdn.wegic.ai/assets/onepage/uploads/image/2025/12/15/01KCGC0PAXSAXH1RMBYYZPRACJ.jpg?imageMogr2/format/webp
https://cdn.wegic.ai/assets/onepage/uploads/image/2025/12/15/01KCGC0PAXHHYHWJ02W393YXXP.jpg?imageMogr2/format/webp
https://cdn.wegic.ai/assets/onepage/uploads/image/2025/12/15/01KCGC0PAXM68BHFNJY2040A4Q.jpg?imageMogr2/format/webp
https://cdn.wegic.ai/assets/onepage/uploads/image/2025/12/15/01KCGC0PAXNWWF9YW143PHP2SP.jpg?imageMogr2/format/webp
https://cdn.wegic.ai/assets/onepage/uploads/image/2025/12/15/01KCGC0PAXK5S07F5Z1NMNXP0K.jpg?imageMogr2/format/webp
https://cdn.wegic.ai/assets/onepage/uploads/image/2025/12/15/01KCGC0PAXXC58VEMZQKXA8NTB.jpg?imageMogr2/format/webp
https://cdn.wegic.ai/assets/onepage/uploads/image/2025/12/15/01KCGC0PAX6PH9D2PY7QVJ99X9.jpg?imageMogr2/format/webp
https://cdn.wegic.ai/assets/onepage/uploads/image/2025/12/15/01KCGC0PAXQF85AEK9Y32DYHEF.jpg?imageMogr2/format/webp
https://cdn.wegic.ai/assets/onepage/uploads/image/2025/12/15/01KCGC0PAXAKQQP4NHYS61AQC0.jpg?imageMogr2/format/webp`;

const parseImageUrls = (raw: string): ParseResult => {
  const entries = raw
    .split(/[\n\s]+/)
    .map((item) => item.trim())
    .filter(Boolean);

  const seen = new Set<string>();
  const urls: string[] = [];
  const invalid: string[] = [];

  for (const entry of entries) {
    try {
      const parsed = new URL(entry);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        throw new Error("Unsupported protocol");
      }
      const normalized = parsed.toString();
      if (!seen.has(normalized)) {
        seen.add(normalized);
        urls.push(normalized);
      }
    } catch (err) {
      invalid.push(entry);
    }
  }

  return { urls, invalid };
};

function App() {
  const [input, setInput] = useState(defaultInput);
  const [result, setResult] = useState<ParseResult>(() =>
    parseImageUrls(defaultInput)
  );

  const stats = useMemo(
    () => ({
      total: result.urls.length,
      invalid: result.invalid.length,
    }),
    [result]
  );

  const handleParse = () => {
    setResult(parseImageUrls(input));
  };

  const handleReset = () => {
    setInput(defaultInput);
    setResult(parseImageUrls(defaultInput));
  };

  return (
    <main className="min-h-screen px-4 py-10 text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="glass-panel rounded-3xl p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
                <Sparkles size={14} />
                产品需求 · 图片拆分与加载
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold sm:text-3xl">
                  一组 URL，拆成单张图片，逐一加载展示
                </h1>
                <p className="text-slate-500">
                  粘贴多行图片链接，点击「解析并加载」即可自动去重、校验并生成独立图片卡片。
                </p>
              </div>
            </div>
            <div className="glass-panel rounded-2xl px-4 py-3 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="font-medium text-slate-900">
                  {stats.total} 张图片
                </span>
                <span className="text-xs text-slate-400">已准备展示</span>
              </div>
              {stats.invalid > 0 && (
                <p className="mt-1 text-xs text-amber-600">
                  {stats.invalid} 条无效链接已被过滤
                </p>
              )}
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="glass-panel rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Wand2 size={18} />
              输入/粘贴图片 URL 列表
            </div>
            <p className="mt-2 text-sm text-slate-500">
              支持换行或空格分隔，自动去重校验，点击「解析并加载」生成图片卡片。
            </p>
            <div className="mt-4">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={12}
                className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm leading-6 text-slate-900 shadow-inner outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                placeholder="粘贴多行图片链接，例如每行一个 https://xxx/image.jpg"
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={handleParse}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0"
              >
                <Sparkles size={16} />
                解析并加载
              </button>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <RotateCw size={16} />
                恢复示例
              </button>
              <div className="text-xs text-slate-500">
                · 自动去重 · 校验协议 · 过滤无效项
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <AlertCircle size={18} className="text-slate-400" />
              校验反馈
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white/60 px-4 py-3">
                <p className="text-xs text-slate-500">有效链接</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">
                  {stats.total}
                </p>
                <p className="text-xs text-emerald-600">已准备成独立图片</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/60 px-4 py-3">
                <p className="text-xs text-slate-500">无效/重复</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">
                  {stats.invalid}
                </p>
                <p className="text-xs text-slate-500">自动过滤，不显示</p>
              </div>
            </div>
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-3 text-xs text-slate-500">
              支持 http/https，去重策略基于完整 URL，保持图片顺序与输入一致。
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">
              解析结果 · 单张图片列表
            </h2>
            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
              共 {stats.total} 张
            </span>
          </div>
          {result.urls.length === 0 ? (
            <div className="glass-panel rounded-2xl p-6 text-center text-sm text-slate-500">
              还没有可展示的图片，请粘贴 URL 后点击「解析并加载」。
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {result.urls.map((url, idx) => (
                <ImageCard key={url} url={url} index={idx} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
