"use client"

import { useRouter } from "next/navigation";
import { useState, useMemo } from 'react';
import "tailwindcss/tailwind.css"

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isNameLocked, setIsNameLocked] = useState(false);
  const [isJoinRoomModalOpen, setIsJoinRoomModalOpen] = useState(false);
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [generatedRoomId, setGeneratedRoomId] = useState("");

  // Generate stars for the background
  const stars = useMemo(() => {
    const starCount = 150;
    return Array.from({ length: starCount }).map((_, i) => (
      <div
        key={i}
        className="star"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${Math.random() * 3}px`,
          height: `${Math.random() * 3}px`,
          animationDelay: `${Math.random() * 5}s`,
          opacity: Math.random() * 0.7 + 0.3
        }}
      />
    ));
  }, []);

  const handleClick = () => {
    if (!name.trim()) {
      setErrorMessage("Please enter a name.");
    } else if (name.trim().length < 3) {
      setErrorMessage("Name must be at least 3 characters long.");
    } else {
      setErrorMessage("");
      setShowOptions(true);
      setIsNameLocked(true);
      localStorage.setItem("userName", name.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleClick();
    }
  };

  const handleJoinRoom = () => {
    setIsJoinRoomModalOpen(true);
  };

  const handleCreateRoom = () => {
    setIsCreateRoomModalOpen(true);
  };

  const handleRoomIdSubmit = () => {
    if (roomId.trim()) {
      router.push(`${roomId}`);
      setIsJoinRoomModalOpen(false);
    } else {
      setErrorMessage("Please enter a room ID.");
    }
  };

  const handleCreateRoomWithRandomId = () => {
    const randomId = generateRandomRoomId();
    setIsCreateRoomModalOpen(false);
    router.push(randomId);
  };

  const generateRandomRoomId = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomId = "";
    for (let i = 0; i < 5; i++) {
      randomId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomId;
  };

  const handleCreateRoomWithEnteredId = () => {
    setIsCreateRoomModalOpen(false);
    router.push(roomId);
  };

  return (
    <div className="min-h-screen bg-[#0D0F1C] text-white font-montserrat overflow-hidden relative">
      {/* Cosmic Background Elements */}
      <div className="fixed inset-0 bg-space-pattern z-0"></div>
      <div className="stars-container fixed inset-0 z-0">
        {stars}
      </div>
      <div className="nebula-gradient fixed inset-0 z-0 opacity-70"></div>
      
      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold mb-8 text-center glow-purple">Whisper<span className="text-purple-400">.</span></h1>
          
          <div className="glass-card p-8 rounded-2xl backdrop-blur-md border border-white/10 shadow-xl">
            {!isNameLocked ? (
              <div className="space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter your cosmic identity"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full px-5 py-3 bg-black/30 border border-purple-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder-purple-200/50 holographic-input"
                  />
                  <div className="absolute inset-0 rounded-xl purple-glow opacity-50 pointer-events-none"></div>
                </div>
                
                <button
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl hover:from-purple-700 hover:to-pink-600 transition-all duration-300 glow-on-hover"
                  onClick={handleClick}
                >
                  <span className="flex items-center justify-center">
                    Initiate Connection 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </button>
              </div>
            ) : (
              <div className="text-center mb-6">
                <p className="text-lg text-purple-200">Welcome, <span className="text-white font-semibold">{name}</span></p>
                <p className="text-sm text-purple-300/70 mt-1">Your cosmic identity is confirmed</p>
              </div>
            )}

            {errorMessage && (
              <div className="mt-4 p-3 bg-red-900/30 border border-red-500/30 rounded-xl text-red-200 text-center">
                {errorMessage}
              </div>
            )}

            {showOptions && (
              <div className="mt-8 space-y-4">
                <button
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl hover:from-blue-700 hover:to-violet-700 transition-all duration-300 glow-on-hover"
                  onClick={handleJoinRoom}
                >
                  Join Cosmic Channel
                </button>
                <button
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 glow-on-hover"
                  onClick={handleCreateRoom}
                >
                  Create New Dimension
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 text-center text-xs text-purple-300/50">
            <p>Made by Nearcult | V-2</p>
          </div>
        </div>
      </div>

      {/* Join Room Modal */}
      {isJoinRoomModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsJoinRoomModalOpen(false)}></div>
          <div className="glass-card p-6 rounded-2xl backdrop-blur-md border border-white/10 shadow-xl w-full max-w-md relative z-10">
            <h2 className="text-2xl font-bold mb-4 text-center glow-blue">Join Cosmic Channel</h2>
            <div className="relative mb-5">
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full px-5 py-3 bg-black/30 border border-blue-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-blue-200/50 holographic-input"
                placeholder="Enter channel code"
              />
              <div className="absolute inset-0 rounded-xl blue-glow opacity-50 pointer-events-none"></div>
            </div>
            <div className="flex space-x-4">
              <button
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl hover:from-blue-700 hover:to-violet-700 transition-all duration-300 glow-on-hover"
                onClick={handleRoomIdSubmit}
              >
                Connect
              </button>
              <button
                className="flex-1 px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all duration-300"
                onClick={() => setIsJoinRoomModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Room Modal */}
      {isCreateRoomModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsCreateRoomModalOpen(false)}></div>
          <div className="glass-card p-6 rounded-2xl backdrop-blur-md border border-white/10 shadow-xl w-full max-w-md relative z-10">
            <button
              className="absolute top-4 right-4 text-xl text-purple-300 hover:text-white"
              onClick={() => setIsCreateRoomModalOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center glow-pink">Create New Dimension</h2>
            <div className="space-y-5">
              <button
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 glow-on-hover"
                onClick={handleCreateRoomWithRandomId}
              >
                Generate Random Dimension Code
              </button>
              <div className="relative">
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full px-5 py-3 bg-black/30 border border-pink-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 text-white placeholder-pink-200/50 holographic-input"
                  placeholder="Or create your own code"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateRoomWithEnteredId()}
                />
                <div className="absolute inset-0 rounded-xl pink-glow opacity-50 pointer-events-none"></div>
                <button
                  className="absolute right-2 top-2 p-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                  onClick={handleCreateRoomWithEnteredId}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
        
        body {
          font-family: 'Montserrat', sans-serif;
          background: #0D0F1C;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
        
        .font-montserrat {
          font-family: 'Montserrat', sans-serif;
        }
        
        .bg-space-pattern {
          background-image: radial-gradient(circle at center, #0D0F1C 0%, #070811 100%);
        }
        
        .nebula-gradient {
          background: linear-gradient(125deg, rgba(95, 25, 145, 0.3) 0%, rgba(35, 5, 65, 0.2) 30%, rgba(180, 45, 135, 0.3) 70%, rgba(65, 15, 100, 0.2) 100%);
        }
        
        .stars-container {
          overflow: hidden;
        }
        
        .star {
          position: absolute;
          background-color: white;
          border-radius: 50%;
          animation: twinkle 5s infinite ease-in-out;
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        
        .glass-card {
          background: rgba(25, 25, 50, 0.2);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px 0 rgba(80, 0, 120, 0.37);
        }
        
        .holographic-input {
          box-shadow: inset 0 0 15px rgba(180, 70, 255, 0.2);
        }
        
        .glow-purple {
          text-shadow: 0 0 10px rgba(192, 132, 252, 0.8), 0 0 20px rgba(192, 132, 252, 0.5);
        }
        
        .glow-blue {
          text-shadow: 0 0 10px rgba(96, 165, 250, 0.8), 0 0 20px rgba(96, 165, 250, 0.5);
        }
        
        .glow-pink {
          text-shadow: 0 0 10px rgba(236, 72, 153, 0.8), 0 0 20px rgba(236, 72, 153, 0.5);
        }
        
        .purple-glow {
          box-shadow: 0 0 15px 5px rgba(168, 85, 247, 0.5);
        }
        
        .blue-glow {
          box-shadow: 0 0 15px 5px rgba(59, 130, 246, 0.5);
        }
        
        .pink-glow {
          box-shadow: 0 0 15px 5px rgba(236, 72, 153, 0.5);
        }
        
        .glow-on-hover {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .glow-on-hover::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: all 0.6s ease;
        }
        
        .glow-on-hover:hover::before {
          left: 100%;
        }
        
        .glow-on-hover:hover {
          box-shadow: 0 0 15px rgba(168, 85, 247, 0.7);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}