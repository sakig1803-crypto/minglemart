"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { auth } from "../../firebase";
import toast from "react-hot-toast";

export default function BrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const handleConnectBrand = async (brand: any) => {
  try {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      toast.error("Please login first");
      return;
    }

    await addDoc(collection(db, "brandRequests"), {
      creatorId: currentUser.uid,
      creatorName: currentUser.displayName || "Creator",
      creatorEmail: currentUser.email || "",

      brandId: brand.id,
      brandName: brand.name || "Brand",
      brandEmail: brand.email || "",

      status: "pending",

      createdAt: new Date().toISOString(),
    });

    toast.success("Request sent successfully");
  } catch (error) {
    console.log(error);
    toast.error("Failed to send request");
  }
};

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));

        const allBrands: any[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();

          if (data.role === "Brand") {
            allBrands.push({
              id: doc.id,
              ...data,
            });
          }
        });

        setBrands(allBrands);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const filteredBrands = brands.filter((brand) =>
    brand.brandExpertise
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Loading brands...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#312e81,_#0f172a_45%,_#000_100%)] px-6 py-12 text-white">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-10 text-center">
          <p className="mb-3 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300">
            Explore Brands
          </p>

          <h1 className="text-5xl font-bold">
            Find Top Brands
          </h1>

          <p className="mt-4 text-gray-300">
            Discover brands and connect for collaborations.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="mx-auto mb-10 max-w-2xl">
          <input
            type="text"
            placeholder="Search brands by expertise like skincare, fitness, fashion..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-gray-400"
          />
        </div>

        {/* BRANDS GRID */}
        {filteredBrands.length === 0 ? (
          <div className="text-center text-gray-400">
            No brands found.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {filteredBrands.map((brand) => (
              <div
                key={brand.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/40"
              >

                {/* IMAGE */}
                <div className="flex justify-center">
                  <img
                    src={
                      brand.profileImage ||
                      "https://placehold.co/200x200/png"
                    }
                    alt={brand.name}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                </div>

                {/* NAME */}
                <div className="mt-5 text-center">
                  <h2 className="text-2xl font-bold">
                    {brand.name || "Brand"}
                  </h2>

                  <p className="mt-2 text-sm text-gray-400">
                    {brand.email}
                  </p>
                </div>

                {/* EXPERTISE */}
                <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-sm text-gray-400">
                    Brand Expertise
                  </p>

                  <p className="mt-2 font-semibold text-white">
                    {brand.brandExpertise || "N/A"}
                  </p>
                </div>

                {/* COMPANY TYPE */}
                <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-sm text-gray-400">
                    Company Type
                  </p>

                  <p className="mt-2 font-semibold text-white">
                    {brand.companyType || "N/A"}
                  </p>
                </div>

                {/* WEBSITE */}
                <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-sm text-gray-400">
                    Website
                  </p>

                  <p className="mt-2 break-all font-semibold text-blue-300">
                    {brand.website || "N/A"}
                  </p>
                </div>

                {/* BIO */}
                <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-sm text-gray-400">
                    About Brand
                  </p>

                  <p className="mt-2 text-sm text-gray-300">
                    {brand.bio || "No bio added yet."}
                  </p>
                </div>

                {/* BUTTON */}
                <button
  onClick={() => handleConnectBrand(brand)}
  className="mt-6 w-full rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02]"
>
  Connect Brand
</button>

              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}