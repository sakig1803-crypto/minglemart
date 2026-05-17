"use client";
import toast from "react-hot-toast";
import { useState } from "react";
import { auth, db } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("Creator");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

 const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault();

  if (loading) return;
  setLoading(true);

  try {
    const cleanEmail = email.trim();
    const cleanName = name.trim();

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      cleanEmail,
      password
    );

    const user = userCredential.user;

    await updateProfile(user, {
      displayName: cleanName,
    });

    setLoading(false);

    setName("");
    setEmail("");
    setPassword("");
    setRole("Creator");

    toast.success("Account created successfully. Please verify your email.");
    Promise.allSettled([
      setDoc(doc(db, "users", user.uid), {
        name: cleanName,
        email: cleanEmail,
        role,
        emailVerified: false,
        createdAt: new Date().toISOString(),
      }),
      sendEmailVerification(user),
    ]).then((results) => {
      console.log("Background signup tasks:", results);
    });
  } catch (error: any) {
    setLoading(false);

    if (error.code === "auth/email-already-in-use") {
      toast.error("This email is already registered. Please log in instead.");
    } else if (error.code === "auth/invalid-email") {
     toast.error("Please enter a valid email address.");
    } else if (error.code === "auth/weak-password") {
      toast.error("Password should be at least 6 characters.");
    } else {
      toast.error(error.message);
    }
  }
};

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#312e81,_#0f172a_45%,_#000_100%)] px-6 py-16 text-white">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
        <div>
          <p className="mb-4 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300">
            Join MingleMart today
          </p>

          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Create your account and start collaborations.
          </h1>

          <p className="mt-5 max-w-xl leading-7 text-gray-300">
            Sign up as a creator or brand to join the MingleMart marketplace,
            connect faster, and manage campaigns in one place.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-[0_0_40px_rgba(168,85,247,0.12)]">
          <h2 className="text-2xl font-bold">Sign Up</h2>
          <p className="mt-2 text-sm text-gray-400">
            Create your MingleMart account
          </p>

          <form onSubmit={handleSignup} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-blue-400"
              />
            </div>

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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-purple-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Sign up as
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-400"
              >
                <option className="bg-black">Creator</option>
                <option className="bg-black">Brand</option>
              </select>
            </div>

            <button
  type="submit"
  disabled={loading}
  className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(168,85,247,0.45)] disabled:cursor-not-allowed disabled:opacity-60"
>
  {loading ? "Creating Account..." : "Create Account"}
</button>
          </form>
        </div>
      </div>
    </div>
  );
}