export interface FaviconProps {
  src: string;
  domain: string;
  size?: 20 | 32;
  goldBorder?: boolean;
  className?: string;
}

export function Favicon({
  src,
  domain,
  size = 20,
  goldBorder = false,
  className = "",
}: FaviconProps) {
  const fallback = `https://www.google.com/s2/favicons?domain=${domain}&sz=${size * 2}`;
  const border = goldBorder ? "border-[#C9A96E]" : "border-[#242424]";
  const dims = size === 32 ? "w-8 h-8" : "w-5 h-5";

  return (
    <div
      className={`${dims} bg-[#1A1A1A] border ${border} rounded-[2px] flex items-center justify-center overflow-hidden shrink-0 ${className}`}
    >
      <img
        src={src || fallback}
        onError={(e) => {
          if (e.currentTarget.src !== fallback) {
            e.currentTarget.src = fallback;
          }
        }}
        className="w-3/4 h-3/4 object-contain"
        alt={domain}
      />
    </div>
  );
}
