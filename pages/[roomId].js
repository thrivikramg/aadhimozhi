import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { database, ref, push, onValue, set, remove, onDisconnect } from "../lib/firebase";
import "tailwindcss/tailwind.css";
import MessageInput from "../components/MessageInput";
import MessageList from "../components/MessageList";

export default function ChatRoom() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [messages, setMessages] = useState([]);
  const [userColors, setUserColors] = useState({});
  const [typingUsers, setTypingUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  // Initialize roomId and userName
  useEffect(() => {
    const urlRoomId = new URL(window.location.href).pathname.split("/").pop();
    const storedUserName = localStorage.getItem("userName") || "Guest";
    setRoomId(urlRoomId);
    setUserName(storedUserName);

    const storedColor = localStorage.getItem(`userColor_${storedUserName}`) || generateRandomColor();
    localStorage.setItem(`userColor_${storedUserName}`, storedColor);
    setUserColors((prev) => ({ ...prev, [storedUserName]: storedColor }));
  }, []);

  // Manage online users
  useEffect(() => {
    if (!roomId || !userName) return;
    const onlineUsersRef = ref(database, `rooms/${roomId}/onlineUsers/${userName}`);

    // Set user online
    set(onlineUsersRef, true);

    // Remove user from online list when they disconnect
    onDisconnect(onlineUsersRef).remove();

    // Listen for online users
    const unsubscribe = onValue(ref(database, `rooms/${roomId}/onlineUsers`), (snapshot) => {
      setOnlineUsers(snapshot.val() ? Object.keys(snapshot.val()) : []);
    });

    return () => unsubscribe();
  }, [roomId, userName]);

  // Listen for new messages
  useEffect(() => {
    if (!roomId) return;

    const messagesRef = ref(database, `rooms/${roomId}/messages`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const messageList = data ? Object.values(data) : [];
      setMessages(messageList);

      // Assign colors to users
      setUserColors((prevColors) => {
        const newColors = { ...prevColors };
        messageList.forEach((msg) => {
          if (!newColors[msg.sender]) {
            newColors[msg.sender] = generateRandomColor();
          }
        });
        return newColors;
      });
    });

    return () => unsubscribe();
  }, [roomId]);

  // Track typing users
  useEffect(() => {
    if (!roomId) return;
    const typingRef = ref(database, `rooms/${roomId}/typing`);
    const unsubscribe = onValue(typingRef, (snapshot) => {
      const typingData = snapshot.val();
      setTypingUsers(typingData ? Object.keys(typingData).filter((user) => user !== userName) : []);
    });

    return () => unsubscribe();
  }, [roomId, userName]);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (isAtBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isAtBottom]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      push(ref(database, `rooms/${roomId}/messages`), {
        text: newMessage.trim(),
        sender: userName,
        timestamp: Date.now(),
      });
      setNewMessage("");
    }
  };

  const copyRoomLink = () => {
    const roomLink = window.location.href;
    navigator.clipboard.writeText(roomLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleKeyDown = (e) => {
    const typingRef = ref(database, `rooms/${roomId}/typing/${userName}`);

    if (e.key === "Enter") {
      handleSendMessage();
      remove(typingRef);
    } else {
      set(typingRef, true);
      setTimeout(() => remove(typingRef), 3000);
    }
  };

  const handleBackToHome = () => router.push("/");

  const generateRandomColor = () => {
    let color;
    do {
      color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    } while (parseInt(color.substring(1, 3), 16) > 200);
    return color;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white font-mono px-3 py-6 sm:px-6 md:px-8">
      <div className="w-full max-w-xl space-y-6">
        <div className="text-center animate-fade-in">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent cursor-pointer hover:brightness-125 transition-all"
            onClick={copyRoomLink}
          >
            {roomId ? `#${roomId}` : "Loading Room..."}
          </h1>
          {isCopied && <span className="text-sm text-green-400 block animate-fade-in">Link copied!</span>}
          <p className="text-sm sm:text-lg text-gray-300">
            Welcome, <span className="font-semibold text-purple-300">{userName || "Guest"}</span>
          </p>
        </div>

        <div className="flex justify-center">
          <div className="flex items-center space-x-2 px-3 py-1 bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-600 hover:border-purple-400 transition-all cursor-pointer">
            <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs sm:text-sm font-medium">{onlineUsers.length} Active Users</span>
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-xl border border-gray-600 shadow-2xl max-h-[60vh] sm:max-h-[70vh] overflow-y-auto">
          <MessageList messages={messages} userColors={userColors} userName={userName} typingUsers={typingUsers} />
          <div className="p-3 border-t border-gray-600">
            <MessageInput roomId={roomId} userName={userName} />
          </div>
        </div>

        <button
          onClick={() => router.push("/")}
          className="w-full max-w-lg mx-auto px-4 py-2 text-xs sm:text-sm font-medium text-gray-300 hover:bg-gray-800/50 rounded-lg border border-gray-600 flex justify-center items-center"
        >
          Return to Lobby
        </button>
      </div>
    </div>
  );
}
