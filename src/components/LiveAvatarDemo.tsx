"use client";

import { useState } from "react";
import { LiveAvatarSessionComponent } from "./LiveAvatarSession";

export function LiveAvatarDemo() {
  const [sessionConfig, setSessionConfig] =
    useState<{ sessionToken: string; sessionId: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartSession = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/start-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to start session");
        return;
      }

      setSessionConfig({
        sessionToken: data.session_token,
        sessionId: data.session_id,
      });
    } catch (err) {
      setError(`Error: ${String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopSession = () => {
    setSessionConfig(null);
    setError(null);
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {!sessionConfig ? (
          <div className="bg-white rounded-lg shadow-2xl p-8 space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">
                HeyGen Live Avatar Demo
              </h1>
              <p className="text-gray-600">
                Start a conversation with an AI-powered avatar
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-700 text-sm mt-1">{error}</p>
                <p className="text-red-600 text-xs mt-2">
                  Make sure HEYGEN_VOICE_ID and HEYGEN_CONTEXT_ID are set in
                  .env.local
                </p>
              </div>
            )}

            <button
              onClick={handleStartSession}
              disabled={isLoading}
              className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition text-lg"
            >
              {isLoading ? "Starting..." : "Start Session"}
            </button>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <p className="font-medium text-blue-900">Setup Instructions</p>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Create a .env.local file in the project root</li>
                <li>Add HEYGEN_API_KEY from app.liveavatar.com/developers</li>
                <li>Add HEYGEN_VOICE_ID from your HeyGen dashboard</li>
                <li>Add HEYGEN_CONTEXT_ID from your HeyGen dashboard</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <LiveAvatarSessionComponent sessionConfig={sessionConfig} />
            <button
              onClick={handleStopSession}
              className="w-full px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
            >
              Stop Session
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
