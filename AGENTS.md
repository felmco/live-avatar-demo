# Agent Configuration for HeyGen Live Avatar Demo

This document defines custom agent configurations and instructions for working on this project.

---

## Project-Specific Agent Rules

### Next.js 15 (Latest)

This project uses **Next.js 15 with App Router** — the latest version. Key points for agents:

- **App Router only** — no Pages Router
- **Turbopack** — the new bundler (faster than Webpack)
- **Server Components by default** — use `"use client"` only when needed
- **API Routes** are in `app/api/` as route handlers (`route.ts`)
- **Environment variables** are accessed via `process.env`
- **TypeScript** is required throughout

If uncertain about API changes, check the Next.js 15 docs before writing code.

---

## HeyGen SDK Rules

### Security-Critical

1. **API Key is Secret**
   - NEVER expose `HEYGEN_API_KEY` in browser code
   - Keep it in `app/api/secrets.ts` (server-side only)
   - Always use it server-side for REST API calls
   - Only send session tokens to the browser

2. **Session Token Pattern**
   - Browser receives a **session token**, not the API key
   - Session token is short-lived and single-use
   - Server endpoint `/api/start-session` handles the exchange

3. **Environment Variables**
   - Always read from `process.env` in `secrets.ts`
   - Export values as constants
   - Never log API key or session tokens
   - `.env.local` is git-ignored (don't commit it)

### SDK Integration

- **Import:** `import { LiveAvatarSession } from "@heygen/liveavatar-web-sdk"`
- **Client-side only:** The SDK runs in browser `<video>` elements
- **Events:** Listen with `session.on("EVENT_NAME", ...)`
- **Methods:** `await session.start()`, `await session.message(text)`, etc.
- **Modes:** FULL (2 credits/min) vs LITE (1 credit/min)

### Billing Awareness

- Keep test sessions short (you burn 2 credits/min in FULL mode)
- Use sandbox mode (`HEYGEN_SANDBOX=true`) for free testing
- Sandbox is limited to "Wayne" avatar only
- Free tier: 10 credits/month (~5 min FULL mode)

---

## React Component Rules

### Use `"use client"` When

- Accessing browser APIs (localStorage, window, etc.)
- Using React hooks (useState, useEffect, etc.)
- Handling user events (onClick, onChange, etc.)

Example from this project:
```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { LiveAvatarSession } from "@heygen/liveavatar-web-sdk";

export function LiveAvatarSessionComponent() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isConnected, setIsConnected] = useState(false);
  // ...
}
```

### Avoid `"use client"` When

- Only serving static content
- Not accessing browser APIs
- Pure data rendering

All components in `src/components/` are client components because they handle UI state and browser APIs.

---

## API Route Rules

### Structure

```ts
import { NextRequest, NextResponse } from "next/server";
import { API_KEY } from "../secrets";  // ← server-side config

export async function POST(req: NextRequest) {
  // Validate secrets exist
  if (!API_KEY) {
    return NextResponse.json(
      { error: "API_KEY not set" },
      { status: 400 }
    );
  }

  // Handle the request
  const response = await fetch("...", {
    headers: { "X-API-KEY": API_KEY },  // ← safe here (server-side)
  });

  // Return response to client
  return NextResponse.json({ ... });
}
```

### Best Practices

- Always validate required config upfront
- Log errors to console (safe server-side)
- Return user-friendly error messages (don't expose API keys)
- Use `NextResponse.json()` for responses
- Don't expose raw API errors to browser — transform them

---

## File Organization

### Do's
- ✅ Keep components in `src/components/`
- ✅ Keep API routes in `app/api/`
- ✅ Keep config in `app/api/secrets.ts`
- ✅ Keep styles with components or in Tailwind
- ✅ Keep types inline or in dedicated `types.ts` files

### Don'ts
- ❌ Don't put API keys in components
- ❌ Don't hardcode values — use env vars
- ❌ Don't create deeply nested folders (keep it flat)
- ❌ Don't export from package.json unless necessary

---

## Testing Guidance for Agents

### Unit Testing

Not currently configured, but should test:
- API route validation (missing env vars)
- Error handling in components
- Event listeners on LiveAvatarSession

### Integration Testing

Manual in browser:
1. Click "Start Session"
2. Verify session token is fetched
3. Verify video stream appears
4. Verify audio/text chat works
5. Click controls (mute, interrupt, send)
6. Click "Stop Session"

### Debugging

- **Browser console:** Client-side logs
- **Server logs:** `npm run dev` output
- **Network tab:** Check `/api/start-session` request/response
- **HeyGen errors:** Read error messages carefully (they're descriptive)

---

## When to Ask the User

Ask for clarification on:
- **Cost decisions:** "This change will add a feature that creates more sessions — budget impact OK?"
- **Scope changes:** "Should we add LITE mode support too, or just FULL mode?"
- **Breaking changes:** "Refactoring the session component — should I preserve the current UI?"
- **Credentials:** "Do you have a context ID, or should we skip FULL mode setup?"

Don't assume answers on security, cost, or design decisions.

---

## Common Agent Mistakes to Avoid

❌ **Exposing secrets to browser** — API key must stay server-side  
❌ **Ignoring cost implications** — sessions burn credits  
❌ **Breaking existing UI** — preserve the start/stop workflow  
❌ **Not validating env vars** — always check before using them  
❌ **Logging sensitive data** — no API keys in console output  
❌ **Using deprecated Next.js APIs** — stick to App Router  

---

## Resources

- [HeyGen Live Avatar API](https://docs.liveavatar.com/api-reference)
- [Next.js 15 Docs](https://nextjs.org/docs)
- [React 19 Hooks](https://react.dev/reference/react/hooks)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
