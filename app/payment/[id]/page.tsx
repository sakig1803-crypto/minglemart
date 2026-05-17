"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth, db } from "../../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.id as string;

  const [amount, setAmount] = useState("");
  const [fee, setFee] = useState(0);
  const [creatorGets, setCreatorGets] = useState(0);
  const [requestData, setRequestData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script");

        script.src = "https://checkout.razorpay.com/v1/checkout.js";

        script.onload = () => {
          resolve(true);
        };

        script.onerror = () => {
          resolve(false);
        };

        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const requestRef = doc(db, "hireRequests", requestId);

        const requestSnap = await getDoc(requestRef);

        if (!requestSnap.exists()) {
          toast.error("Hire request not found");
          router.push("/dashboard");
          return;
        }

        const data = requestSnap.data();

        if (data.brandId !== user.uid) {
          toast.error("Only brand can make payment");
          router.push("/dashboard");
          return;
        }

        setRequestData({
          id: requestSnap.id,
          ...data,
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to load payment details");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [requestId, router]);

  const handleCalculate = (value: string) => {
    setAmount(value);

    const amt = Number(value);

    if (!amt || amt <= 0) {
      setFee(0);
      setCreatorGets(0);
      return;
    }

    const platformFee = Math.floor(amt * 0.1);

    const creatorAmount = amt - platformFee;

    setFee(platformFee);
    setCreatorGets(creatorAmount);
  };

  const handlePayment = async () => {
    const finalAmount = Number(amount);

    if (!finalAmount || finalAmount <= 0) {
      toast.error("Please enter valid amount");
      return;
    }

    if (!requestData) {
      toast.error("Request data not found");
      return;
    }

    try {
      setPaying(true);

      // CREATE ORDER
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: finalAmount,
        }),
      });

      const order = await response.json();

      // RAZORPAY OPTIONS
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

        amount: order.amount,

        currency: "INR",

        name: "MingleMart",

        description: "Creator Collaboration Payment",

        order_id: order.id,

        prefill: {
          name: requestData?.brandName || "",
          email: requestData?.brandEmail || "",
        },

        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
        },

        theme: {
          color: "#8b5cf6",
        },

        handler: async function (response: any) {
          try {
            // SAVE DEAL
            await setDoc(doc(db, "deals", requestId), {
              requestId,

              creatorId: requestData.creatorId || "",

              creatorName: requestData.creatorName || "",

              creatorEmail: requestData.creatorEmail || "",

              brandId: requestData.brandId || "",

              brandName: requestData.brandName || "",

              brandEmail: requestData.brandEmail || "",

              creatorRate: requestData.creatorRate || "",

              creatorPackageDetails:
                requestData.creatorPackageDetails || "",

              finalAmount,

              platformFee: fee,

              creatorPayout: creatorGets,

              status: "paid",

              paymentMethod: "razorpay",

              razorpayPaymentId:
                response.razorpay_payment_id,

              razorpayOrderId:
                response.razorpay_order_id,

              paidAt: new Date().toISOString(),

              createdAt: new Date().toISOString(),
            });

            // UPDATE REQUEST
            await updateDoc(doc(db, "hireRequests", requestId), {
              paymentStatus: "paid",

              dealAmount: finalAmount,

              platformFee: fee,

              creatorPayout: creatorGets,
            });

            toast.success("Payment successful");

            router.push("/dashboard");
          } catch (error) {
            console.error(error);

            toast.error("Payment save failed");
          }
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (error: any) {
      console.error(error);

      toast.error(error.message || "Payment failed");
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Loading payment page...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#312e81,_#0f172a_45%,_#000_100%)] px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <p className="mb-3 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300">
          MingleMart Payment
        </p>

        <h1 className="mb-4 text-3xl font-bold">
          Complete Payment
        </h1>

        <p className="mb-8 text-gray-300">
          Enter the final amount agreed between brand and creator.
        </p>

        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="font-semibold">Creator</h2>

            <p className="mt-2 text-gray-300">
              {requestData?.creatorName || "N/A"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="font-semibold">Brand</h2>

            <p className="mt-2 text-gray-300">
              {requestData?.brandName || "N/A"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 md:col-span-2">
            <h2 className="font-semibold">Rate Range</h2>

            <p className="mt-2 text-gray-300">
              {requestData?.creatorRate || "Rate not available"}
            </p>
          </div>
        </div>

        <input
          type="number"
          placeholder="Enter final agreed amount, e.g. 20000"
          value={amount}
          onChange={(e) => handleCalculate(e.target.value)}
          className="mb-6 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
        />

        <div className="mb-6 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-lg">
          <p>
            💰 Final Amount:{" "}
            <b>₹{Number(amount || 0).toFixed(0)}</b>
          </p>

          <p>
            🧾 Platform Fee 10%: <b>₹{fee}</b>
          </p>

          <p>
            👤 Creator Payout 90%: <b>₹{creatorGets}</b>
          </p>
        </div>

        <button
          onClick={handlePayment}
          disabled={paying}
          className="w-full rounded-2xl bg-green-500 py-3 font-semibold text-white transition hover:bg-green-600 disabled:opacity-60"
        >
          {paying ? "Opening Payment..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
}