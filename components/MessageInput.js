'use client';
import { useState, useCallback } from "react";
import { database, ref, push, remove, set } from "../lib/firebase";
import { FaFile, FaMapMarkerAlt, FaMicrophone, FaImage, FaPoll, FaPlus } from "react-icons/fa";

export default function MessageInput({ roomId, userName }) {
    const [newMessage, setNewMessage] = useState("");
    const [showOptions, setShowOptions] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const handleSendMessage = useCallback(async () => {
        if (!newMessage.trim() || !userName || !roomId) return;

        try {
            const message = {
                text: newMessage.trim(),
                sender: userName,
                timestamp: Date.now(),
            };

            const messagesRef = ref(database, `rooms/${roomId}/messages`);
            await push(messagesRef, message);
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
            // Add your error handling logic here
        }
    }, [newMessage, roomId, userName]);

    const handleKeyDown = useCallback((e) => {
        if (!roomId || !userName) return;

        const typingRef = ref(database, `rooms/${roomId}/typing/${userName}`);

        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
            remove(typingRef);
            setIsTyping(false);
        } else {
            if (!isTyping) {
                set(typingRef, true);
                setIsTyping(true);
            }
            const timeout = setTimeout(() => {
                remove(typingRef);
                setIsTyping(false);
            }, 3000);

            return () => clearTimeout(timeout);
        }
    }, [handleSendMessage, isTyping, roomId, userName]);


    return (
        <div className="relative flex items-center w-full max-w-2xl gap-2 p-2 flex-wrap sm:flex-nowrap">
            {showOptions && (
                <div className="absolute bottom-full left-0 mb-2 bg-gray-900/95 backdrop-blur-lg text-white p-3 rounded-xl shadow-2xl border border-gray-600 flex gap-3 flex-wrap sm:flex-nowrap">
                    {[
                        { icon: <FaImage className="text-purple-400" />, label: "Image" },
                        { icon: <FaFile className="text-blue-400" />, label: "File" },
                        { icon: <FaMapMarkerAlt className="text-green-400" />, label: "Location" },
                        { icon: <FaMicrophone className="text-red-400" />, label: "Voice" },
                        { icon: <FaPoll className="text-yellow-400" />, label: "Poll" },
                    ].map((item) => (
                        <button
                            key={item.label}
                            className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-200 group"
                            aria-label={item.label}
                        >
                            <span className="text-lg sm:text-xl mb-1 group-hover:-translate-y-1 transition-transform">
                                {item.icon}
                            </span>
                            <span className="text-xs text-gray-300 group-hover:text-white">
                                {item.label}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            <button
                onClick={() => setShowOptions(!showOptions)}
                className="p-3 bg-gray-800/50 backdrop-blur-sm text-white rounded-xl border border-gray-600 hover:border-purple-500 hover:bg-purple-500/20 transition-all"
                aria-label="Attach file"
            >
                <FaPlus className="transform transition-transform duration-300 hover:rotate-90" />
            </button>

            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-gray-600 bg-gray-900/30 backdrop-blur-sm text-white rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all placeholder-gray-400 w-full sm:w-auto"
                aria-label="Type your message"
            />

            <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-purple-500/20"
                aria-label="Send message"
            >
                <svg
                    className="w-5 h-5 transform hover:translate-x-0.5 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                    />
                </svg>
            </button>
        </div>

    );
}