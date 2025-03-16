// components/MessageList.js
import { useEffect, useRef, useState } from "react";

export default function MessageList({ messages, userColors, userName, typingUsers }) {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  useEffect(() => {
    if (isAtBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isAtBottom]);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (container) {
      setIsAtBottom(container.scrollHeight - container.scrollTop <= container.clientHeight + 10);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <div
      className="h-[400px] w-full overflow-y-auto rounded-xl bg-gray-900/30 backdrop-blur-lg p-4 border border-gray-600 shadow-inner"
      ref={messagesContainerRef}
      onScroll={handleScroll}
    >
      {messages.length > 0 ? (
        messages.map((message, index) => {
          const isOwnMessage = message.sender === userName;
          const userColor = userColors[message.sender];

          return (
            <div
              key={index}
              className={`mb-4 ${isOwnMessage ? "items-end" : "items-start"}`}
            >
              <div className={`flex flex-col ${isOwnMessage ? "ml-12" : "mr-12"}`}>
                {/* Message Bubble */}
                <div
                  className={`
                    p-3 rounded-xl max-w-[80%] relative
                    ${isOwnMessage 
                      ? "bg-gradient-to-br from-purple-500/80 to-blue-500/80 ml-auto" 
                      : "bg-gray-800/60 mr-auto"}
                    shadow-lg hover:shadow-xl transition-shadow
                  `}
                >
                  {/* Sender Name */}
                  {!isOwnMessage && (
                    <div 
                      className="text-xs font-semibold mb-1 text-purple-300"
                      style={{ color: userColor }}
                    >
                      {message.sender}
                    </div>
                  )}
                  
                  {/* Message Text */}
                  <p className="text-gray-100 text-sm break-words">
                    {message.text}
                  </p>
                  
                  {/* Timestamp */}
                  <div className={`text-xs mt-1 ${isOwnMessage ? "text-purple-100" : "text-gray-400"}`}>
                    {formatTimestamp(message.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400">
          <p className="text-center">
            No messages yet.<br />
            Be the first to say something!
          </p>
        </div>
      )}

      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <div className="sticky bottom-2 mt-4">
          <div className="inline-block px-4 py-2 bg-gray-800/50 backdrop-blur-sm rounded-full text-sm text-gray-300">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div 
                    key={i}
                    className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
              <span>{typingUsers.join(", ")} {typingUsers.length > 1 ? "are" : "is"} typing...</span>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}