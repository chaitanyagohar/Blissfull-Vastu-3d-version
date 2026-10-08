export default function Mark({ className = '', title }: { className?: string; title?: string }) {
  return (
    <svg className={`mark ${className}`} viewBox="0 0 64 64" {...(title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true })}>
      <circle className="mark-ring" cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="1.2" pathLength={1} />
      <g className="mark-grid" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="14" y="14" width="36" height="36" pathLength={1} />
        <path d="M26 14v36M38 14v36M14 26h36M14 38h36" pathLength={1} />
      </g>
      <rect className="mark-centre" x="27.5" y="27.5" width="9" height="9" />
    </svg>
  );
}
