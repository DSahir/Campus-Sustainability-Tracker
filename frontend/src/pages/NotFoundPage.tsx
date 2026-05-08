import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-5xl font-bold text-slate-900">404</h1>
      <p className="mt-3 text-slate-500">Page not found.</p>
      <Link to="/login" className="mt-6 rounded-xl bg-brand-600 px-4 py-2 text-white">
        Back to Login
      </Link>
    </div>
  );
}