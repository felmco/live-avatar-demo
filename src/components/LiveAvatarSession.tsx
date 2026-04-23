"use client";

import { useEffect, useRef, useState } from "react";
import { LiveAvatarSession } from "@heygen/liveavatar-web-sdk";

interface SessionConfig {
  sessionToken: string;
  sessionId: string;
}

export function LiveAvatarSessionComponent({
  sessionConfig,
}: {
  sessionConfig: SessionConfig;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sessionRef = useRef<LiveAvatarSession | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [status, setStatus] = useState("Initializing...");

  useEffect(() => {
    const initSession = async () => {
      try {
        const session = new LiveAvatarSession(sessionConfig.sessionToken, {
          voiceChat: true,
          apiUrl: "https://api.liveavatar.com",
        });

        sessionRef.current = session;

        session.on("SESSION_STATE_CHANGED", (state) => {
          console.log("Session state changed:", state);
          setStatus(`Session state: ${state}`);
          if (state === "CONNECTED") {
            setIsConnected(true);
          }
        });

        session.on("SESSION_STREAM_READY", () => {
          console.log("Stream ready, attaching to video element");
          setStatus("Stream ready");
          if (videoRef.current) {
            session.attach(videoRef.current);
          }
        });

        session.on("SESSION_CONNECTION_QUALITY_CHANGED", (quality) => {
          console.log("Connection quality:", quality);
        });

        session.on("USER_SPEAK_STARTED", () => {
          console.log("User started speaking");
        });

        session.on("USER_SPEAK_ENDED", () => {
          console.log("User stopped speaking");
        });

        session.on("AVATAR_SPEAK_STARTED", () => {
          console.log("Avatar started speaking");
        });

        session.on("AVATAR_SPEAK_ENDED", () => {
          console.log("Avatar stopped speaking");
        });

        setStatus("Starting session...");
        await session.start();
      } catch (error) {
        console.error("Error initializing session:", error);
        setStatus(`Error: ${String(error)}`);
      }
    };

    initSession();

    return () => {
      if (sessionRef.current) {
        sessionRef.current.stop().catch(console.error);
      }
    };
  }, [sessionConfig.sessionToken]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !sessionRef.current) return;

    try {
      await sessionRef.current.message(messageText);
      setMessageText("");
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus(`Error sending message: ${String(error)}`);
    }
  };

  const handleToggleMute = async () => {
    if (!sessionRef.current?.voiceChat) return;

    try {
      if (isMuted) {
        await sessionRef.current.voiceChat.unmute();
      } else {
        await sessionRef.current.voiceChat.mute();
      }
      setIsMuted(!isMuted);
    } catch (error) {
      console.error("Error toggling mute:", error);
    }
  };

  const handleInterrupt = async () => {
    if (!sessionRef.current) return;

    try {
      await sessionRef.current.interrupt();
      setStatus("Avatar interrupted");
    } catch (error) {
      console.error("Error interrupting:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="space-y-2">
        <h2 className="text-xl font-bold">Live Avatar Session</h2>
        <p className="text-sm text-gray-600">Status: {status}</p>
      </div>

      <video
        ref={videoRef}
        autoPlay
        muted={true}
        className="w-full aspect-video bg-black rounded-lg"
      />

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleToggleMute}
          className={`px-4 py-2 rounded font-medium text-white transition ${
            isMuted
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isMuted ? "Unmute Mic" : "Mute Mic"}
        </button>
        <button
          onClick={handleInterrupt}
          disabled={!isConnected}
          className="px-4 py-2 rounded font-medium text-white bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400"
        >
          Interrupt
        </button>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!isConnected}
        />
        <button
          onClick={handleSendMessage}
          disabled={!isConnected || !messageText.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:bg-gray-400"
        >
          Send
        </button>
      </div>
    </div>
  );
}
