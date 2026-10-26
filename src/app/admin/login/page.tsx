"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, AlertCircle, Loader2, ArrowLeft, Shield } from "lucide-react";

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid credentials.");
        setLoading(false);
        return;
      }

      router.push(redirectPath);
      router.refresh();
    } catch {
      setError("Network error while authenticating. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-navy-950 px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-electric-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to Public Corporate Portal
        </Link>

        <div className="mt-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-800 bg-navy-900 text-electric-400 shadow-lg">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-electric-400">
              Restricted Access
            </span>
            <h1 className="font-display text-2xl font-extrabold text-white">
              Booking Network Global Group
            </h1>
          </div>
        </div>

        <p className="mt-3 text-sm text-slate-400">
          Sign in to the Corporate Administration System. Public registration is
          disabled; accounts are provisioned exclusively by system
          administrators.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-3xl border border-slate-800 bg-navy-900/90 p-8 shadow-2xl">
          {error && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-3 rounded-xl border border-red-900/80 bg-red-950/60 p-4 text-sm text-red-300"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="admin_email"
                className="block text-xs font-bold uppercase tracking-wider text-slate-300"
              >
                Administrator Email
              </label>
              <input
                id="admin_email"
                name="email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bookingnetwork.co"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-navy-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-electric-500 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="admin_password"
                className="block text-xs font-bold uppercase tracking-wider text-slate-300"
              >
                Password
              </label>
              <input
                id="admin_password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-navy-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-electric-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-electric-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-electric-600/20 hover:bg-electric-500 disabled:opacity-60 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying Session...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Sign In to Dashboard
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-800 pt-5 text-center text-xs text-slate-500">
            Protected by HTTP-only encrypted session tokens & rate-limiting.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-navy-950 text-white">
          Loading Administrator Portal...
        </div>
      }
    >
      <LoginFormInner />
    </Suspense>
  );
}

