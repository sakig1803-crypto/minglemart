"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { auth, db } from "@/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState("");

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setRole("");
        return;
      }

      setUser(currentUser);

      try {
        const userRef = doc(db, "users", currentUser.uid);

        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();

          setRole(data.role || "");
        }
      } catch (error) {
        console.log(error);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);

    router.push("/login");
  };

  return (
    <div className="sticky top-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 text-white md:px-10">
        {/* LOGO */}
        <div
          onClick={() => router.push("/")}
          className="group flex cursor-pointer items-center gap-3 transition-all duration-300"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 font-bold text-white shadow-lg shadow-purple-900/30 transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-[0_0_25px_rgba(168,85,247,0.55)]">
            M
          </div>

          <div>
            <h1 className="text-xl font-bold leading-none tracking-wide transition-all duration-300 group-hover:text-blue-300">
              MingleMart
            </h1>

            <p className="mt-1 text-[11px] leading-none text-gray-400 transition-all duration-300 group-hover:text-gray-200">
              Creator x Brand Marketplace
            </p>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="hidden items-center gap-2 text-sm md:flex">
          {/* HOME */}
          <Link
            href="/"
            className="rounded-xl px-4 py-2 text-gray-300 transition-all duration-300 hover:bg-white/10 hover:text-white"
          >
            Home
          </Link>

          {/* NOT LOGGED IN */}
          {!user && (
            <>
              <Link
                href="/creators"
                className="rounded-xl px-4 py-2 text-gray-300 transition-all duration-300 hover:bg-white/10 hover:text-white"
              >
                Creators
              </Link>

              <Link
                href="/login"
                className="rounded-xl px-4 py-2 text-gray-300 transition-all duration-300 hover:bg-white/10 hover:text-white"
              >
                Login
              </Link>

              <button
                onClick={() => router.push("/login")}
                className="ml-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2 font-semibold text-white transition-all duration-300 hover:scale-105"
              >
                Get Started
              </button>
            </>
          )}

          {/* CREATOR NAVBAR */}
          {user && role === "Creator" && (
            <>
              <Link
                href="/brands"
                className="rounded-xl px-4 py-2 text-gray-300 transition-all duration-300 hover:bg-white/10 hover:text-white"
              >
                Brands
              </Link>

              <Link
                href="/profile"
                className="rounded-xl px-4 py-2 text-gray-300 transition-all duration-300 hover:bg-white/10 hover:text-white"
              >
                My Profile
              </Link>

              <Link
                href="/dashboard"
                className="rounded-xl px-4 py-2 text-gray-300 transition-all duration-300 hover:bg-white/10 hover:text-white"
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="ml-2 rounded-xl bg-red-500 px-5 py-2 font-semibold text-white transition-all duration-300 hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}

          {/* BRAND NAVBAR */}
          {user && role === "Brand" && (
            <>
              <Link
                href="/creators"
                className="rounded-xl px-4 py-2 text-gray-300 transition-all duration-300 hover:bg-white/10 hover:text-white"
              >
                Creators
              </Link>

              <Link
                href="/profile"
                className="rounded-xl px-4 py-2 text-gray-300 transition-all duration-300 hover:bg-white/10 hover:text-white"
              >
                Profile
              </Link>

              <Link
                href="/dashboard"
                className="rounded-xl px-4 py-2 text-gray-300 transition-all duration-300 hover:bg-white/10 hover:text-white"
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="ml-2 rounded-xl bg-red-500 px-5 py-2 font-semibold text-white transition-all duration-300 hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}