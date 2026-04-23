# Claude Code Guide for HeyGen Live Avatar Demo

## Project Overview

**live-avatar-demo** is a Next.js 15 application that integrates HeyGen's Live Avatar SDK for real-time conversational AI with video avatars.

**Purpose:** Demonstrate how to build a secure, production-ready web app that lets users have voice and text conversations with AI-powered avatars.

**Key Technologies:**
- Next.js 15 (App Router)
- React 19 with TypeScript
- Tailwind CSS
- @heygen/liveavatar-web-sdk
- Server-side API key handling

---

## Critical Context for Claude

### Security Architecture

**This app uses a server-side session token pattern.** Your HeyGen API key must NEVER appear in browser code.

```
Browser ─(session_token)→ Client SDK
                           ↓
Server ─(X-API-KEY)→ HeyGen API
```

**When modifying code:**
- ✅ Keep API key in `secrets.ts` (server-only)
- ✅ Read from `process.env.HEYGEN_API_KEY`
- ❌ Never hardcode the API key
- ❌ Never pass API key to client components
- ❌ Never log the API key to browser console

### Environment Variables

All configuration lives in `.env.local` (git-ignored):

```env
HEYGEN_API_KEY=...          # Secret — server-side only
HEYGEN_AVATAR_ID=...        # Public UUID
HEYGEN_VOICE_ID=...         # Public UUID
HEYGEN_CONTEXT_ID=...       # Public UUID
HEYGEN_SANDBOX=false        # bool
```

The `.env.example` template is committed and has no real values.

### Cost Model

Billing is per-minute during active sessions:
- **FULL mode:** 2 credits/min (built-in LLM + voice)
- **LITE mode:** 1 credit/min (custom LLM integration)
- **Sandbox mode:** Free (Wayne avatar only, is_sandbox=true)

**Free tier:** 10 credits/month (~5 min FULL)  
**Paid tier:** 1,000 credits/month (~500 min FULL), $0.10/extra credit

When testing locally, keep sessions short to avoid consuming credits.

---

## Project Structure

```
live-avatar-demo/
├── app/
│   ├── api/
│   │   ├── secrets.ts                 ← Config from env vars
│   │   ├── start-session/route.ts     ← POST: exchange API key for token
│   │   ├── stop-session/route.ts      ← POST: end session
│   │   └── keep-session-alive/route.ts ← POST: prevent timeout
│   ├── page.tsx                       ← Home page
│   └── layout.tsx
├── src/
│   └── components/
│       ├── LiveAvatarDemo.tsx         ← UI: setup screen + session loader
│       └── LiveAvatarSession.tsx      ← UI: video stream + controls
├── .env.example                       ← Template (commit this)
├── .env.local                         ← Your secrets (git-ignored)
├── README.md
├── package.json
└── tsconfig.json
```

### Key Files You'll Touch

| File | Purpose | Modify When |
|------|---------|------------|
| `app/api/secrets.ts` | Config from env | Adding new config variables |
| `app/api/start-session/route.ts` | Session creation | Changing API payload, adding error handling |
| `src/components/LiveAvatarSession.tsx` | Avatar UI + controls | Adding UI features, new controls |
| `src/components/LiveAvatarDemo.tsx` | Setup screen | Changing setup flow, adding validation |

---

## Common Tasks

### Add a New Environment Variable

1. Add to `.env.example` with description and empty value
2. Add to `.env.local` with your real value (don't commit)
3. Add to `app/api/secrets.ts` and export it
4. Import in any route/component that needs it

### Add a New API Route

1. Create `app/api/route-name/route.ts`
2. Export `POST`, `GET`, etc. as needed
3. Import from `app/api/secrets.ts` for config
4. Return `NextResponse.json({ ... })`

### Add a New UI Control

1. Add button/input to `src/components/LiveAvatarSession.tsx`
2. Create handler that calls a method on `sessionRef.current`
3. Example: `await sessionRef.current.interrupt()`

### Debug a Session Error

1. Check browser console for client errors
2. Check server logs from `npm run dev`
3. Verify `.env.local` has all required variables
4. Test API: `curl -X POST http://localhost:3000/api/start-session`
5. Check HeyGen error response

Common errors:
- **"Avatar is expired"** → Use a different avatar ID
- **"Not supported in sandbox mode"** → Set `HEYGEN_SANDBOX=false`
- **"Missing required fields"** → Check all env vars are set

---

## Testing

### Local Testing
```bash
npm install
npm run dev
# Open http://localhost:3000
```

### Testing Without Using Credits
Use **sandbox mode**:
```env
HEYGEN_SANDBOX=true
HEYGEN_AVATAR_ID=dd73ea75-1218-4ef3-92ce-606d5f7fbc0a
```

---

## Deployment

### To Vercel
```bash
vercel
```
Set env vars in Vercel dashboard → Settings → Environment Variables

### To Other Platforms
Standard Node.js/Next.js deployment with the same env vars.

---

## SDK Reference

### LiveAvatarSession Events
- `SESSION_STATE_CHANGED` — Connection state updates
- `SESSION_STREAM_READY` — Video ready, attach to `<video>` element
- `USER_SPEAK_STARTED/ENDED` — User speaking
- `AVATAR_SPEAK_STARTED/ENDED` — Avatar speaking
- `SESSION_CONNECTION_QUALITY_CHANGED` — Network quality

### LiveAvatarSession Methods
- `await session.start()` — Start stream
- `await session.stop()` — Stop stream
- `session.attach(videoElement)` — Bind video
- `await session.message(text)` — Send text (FULL mode)
- `await session.interrupt()` — Stop avatar speech
- `await session.voiceChat.mute()` / `unmute()` — Mute microphone

---

## Conventions

- Use TypeScript for all new code
- Use `const` by default
- Async/await over `.then()`
- Arrow functions for callbacks
- PascalCase component names
- Only comment the "why", not the "what"

---

## What NOT to Do

❌ Do NOT commit `.env.local` (git-ignored for security)
❌ Do NOT hardcode API keys
❌ Do NOT send API keys to the browser (server-side only)
❌ Do NOT modify `.gitignore` to allow `.env.local`
❌ Do NOT ignore HeyGen error responses
❌ Do NOT create long sessions (you burn credits)

---

## Resources

- [HeyGen Live Avatar Docs](https://docs.liveavatar.com/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [React 19 Docs](https://react.dev)
