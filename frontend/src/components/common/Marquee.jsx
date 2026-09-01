/**
 * A seamless horizontal ticker. The content array is rendered twice back to
 * back so the CSS animation (translateX -50%) loops without a visible seam.
 * Pauses automatically for users with prefers-reduced-motion (see index.css).
 */
export default function Marquee({ items, className = '' }) {
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div className="inline-flex animate-marquee">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="mx-6 font-mono text-sm tracking-wide opacity-80">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
