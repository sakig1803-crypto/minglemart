"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function ChatsPage() {
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      setCurrentUser(user);

      try {
        const creatorQuery = query(
          collection(db, "chats"),
          where("creatorId", "==", user.uid)
        );

        const brandQuery = query(
          collection(db, "chats"),
          where("brandId", "==", user.uid)
        );

        const [creatorSnap, brandSnap] = await Promise.all([
          getDocs(creatorQuery),
          getDocs(brandQuery),
        ]);

        const chatMap = new Map();

        creatorSnap.forEach((docItem) => {
          chatMap.set(docItem.id, { id: docItem.id, ...docItem.data() });
        });

        brandSnap.forEach((docItem) => {
          chatMap.set(docItem.id, { id: docItem.id, ...docItem.data() });
        });

        const chatList = Array.from(chatMap.values());

        const updatedChats = await Promise.all(
          chatList.map(async (chat) => {
            try {
              const messagesRef = collection(
                db,
                "chats",
                chat.id,
                "messages"
              );

              const lastMessageQuery = query(
                messagesRef,
                orderBy("createdAt", "desc"),
                limit(1)
              );

              const [lastSnap, allMessagesSnap] = await Promise.all([
                getDocs(lastMessageQuery),
                getDocs(messagesRef),
              ]);

              let lastMessage = "No messages yet";
              let unreadCount = 0;

              lastSnap.forEach((docItem) => {
                lastMessage = docItem.data().text || "No messages yet";
              });

              allMessagesSnap.forEach((docItem) => {
                const data = docItem.data();

                if (data.senderId !== user.uid && data.seen === false) {
                  unreadCount++;
                }
              });

              return {
                ...chat,
                lastMessage,
                unreadCount,
              };
            } catch (error) {
              console.error(error);

              return {
                ...chat,
                lastMessage: "Error loading message",
                unreadCount: 0,
              };
            }
          })
        );

        setChats(updatedChats);
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Loading chats...
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,_#312e81,_#0f172a_45%,_#000_100%)] px-4 py-8 text-white md:px-6 md:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="mb-3 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300">
            Your Conversations
          </p>
          <h1 className="text-4xl font-bold">Chat Inbox</h1>
          <p className="mt-2 text-gray-300">
            View all creator-brand conversations in one place.
          </p>
        </div>

        {chats.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
            <h2 className="text-2xl font-semibold">No chats yet</h2>
            <p className="mt-3 text-gray-300">
              Accepted hire requests will appear here as chat conversations.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {chats.map((chat) => {
              const isCreator = currentUser?.uid === chat.creatorId;
              const otherName = isCreator
                ? chat.brandName
                : chat.creatorName;
              const otherEmail = isCreator
                ? chat.brandEmail
                : chat.creatorEmail;
              const roleLabel = isCreator ? "Brand" : "Creator";

              return (
                <div
                  key={chat.id}
                  className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl shadow-[0_0_30px_rgba(59,130,246,0.08)]"
                >
                  {chat.unreadCount > 0 && (
                    <div className="absolute right-4 top-4 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                      {chat.unreadCount}
                    </div>
                  )}

                  <div className="mb-4 flex items-center gap-4 pr-10">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-xl font-bold text-white">
                      {otherName?.charAt(0) || "C"}
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold">
                        {otherName || "Unknown User"}
                      </h2>
                      <p className="text-sm text-gray-400">{roleLabel}</p>
                    </div>
                  </div>

                  <p
                   className={`mb-3 break-words text-sm ${
                      chat.unreadCount > 0
                        ? "font-semibold text-white"
                        : "text-gray-400"
                    }`}
                  >
                    {chat.lastMessage}
                  </p>

                  <div className="space-y-2 break-words text-sm text-gray-300">
                    <p>
                      <span className="font-semibold text-white">Email:</span>{" "}
                      {otherEmail || "N/A"}
                    </p>
                  </div>

                  <button
                    onClick={() => router.push(`/chat/${chat.id}`)}
                    className="mt-5 w-full rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] md:text-base"
                  >
                    Open Chat
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}