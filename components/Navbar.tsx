"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { auth, db } from "@/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

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
    <div className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-4 text-white md:px-10">
        {/* LOGO */}
        <div
          onClick={() => router.push("/")}
          className="group flex cursor-pointer items-center gap-3 transition-all duration-300"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 font-bold text-white shadow-lg shadow-purple-900/30 transition-all duration-300 group-hover:scale-110">
            M
          </div>

          <div>
            <h1 className="text-lg font-bold leading-none tracking-wide md:text-xl">
              MingleMart
            </h1>

            <p className="mt-1 hidden text-[11px] leading-none text-gray-400 sm:block">
              Creator x Brand Marketplace
            </p>
          </div>
        </div>

        {/* DESKTOP NAVBAR */}
        <div className="hidden items-center gap-2 text-sm md:flex">
          <Link
            href="/"
            className="rounded-xl px-4 py-2 text-gray-300 transition hover:bg-white/10 hover:text-white"
          >
            Home
          </Link>

          {!user && (
            <>
              <Link
                href="/creators"
                className="rounded-xl px-4 py-2 text-gray-300 transition hover:bg-white/10 hover:text-white"
              >
                Creators
              </Link>

              <Link
                href="/login"
                className="rounded-xl px-4 py-2 text-gray-300 transition hover:bg-white/10 hover:text-white"
              >
                Login
              </Link>

              <button
                onClick={() => router.push("/login")}
                className="ml-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2 font-semibold text-white transition hover:scale-105"
              >
                Get Started
              </button>
            </>
          )}

          {user && role === "Creator" && (
            <>
              <Link
                href="/brands"
                className="rounded-xl px-4 py-2 text-gray-300 transition hover:bg-white/10 hover:text-white"
              >
                Brands
              </Link>

              <Link
                href="/profile"
                className="rounded-xl px-4 py-2 text-gray-300 transition hover:bg-white/10 hover:text-white"
              >
                My Profile
              </Link>

              <Link
                href="/dashboard"
                className="rounded-xl px-4 py-2 text-gray-300 transition hover:bg-white/10 hover:text-white"
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="ml-2 rounded-xl bg-red-500 px-5 py-2 font-semibold text-white transition hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}

          {user && role === "Brand" && (
            <>
              <Link
                href="/creators"
                className="rounded-xl px-4 py-2 text-gray-300 transition hover:bg-white/10 hover:text-white"
              >
                Creators
              </Link>

              <Link
                href="/profile"
                className="rounded-xl px-4 py-2 text-gray-300 transition hover:bg-white/10 hover:text-white"
              >
                Profile
              </Link>

              <Link
                href="/dashboard"
                className="rounded-xl px-4 py-2 text-gray-300 transition hover:bg-white/10 hover:text-white"
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="ml-2 rounded-xl bg-red-500 px-5 py-2 font-semibold text-white transition hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-xl border border-white/10 bg-white/5 p-2 md:hidden"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-black/95 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3 text-white">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl bg-white/5 px-4 py-3"
            >
              Home
            </Link>

            {!user && (
              <>
                <Link
                  href="/creators"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl bg-white/5 px-4 py-3"
                >
                  Creators
                </Link>

                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl bg-white/5 px-4 py-3"
                >
                  Login
                </Link>
              </>
            )}

            {user && role === "Creator" && (
              <>
                <Link
                  href="/brands"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl bg-white/5 px-4 py-3"
                >
                  Brands
                </Link>

                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl bg-white/5 px-4 py-3"
                >
                  My Profile
                </Link>

                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl bg-white/5 px-4 py-3"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="rounded-xl bg-red-500 px-4 py-3 font-semibold"
                >
                  Logout
                </button>
              </>
            )}

            {user && role === "Brand" && (
              <>
                <Link
                  href="/creators"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl bg-white/5 px-4 py-3"
                >
                  Creators
                </Link>

                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl bg-white/5 px-4 py-3"
                >
                  Profile
                </Link>

                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl bg-white/5 px-4 py-3"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="rounded-xl bg-red-500 px-4 py-3 font-semibold"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}