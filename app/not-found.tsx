import Link from 'next/link';
export default function NotFound() {
  return (<main id="main" className="nf"><p className="label">404</p><h1 className="display">This room <em>isn’t on the plan.</em></h1><Link className="btn btn-solid" href="/">Back to the start</Link></main>);
}
