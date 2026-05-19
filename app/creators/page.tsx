"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

function parseFollowers(value: string) {
  if (!value) return 0;
  const clean = value.toString().toLowerCase().replace(/,/g, "").trim();
  const number = parseFloat(clean);
  if (clean.includes("m")) return number * 1000000;
  if (clean.includes("k")) return number * 1000;
  return number || 0;
}

function getAutoRate(followers: string) {
  const count = parseFollowers(followers);
  if (count >= 1000 && count <= 5000) return "₹3,000 - ₹5,000 per reel";
  if (count > 5000 && count <= 10000) return "₹5,000 - ₹10,000 per reel";
  if (count > 10000 && count <= 50000) return "₹10,000 - ₹35,000 per reel";
  if (count > 50000 && count <= 100000) return "₹40,000 - ₹75,000 per reel";
  if (count > 100000 && count <= 500000) return "₹75,000 - ₹1.5 Lakh per reel";
  if (count > 500000 && count <= 1000000) return "₹1.5 Lakh - ₹3 Lakh per reel";
  if (count > 1000000 && count <= 2000000) return "₹4 Lakh - ₹7 Lakh per reel";
  if (count > 2000000 && count <= 5000000) return "₹8 Lakh - ₹12 Lakh per reel";
  if (count > 5000000 && count <= 10000000) return "₹13 Lakh - ₹15 Lakh per reel";
  return "Rate not available";
}

function getAutoPackage() {
  return "1 brand collaboration reel + product mention + caption tag. Final deliverables can be discussed in chat.";
}

export default function CreatorsPage() {
  const [creators, setCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const creatorsList: any[] = [];

        for (const docItem of querySnapshot.docs) {
          const data = docItem.data();
if (data.role === "Creator")
           {
            const followers = data.followers || "N/A";

            const reviewQuery = query(
              collection(db, "reviews"),
              where("creatorId", "==", docItem.id)
            );

            const reviewSnap = await getDocs(reviewQuery);
            let totalRating = 0;

            reviewSnap.forEach((reviewDoc) => {
              totalRating += Number(reviewDoc.data().rating || 0);
            });

            const reviewCount = reviewSnap.size;
            const avgRating =
              reviewCount > 0 ? (totalRating / reviewCount).toFixed(1) : "0";

            creatorsList.push({
              id: docItem.id,
              name: data.name || "Unnamed Creator",
              niche: data.niche || "N/A",
              followers,
              rate: data.rate || getAutoRate(followers),
              packageDetails: data.packageDetails || getAutoPackage(),
              bio: data.bio || "No bio added yet.",
              email: data.email || "N/A",
              avgRating,
              reviewCount,
            });
          }
        }

        setCreators(creatorsList);
      } catch (error) {
        console.error("Error fetching creators:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreators();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Loading creators...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#312e81,_#0f172a_45%,_#000_100%)] px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="mb-3 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300">
            Discover creators for your next campaign
          </p>
          <h1 className="text-4xl font-bold md:text-5xl">
            Explore Creator Profiles
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-gray-300">
            Browse real creators on MingleMart and find the right match for your
            brand collaboration.
          </p>
        </div>

        {creators.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
            <h2 className="text-2xl font-semibold">No creators found</h2>
            <p className="mt-3 text-gray-300">
              Save at least one creator profile from the profile page to show it
              here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {creators.map((creator) => (
              <div
                key={creator.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_0_30px_rgba(59,130,246,0.08)] transition hover:scale-[1.01]"
              >
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-xl font-bold text-white">
                    {creator.name?.charAt(0) || "C"}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{creator.name}</h2>
                    <p className="text-sm text-gray-400">{creator.niche}</p>
                    <p className="mt-1 text-sm text-yellow-400">
                      ⭐ {creator.avgRating} ({creator.reviewCount} reviews)
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-gray-300">
                  <p><span className="font-semibold text-white">Followers:</span> {creator.followers}</p>
                  <p><span className="font-semibold text-white">Rate:</span> {creator.rate}</p>
                  <p><span className="font-semibold text-white">Package:</span> {creator.packageDetails}</p>
                  <p><span className="font-semibold text-white">Bio:</span> {creator.bio}</p>
                </div>

                <Link
                  href={`/creators/${creator.id}`}
                  className="mt-6 block w-full rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-3 text-center font-semibold text-white transition hover:scale-[1.02]"
                >
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}