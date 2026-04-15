import { Link, Navigate } from 'react-router-dom';
import { hasAuthToken } from '../api/client';

export function WelcomePage() {
  if (hasAuthToken()) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-svh flex flex-col bg-white px-6 py-8 max-w-mobile mx-auto">
      <div className="mt-8 mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Welcome to Kit and Fit</h1>
        <p className="text-sm text-gray-600">
          Start your garment assessment by logging in with your Subject ID or creating a new account.
        </p>
      </div>

      <div className="space-y-3 mt-auto">
        <Link
          to="/login"
          className="w-full h-12 inline-flex items-center justify-center bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="w-full h-12 inline-flex items-center justify-center bg-white border-2 border-gray-300 text-gray-800 font-medium rounded-lg hover:border-gray-400"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
