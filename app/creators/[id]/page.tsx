"use client";

import { useEffect, useState } from "react";
import { db, auth } from "../../../firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

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

export default function CreatorDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [creator, setCreator] = useState<any>(null);
  const [currentUserData, setCurrentUserData] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [avgRating, setAvgRating] = useState("0");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [rating, setRating] = useState("5");
  const [reviewText, setReviewText] = useState("");
  const [reviewSaving, setReviewSaving] = useState(false);

  const creatorId = params.id as string;

  const fetchReviews = async () => {
    const reviewQuery = query(
      collection(db, "reviews"),
      where("creatorId", "==", creatorId)
    );

    const reviewSnap = await getDocs(reviewQuery);
    const list: any[] = [];
    let total = 0;

    reviewSnap.forEach((docItem) => {
      const data = docItem.data();
      total += Number(data.rating || 0);
      list.push({ id: docItem.id, ...data });
    });

    setReviews(list);
    setAvgRating(list.length > 0 ? (total / list.length).toFixed(1) : "0");
  };

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        const docRef = doc(db, "users", creatorId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const followers = data.followers || "N/A";

          setCreator({
            id: docSnap.id,
            ...data,
            rate: data.rate || getAutoRate(followers),
            packageDetails: data.packageDetails || getAutoPackage(),
          });
        } else {
          setCreator(null);
        }

        await fetchReviews();
      } catch (error) {
        console.error("Error fetching creator:", error);
        setCreator(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCreator();
  }, [creatorId]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const userSnap = await getDoc(doc(db, "users", user.uid));

      if (userSnap.exists()) {
        setCurrentUserData({
          id: user.uid,
          ...userSnap.data(),
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleHireRequest = async () => {
    if (!creator || !auth.currentUser) return;

    try {
      setSending(true);
      const brandUser = auth.currentUser;

      await addDoc(collection(db, "hireRequests"), {
        creatorId: creator.id,
        creatorName: creator.name || "",
        creatorEmail: creator.email || "",
        creatorNiche: creator.niche || "",
        creatorFollowers: creator.followers || "",
        creatorRate: creator.rate || "",
        creatorPackageDetails: creator.packageDetails || "",
        brandId: brandUser.uid,
        brandName: brandUser.displayName || currentUserData?.name || "Unknown Brand",
        brandEmail: brandUser.email || "",
        status: "pending",
        createdAt: new Date().toISOString(),
      });

      toast.success("Hire request sent successfully.");
    } catch (error: any) {
      console.error("Error sending request:", error);
      toast.error("Failed to send hire request.");
    } finally {
      setSending(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!auth.currentUser) {
      toast.error("Please login first");
      return;
    }

    if (currentUserData?.role !== "Brand") {
      toast.error("Only brands can write reviews");
      return;
    }

    if (!reviewText.trim()) {
      toast.error("Please write a review");
      return;
    }

    try {
      setReviewSaving(true);

      await addDoc(collection(db, "reviews"), {
        creatorId: creator.id,
        creatorName: creator.name || "",
        brandId: auth.currentUser.uid,
        brandName: currentUserData?.name || auth.currentUser.displayName || "Brand",
        brandEmail: auth.currentUser.email || "",
        rating: Number(rating),
        reviewText: reviewText.trim(),
        createdAt: new Date().toISOString(),
      });

      toast.success("Review submitted successfully");
      setReviewText("");
      setRating("5");
      await fetchReviews();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setReviewSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Loading creator profile...
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <h1 className="text-3xl font-bold">Creator not found</h1>
        <button
          onClick={() => router.push("/creators")}
          className="mt-6 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 font-semibold text-white"
        >
          Back to Creators
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#312e81,_#0f172a_45%,_#000_100%)] px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-[0_0_40px_rgba(59,130,246,0.12)]">
          <div className="flex flex-col gap-8 md:flex-row md:items-start">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-r from-blue-500 to-purple-600 text-4xl font-bold">
              {creator.name?.charAt(0) || "C"}
            </div>

            <div className="flex-1">
              <p className="mb-3 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300">
                Creator Profile
              </p>

              <h1 className="text-4xl font-bold">
                {creator.name || "Unnamed Creator"}
              </h1>

              <p className="mt-2 text-lg text-gray-300">
                {creator.niche || "N/A"}
              </p>

              <p className="mt-2 text-yellow-400">
                ⭐ {avgRating} ({reviews.length} reviews)
              </p>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <h2 className="text-lg font-semibold">Followers</h2>
                  <p className="mt-2 text-gray-300">{creator.followers || "N/A"}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <h2 className="text-lg font-semibold">Auto Rate</h2>
                  <p className="mt-2 text-gray-300">{creator.rate}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 md:col-span-2">
                  <h2 className="text-lg font-semibold">Package Details</h2>
                  <p className="mt-2 leading-7 text-gray-300">
                    {creator.packageDetails}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <h2 className="text-lg font-semibold">Email</h2>
                  <p className="mt-2 text-gray-300">{creator.email || "N/A"}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <h2 className="text-lg font-semibold">Role</h2>
                  <p className="mt-2 text-gray-300">{creator.role || "Creator"}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 md:col-span-2">
                  <h2 className="text-lg font-semibold">Bio</h2>
                  <p className="mt-2 leading-7 text-gray-300">
                    {creator.bio || "No bio added yet."}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={handleHireRequest}
                  disabled={sending}
                  className="rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 font-semibold text-white transition hover:scale-[1.02] disabled:opacity-60"
                >
                  {sending ? "Sending Request..." : "Hire This Creator"}
                </button>

                <button
                  onClick={() => router.push("/creators")}
                  className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
                >
                  Back to Creators
                </button>
              </div>
            </div>
          </div>

          {currentUserData?.role === "Brand" && (
            <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-2xl font-bold">Write a Review</h2>

              <div className="mt-4 grid gap-4">
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
                >
                  <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                  <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                  <option value="3">⭐⭐⭐ 3 Stars</option>
                  <option value="2">⭐⭐ 2 Stars</option>
                  <option value="1">⭐ 1 Star</option>
                </select>

                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={4}
                  placeholder="Write your experience with this creator..."
                  className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-gray-500"
                />

                <button
                  onClick={handleSubmitReview}
                  disabled={reviewSaving}
                  className="rounded-2xl bg-green-500 px-5 py-3 font-semibold text-white transition hover:bg-green-600 disabled:opacity-60"
                >
                  {reviewSaving ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </div>
          )}

          <div className="mt-10">
            <h2 className="mb-4 text-2xl font-bold">Reviews</h2>

            {reviews.length === 0 ? (
              <p className="text-gray-400">No reviews yet.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5"
                  >
                    <p className="text-yellow-400">
                      {"⭐".repeat(Number(review.rating || 0))}
                    </p>
                    <p className="mt-2 text-sm text-gray-300">
                      {review.reviewText}
                    </p>
                    <p className="mt-3 text-xs text-gray-500">
                      By {review.brandName || "Brand"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}