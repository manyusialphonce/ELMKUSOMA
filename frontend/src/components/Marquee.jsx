export default function Marquee({
  items = [],
  className = '',
}) {
  const repeatedItems = [...items, ...items];

  return (
    <>
      <style>
        {`
          @keyframes elmMarquee {
            from {
              transform: translateX(0);
            }

            to {
              transform: translateX(-50%);
            }
          }

          .elm-marquee-track {
            width: max-content;
            animation: elmMarquee 28s linear infinite;
          }

          .elm-marquee-track:hover {
            animation-play-state: paused;
          }

          @media (prefers-reduced-motion: reduce) {
            .elm-marquee-track {
              animation: none;
            }
          }
        `}
      </style>

      <div className="overflow-hidden whitespace-nowrap">
        <div className="elm-marquee-track flex items-center">
          {repeatedItems.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className={`
                mx-5
                inline-flex
                items-center
                text-xs
                font-bold
                tracking-[0.2em]
                sm:text-sm
                ${className}
              `}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}