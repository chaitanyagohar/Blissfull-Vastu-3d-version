export default function Fallback() {
  return (
    <div className="world fallback" aria-hidden="true">
      <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
        <g fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.5">
          <rect x="80" y="80" width="240" height="240" /><path d="M160 80v240M240 80v240M80 160h240M80 240h240" /><circle cx="200" cy="200" r="175" opacity="0.5" />
        </g>
        <rect x="163" y="163" width="74" height="74" fill="#C29A6C" opacity="0.35" />
      </svg>
    </div>
  );
}
