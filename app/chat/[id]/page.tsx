"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { auth, db } from "../../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

export default function ChatPage() {
  const params = useParams();
  const chatId = params.id as string;

  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [typingUserId, setTypingUserId] = useState("");
  const [otherUser, setOtherUser] = useState<any>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    setDoc(
      userRef,
      {
        online: true,
        lastSeen: new Date().toISOString(),
      },
      { merge: true }
    );

    const handleOffline = () => {
      setDoc(
        userRef,
        {
          online: false,
          lastSeen: new Date().toISOString(),
        },
        { merge: true }
      );
    };

    window.addEventListener("beforeunload", handleOffline);

    return () => {
      handleOffline();
      window.removeEventListener("beforeunload", handleOffline);
    };
  }, [user]);

  useEffect(() => {
    if (!chatId || !user) return;

    let unsubscribeOtherUser: (() => void) | undefined;

    const loadOtherUser = async () => {
      const chatSnap = await getDoc(doc(db, "chats", chatId));

      if (!chatSnap.exists()) return;

      const chatData = chatSnap.data();

      const otherUserId =
        user.uid === chatData.creatorId ? chatData.brandId : chatData.creatorId;

      if (!otherUserId) return;

      unsubscribeOtherUser = onSnapshot(
        doc(db, "users", otherUserId),
        (snapshot) => {
          if (snapshot.exists()) {
            setOtherUser(snapshot.data());
          }
        }
      );
    };

    loadOtherUser();

    return () => {
      if (unsubscribeOtherUser) unsubscribeOtherUser();
    };
  }, [chatId, user]);

  useEffect(() => {
    if (!chatId || !user) return;

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: any[] = [];

      snapshot.forEach((docItem) => {
        const data = docItem.data();

        msgs.push({
          id: docItem.id,
          ...data,
        });

        if (data.senderId !== user.uid && data.seen === false) {
          updateDoc(doc(db, "chats", chatId, "messages", docItem.id), {
            seen: true,
          });
        }
      });

      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatId, user]);

  useEffect(() => {
    if (!chatId) return;

    const unsubscribe = onSnapshot(doc(db, "chats", chatId), (snapshot) => {
      const data = snapshot.data();
      setTypingUserId(data?.typingUserId || "");
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUserId]);

  const formatLastSeen = (lastSeen: string) => {
    if (!lastSeen) return "Offline";

    return `Last seen ${new Date(lastSeen).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const clearTyping = async () => {
    if (!chatId) return;

    await setDoc(
      doc(db, "chats", chatId),
      { typingUserId: "" },
      { merge: true }
    );
  };

  const handleTyping = async (value: string) => {
    setNewMessage(value);

    if (!user || !chatId) return;

    await setDoc(
      doc(db, "chats", chatId),
      { typingUserId: user.uid },
      { merge: true }
    );

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      clearTyping();
    }, 1500);
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !user) return;

    await addDoc(collection(db, "chats", chatId, "messages"), {
      text: newMessage.trim(),
      senderId: user.uid,
      senderEmail: user.email,
      createdAt: new Date().toISOString(),
      seen: false,
    });

    await clearTyping();
    setNewMessage("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-black pt-24 text-white">
      <div className="sticky top-20 z-20 border-b border-white/10 bg-black/95 p-4 backdrop-blur">
        <h1 className="text-xl font-bold">{otherUser?.name || "Chat"}</h1>

        <p className="text-sm text-gray-400">
          {typingUserId && typingUserId !== user?.uid
            ? "Typing..."
            : otherUser?.online
            ? "🟢 Online"
            : otherUser?.lastSeen
            ? formatLastSeen(otherUser.lastSeen)
            : "Offline"}
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((msg) => {
          const isMe = msg.senderId === user?.uid;

          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs rounded-2xl px-4 py-2 ${
                  isMe ? "bg-blue-500 text-white" : "bg-white/10 text-gray-200"
                }`}
              >
                <p>{msg.text}</p>

                <p className="mt-1 flex items-center justify-end gap-1 text-[10px] text-gray-300">
                  {msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}

                  {isMe && <span>{msg.seen ? "✔✔" : "✔"}</span>}
                </p>
              </div>
            </div>
          );
        })}

        {typingUserId && typingUserId !== user?.uid && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-white/10 px-4 py-2 text-sm text-gray-300">
              Typing...
            </div>
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      <div className="sticky bottom-0 flex gap-3 border-t border-white/10 bg-black p-4">
        <input
          value={newMessage}
          onChange={(e) => handleTyping(e.target.value)}
          onBlur={clearTyping}
          placeholder="Type message..."
          className="flex-1 rounded-xl bg-white/10 px-4 py-2 outline-none"
        />

        <button
          onClick={handleSend}
          className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2"
        >
          Send
        </button>
      </div>
    </div>
  );
}