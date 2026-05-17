"use client";

import Link from "next/link";
import { useState } from "react";
import { auth, db } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const user = userCredential.user;

      await user.reload();

      if (!user.emailVerified) {
        toast.error("Please verify your email before logging in.");
        setLoading(false);
        return;
      }

      await setDoc(
        doc(db, "users", user.uid),
        {
          emailVerified: true,
        },
        { merge: true }
      );

      toast.success("Login successful");
      router.push("/dashboard");
    } catch (error: any) {
      if (error.code === "auth/invalid-credential") {
        toast.error("Invalid email or password.");
      } else {
        toast.error(error.message);
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#312e81,_#0f172a_45%,_#000_100%)] px-6 py-16 text-white">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
        <div>
          <p className="mb-4 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300">
            Welcome back to MingleMart
          </p>

          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Login to manage your brand and creator collaborations.
          </h1>

          <p className="mt-5 max-w-xl leading-7 text-gray-300">
            Sign in as a creator or a brand partner to explore campaigns,
            chat with matches, manage deals, and grow faster through one
            smooth marketplace.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
              <h3 className="mb-2 text-lg font-semibold">For Creators</h3>
              <p className="text-sm leading-6 text-gray-300">
                Showcase your profile, audience category, pricing, and connect
                with brands for paid collaborations.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
              <h3 className="mb-2 text-lg font-semibold">For Brands</h3>
              <p className="text-sm leading-6 text-gray-300">
                Find creators by niche, compare profiles, discuss campaign
                details, and hire the right fit for your product.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-[0_0_40px_rgba(59,130,246,0.12)]">
          <h2 className="text-2xl font-bold">Login</h2>
          <p className="mt-2 text-sm text-gray-400">
            Access your MingleMart account
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm text-gray-300">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-blue-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-purple-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Login as
              </label>
              <select className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-400">
                <option className="bg-black">Creator</option>
                <option className="bg-black">Brand</option>
                <option className="bg-black">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(168,85,247,0.45)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login to Dashboard"}
            </button>

            <button
              type="button"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white/10"
            >
              Continue with Google
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don’t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}