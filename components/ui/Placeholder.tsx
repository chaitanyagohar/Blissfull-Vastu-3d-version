export const DEV = process.env.NODE_ENV !== 'production';
export default function Placeholder({ need, className = '' }: { need: string; className?: string }) {
  if (!DEV) return null;
  return <div className={`placeholder ${className}`}><span className="label">Awaiting client input</span><p>{need}</p></div>;
}
