import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center hero-gradient px-6">
      <div className="text-center">
        <h1 className="font-display text-9xl text-ink-900">404</h1>
        <p className="text-ink-600 text-lg mb-6">This page didn't quite make it past the ATS.</p>
        <Link to="/" className="btn-primary">Back to home</Link>
      </div>
    </div>
  );
}
