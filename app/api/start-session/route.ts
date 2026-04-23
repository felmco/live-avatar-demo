import { NextRequest, NextResponse } from "next/server";
import {
  API_KEY,
  API_URL,
  AVATAR_ID,
  IS_SANDBOX,
  VOICE_ID,
  CONTEXT_ID,
  LANGUAGE,
} from "../secrets";

export async function POST(req: NextRequest) {
  try {
    if (!API_KEY) {
      return NextResponse.json(
        { error: "HEYGEN_API_KEY is not set in environment variables" },
        { status: 400 }
      );
    }

    if (!AVATAR_ID || !VOICE_ID || !CONTEXT_ID) {
      return NextResponse.json(
        {
          error:
            "HEYGEN_AVATAR_ID, HEYGEN_VOICE_ID, and HEYGEN_CONTEXT_ID must be set in .env.local.",
        },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_URL}/v1/sessions/token`, {
      method: "POST",
      headers: {
        "X-API-KEY": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        avatar_id: AVATAR_ID,
        avatar_persona: {
          voice_id: VOICE_ID,
          context_id: CONTEXT_ID,
          language: LANGUAGE,
        },
        is_sandbox: IS_SANDBOX,
        mode: "FULL",
        max_session_duration: 600,
      }),
    });

    const data = await response.json();

    console.log("HeyGen response:", JSON.stringify(data, null, 2));

    if (data.code !== 1000) {
      return NextResponse.json(
        {
          error: data.message || "Failed to create session token",
          details: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      session_token: data.data.session_token,
      session_id: data.data.session_id,
    });
  } catch (error) {
    console.error("Error starting session:", error);
    return NextResponse.json(
      { error: "Failed to start session" },
      { status: 500 }
    );
  }
}
