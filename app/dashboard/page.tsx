"use client";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  getDoc,
} from "firebase/firestore";

import { useEffect, useState } from "react";

import { auth, db } from "../../firebase";

import {
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";

import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

export default function DashboardPage() {
  const [userData, setUserData] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  const [newName, setNewName] = useState("");

  const [updating, setUpdating] = useState(false);

  const [requests, setRequests] = useState<any[]>([]);

  const [brandRequests, setBrandRequests] = useState<any[]>([]);

  const [receivedBrandRequests, setReceivedBrandRequests] = useState<any[]>([]);

  const [deals, setDeals] = useState<any[]>([]);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);

        const userSnap = await getDoc(userRef);

        let actualRole = "Creator";

        if (userSnap.exists()) {
          const data = userSnap.data();

          actualRole = data.role || "Creator";

          setUserData({
            name: data.name || user.displayName || "User",
            email: data.email || user.email || "N/A",
            role: actualRole,
          });

          setNewName(data.name || user.displayName || "");
        }

        // =========================
        // CREATOR DASHBOARD
        // =========================

        if (actualRole === "Creator") {
          const reqQuery = query(
            collection(db, "hireRequests"),
            where("creatorId", "==", user.uid)
          );

          const dealQuery = query(
            collection(db, "deals"),
            where("creatorId", "==", user.uid)
          );

          const [reqSnap, dealSnap] = await Promise.all([
            getDocs(reqQuery),
            getDocs(dealQuery),
          ]);

          const reqData: any[] = [];

          reqSnap.forEach((docItem) => {
            reqData.push({
              id: docItem.id,
              ...docItem.data(),
            });
          });

          const dealData: any[] = [];

          dealSnap.forEach((docItem) => {
            dealData.push({
              id: docItem.id,
              ...docItem.data(),
            });
          });

          setRequests(reqData);

          setBrandRequests([]);

          setReceivedBrandRequests([]);

          setDeals(dealData);
        }

        // =========================
        // BRAND DASHBOARD
        // =========================

        if (actualRole === "Brand") {
          // SENT REQUESTS BY BRAND

          const sentReqQuery = query(
            collection(db, "hireRequests"),
            where("brandId", "==", user.uid)
          );

          // RECEIVED REQUESTS FROM CREATORS

          const receivedReqQuery = query(
            collection(db, "brandRequests"),
            where("brandId", "==", user.uid)
          );

          const dealQuery = query(
            collection(db, "deals"),
            where("brandId", "==", user.uid)
          );

          const [sentSnap, receivedSnap, dealSnap] = await Promise.all([
            getDocs(sentReqQuery),
            getDocs(receivedReqQuery),
            getDocs(dealQuery),
          ]);

          const sentData: any[] = [];

          sentSnap.forEach((docItem) => {
            sentData.push({
              id: docItem.id,
              ...docItem.data(),
            });
          });

          const receivedData: any[] = [];

          receivedSnap.forEach((docItem) => {
            receivedData.push({
              id: docItem.id,
              ...docItem.data(),
            });
          });

          const dealData: any[] = [];

          dealSnap.forEach((docItem) => {
            dealData.push({
              id: docItem.id,
              ...docItem.data(),
            });
          });

          setBrandRequests(sentData);

          setReceivedBrandRequests(receivedData);

          setRequests([]);

          setDeals(dealData);
        }
      } catch (error) {
        console.error("Error loading dashboard:", error);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);

    router.push("/login");
  };

  const handleUpdateName = async () => {
    if (!auth.currentUser || !newName.trim()) return;

    try {
      setUpdating(true);

      await updateProfile(auth.currentUser, {
        displayName: newName.trim(),
      });

      await setDoc(
        doc(db, "users", auth.currentUser.uid),
        {
          name: newName.trim(),
        },
        { merge: true }
      );

      setUserData((prev: any) => ({
        ...prev,
        name: newName.trim(),
      }));

      toast.success("Name updated successfully");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUpdating(false);
    }
  };

  // =========================
  // CREATOR ACCEPT / REJECT
  // =========================

  const handleRequestStatus = async (
    requestId: string,
    newStatus: "accepted" | "rejected",
    reqData: any,
    collectionName: string
  ) => {
    try {
      if (newStatus === "accepted") {
        await setDoc(doc(db, "chats", requestId), {
          requestId,

          creatorId: reqData.creatorId || "",

          creatorName: reqData.creatorName || "",

          creatorEmail: reqData.creatorEmail || "",

          brandId: reqData.brandId || "",

          brandName: reqData.brandName || "",

          brandEmail: reqData.brandEmail || "",

          createdAt: new Date().toISOString(),
        });
      }

      await updateDoc(doc(db, collectionName, requestId), {
        status: newStatus,

        chatId: newStatus === "accepted" ? requestId : null,
      });

      if (collectionName === "hireRequests") {
        setRequests((prev) =>
          prev.map((req) =>
            req.id === requestId
              ? {
                  ...req,
                  status: newStatus,
                  chatId:
                    newStatus === "accepted"
                      ? requestId
                      : null,
                }
              : req
          )
        );
      }

      if (collectionName === "brandRequests") {
        setReceivedBrandRequests((prev) =>
          prev.map((req) =>
            req.id === requestId
              ? {
                  ...req,
                  status: newStatus,
                  chatId:
                    newStatus === "accepted"
                      ? requestId
                      : null,
                }
              : req
          )
        );
      }

      toast.success(`Request ${newStatus}`);
    } catch (error) {
      console.error(error);

      toast.error("Failed to update request");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#312e81,_#0f172a_45%,_#000_100%)] px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

          {/* TOP SECTION */}

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>
              <h1 className="text-4xl font-bold">
                Hi, {userData?.name}
              </h1>

              <p className="mt-2 text-gray-300">
                Manage your account here.
              </p>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => router.push("/chats")}
                  className="rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-3 font-semibold"
                >
                  Open Chat Inbox
                </button>

                <button
                  onClick={() => router.push("/profile")}
                  className="rounded-2xl bg-white/10 px-5 py-3 font-semibold"
                >
                  Edit Profile
                </button>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-2xl bg-red-500 px-5 py-3 font-semibold"
            >
              Logout
            </button>
          </div>

          {/* USER INFO */}

          <div className="mt-10 grid gap-6 md:grid-cols-3">

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold">Full Name</h2>

              <p className="mt-2 text-gray-300">
                {userData?.name}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold">Email</h2>

              <p className="mt-2 text-gray-300">
                {userData?.email}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold">Role</h2>

              <p className="mt-2 text-gray-300">
                {userData?.role}
              </p>
            </div>
          </div>

          {/* CREATOR REQUESTS */}

          {userData?.role === "Creator" && (
            <div className="mt-10">
              <h2 className="mb-4 text-2xl font-bold">
                Hire Requests
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                {requests.map((req) => (
                  <div
                    key={req.id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5"
                  >
                    <h3 className="text-lg font-semibold">
                      Request from {req.brandName}
                    </h3>

                    <p className="mt-2 text-sm text-gray-300">
                      {req.brandEmail}
                    </p>

                    <p className="mt-2 text-sm text-gray-300">
                      Status: {req.status}
                    </p>

                    {req.status === "pending" && (
                      <div className="mt-4 flex gap-3">

                        <button
                          onClick={() =>
                            handleRequestStatus(
                              req.id,
                              "accepted",
                              req,
                              "hireRequests"
                            )
                          }
                          className="flex-1 rounded-2xl bg-green-500 px-4 py-2"
                        >
                          Accept
                        </button>

                        <button
                          onClick={() =>
                            handleRequestStatus(
                              req.id,
                              "rejected",
                              req,
                              "hireRequests"
                            )
                          }
                          className="flex-1 rounded-2xl bg-red-500 px-4 py-2"
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {req.status === "accepted" && (
                      <button
                        onClick={() =>
                          router.push(`/chat/${req.chatId}`)
                        }
                        className="mt-4 w-full rounded-2xl bg-blue-500 px-4 py-2"
                      >
                        Open Chat
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BRAND SENT REQUESTS */}

          {userData?.role === "Brand" && (
            <>
              <div className="mt-10">
                <h2 className="mb-4 text-2xl font-bold">
                  Sent Hire Requests
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                  {brandRequests.map((req) => (
                    <div
                      key={req.id}
                      className="rounded-2xl border border-white/10 bg-white/5 p-5"
                    >
                      <h3 className="text-lg font-semibold">
                        Sent to {req.creatorName}
                      </h3>

                      <p className="mt-2 text-sm text-gray-300">
                        {req.creatorEmail}
                      </p>

                      <p className="mt-2 text-sm text-gray-300">
                        Status: {req.status}
                      </p>

                     {req.status === "accepted" && (
  <div className="mt-4 flex flex-col gap-3">
    <button
      onClick={() =>
        router.push(`/chat/${req.chatId || req.id}`)
      }
      className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 font-semibold text-white"
    >
      Open Chat
    </button>

    <button
      onClick={() =>
        router.push(`/payment/${req.id}`)
      }
      className="w-full rounded-2xl bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-600"
    >
      Pay Now
    </button>
  </div>
)}
                    </div>
                  ))}
                </div>
              </div>

              {/* RECEIVED REQUESTS */}

              <div className="mt-10">
                <h2 className="mb-4 text-2xl font-bold">
                  Received Creator Requests
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                  {receivedBrandRequests.map((req) => (
                    <div
                      key={req.id}
                      className="rounded-2xl border border-white/10 bg-white/5 p-5"
                    >
                      <h3 className="text-lg font-semibold">
                        From {req.creatorName}
                      </h3>

                      <p className="mt-2 text-sm text-gray-300">
                        {req.creatorEmail}
                      </p>

                      <p className="mt-2 text-sm text-gray-300">
                        Status: {req.status}
                      </p>

                      {req.status === "pending" && (
                        <div className="mt-4 flex gap-3">

                          <button
                            onClick={() =>
                              handleRequestStatus(
                                req.id,
                                "accepted",
                                req,
                                "brandRequests"
                              )
                            }
                            className="flex-1 rounded-2xl bg-green-500 px-4 py-2"
                          >
                            Accept
                          </button>

                          <button
                            onClick={() =>
                              handleRequestStatus(
                                req.id,
                                "rejected",
                                req,
                                "brandRequests"
                              )
                            }
                            className="flex-1 rounded-2xl bg-red-500 px-4 py-2"
                          >
                            Reject
                          </button>
                        </div>
                      )}

                    {req.status === "accepted" && (
  <div className="mt-4 flex flex-col gap-3">
    <button
      onClick={() =>
        router.push(`/chat/${req.chatId || req.id}`)
      }
      className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 font-semibold text-white"
    >
      Open Chat
    </button>

    <button
      onClick={() =>
        router.push(`/payment/${req.id}`)
      }
      className="w-full rounded-2xl bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-600"
    >
      Pay Now
    </button>
  </div>
)}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* DEAL HISTORY */}

          <div className="mt-10">
            <h2 className="mb-4 text-2xl font-bold">
              Deal History
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              {deals.map((deal) => (
                <div
                  key={deal.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <h3 className="text-lg font-semibold">
                    {userData?.role === "Brand"
                      ? `Deal with ${deal.creatorName}`
                      : `Deal from ${deal.brandName}`}
                  </h3>

                  <p className="mt-2 text-sm text-gray-300">
                    Final Amount: ₹{deal.finalAmount || 0}
                  </p>

                  <p className="mt-2 text-sm text-gray-300">
                    Status: {deal.status}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}