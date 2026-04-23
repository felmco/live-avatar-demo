# HeyGen Live Avatar Demo

A production-ready demo application showcasing HeyGen's Live Avatar SDK with voice chat and text messaging, built with Next.js 15 and React 19.

## Overview

This app demonstrates how to integrate HeyGen's Live Avatar into a web application. Users can have real-time conversations with an AI-powered avatar using voice or text input. The avatar responds intelligently based on the LLM context you configure in your HeyGen dashboard.

**Key Features:**
- ✅ Real-time video streaming of a lifelike avatar
- ✅ Voice chat with automatic speech recognition and synthesis
- ✅ Text-based messaging as an alternative input method
- ✅ Secure server-side API key handling
- ✅ Support for multiple avatars and LLM configurations
- ✅ Sandbox mode for free testing (limited to "Wayne" avatar)

---

## How It Works

### Architecture

The app uses a secure **session token** pattern to keep your HeyGen API key private:

```
┌─────────────────┐
│     Browser     │
│  (Live Avatar   │
│   SDK Client)   │
└────────┬────────┘
         │ session_token
         ↓
┌─────────────────────────┐
│  Next.js API Routes     │
│ (/api/start-session)    │
│                         │
│ [Keep API Key Secret]   │
└────────┬────────────────┘
         │ X-API-KEY header
         ↓
┌──────────────────────────┐
│  HeyGen API              │
│ api.liveavatar.com       │
└──────────────────────────┘
```

**Why this matters:** Your HeyGen API key is a secret. It never leaves the server. The browser only receives a short-lived, single-use session token that authorizes it to connect to the avatar stream.

---

## Prerequisites

### Required
1. **Node.js 18+** — Install from [nodejs.org](https://nodejs.org)
2. **HeyGen Account** — Sign up at [app.liveavatar.com](https://app.liveavatar.com)
3. **HeyGen API Key** — Get from [app.liveavatar.com/developers](https://app.liveavatar.com/developers)

### For Production (FULL mode with AI conversations)
4. **Avatar ID** — Use a public avatar or one from your HeyGen account
5. **Voice ID** — The avatar's voice (create at [app.liveavatar.com/voices](https://app.liveavatar.com/voices))
6. **Context ID** — LLM persona configuration (create at [app.liveavatar.com/context](https://app.liveavatar.com/context))

### Optional (Sandbox testing)
- Use **sandbox mode** for free testing with the "Wayne" avatar (no credentials needed beyond API key)

---

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/felmco/live-avatar-demo.git
cd live-avatar-demo
npm install
```

### 2. Configure Environment Variables

Copy the example file:
```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your credentials from HeyGen:

```env
HEYGEN_API_KEY=your_api_key_here
HEYGEN_AVATAR_ID=avatar_uuid_here
HEYGEN_VOICE_ID=voice_uuid_here
HEYGEN_CONTEXT_ID=context_uuid_here
HEYGEN_SANDBOX=false
```

**Note:** `.env.local` is git-ignored and will never be committed to GitHub.

### 3. Run the Dev Server

```bash
npm run dev
```

The app opens at [http://localhost:3000](http://localhost:3000)

### 4. Start a Session

1. Click **"Start Session"** on the page
2. Wait for the avatar video stream to appear
3. Speak into your microphone or type a message
4. The avatar will respond with text-to-speech audio

---

## Configuration Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `HEYGEN_API_KEY` | ✅ Yes | Your HeyGen API key | `da0a0a12-0e82...` |
| `HEYGEN_AVATAR_ID` | ✅ Yes | UUID of the avatar to use | `513fd1b7-7ef9...` |
| `HEYGEN_VOICE_ID` | ✅ Yes (FULL mode) | Avatar voice UUID | `0b8a593c-be7d...` |
| `HEYGEN_CONTEXT_ID` | ✅ Yes (FULL mode) | LLM persona configuration UUID | `2038b859-4827...` |
| `HEYGEN_SANDBOX` | Optional | Enable free sandbox mode (only "Wayne" avatar) | `true` or `false` |

### How to Get These IDs

**API Key:**
1. Go to [app.liveavatar.com/developers](https://app.liveavatar.com/developers)
2. Copy your API key

**Avatar ID:**
- Use a **public avatar** (any avatar with status `ACTIVE`)
- Or create your own in [app.liveavatar.com](https://app.liveavatar.com)
- List public avatars: `GET https://api.liveavatar.com/v1/avatars/public`

**Voice ID:**
- Create a voice in [app.liveavatar.com/voices](https://app.liveavatar.com/voices)
- Or use the avatar's default voice

**Context ID:**
- Create an LLM persona in [app.liveavatar.com/context](https://app.liveavatar.com/context)
- This defines the avatar's personality and response style

---

## Session Modes

### FULL Mode (Recommended)

The avatar runs an end-to-end conversation with a built-in LLM.

| Property | Value |
|----------|-------|
| **Cost** | 2 credits/minute |
| **Setup** | Requires Avatar ID, Voice ID, Context ID |
| **Capabilities** | Voice chat + text chat, auto-generated responses |
| **Best for** | Customer service, conversational AI, interactive storytelling |

### LITE Mode

You supply your own LLM (e.g., OpenAI) and TTS provider (e.g., ElevenLabs). The SDK handles avatar speech only.

| Property | Value |
|----------|-------|
| **Cost** | 1 credit/minute (cheaper, but no built-in LLM) |
| **Setup** | Requires your own LLM + TTS setup |
| **Capabilities** | You control conversation logic completely |
| **Best for** | Custom integrations, existing chatbot backends |

---

## Cost & Billing

### Credits Model

Billing is per-minute based on session usage. One credit = one minute at base rate (varies by mode).

| Mode | Credit Cost | Free Tier Capacity | Paid Tier Capacity |
|------|-------------|--------------------|--------------------|
| **FULL** | 2 credits/min | ~5 min/month | ~500 min/month |
| **LITE** | 1 credit/min | ~10 min/month | ~1,000 min/month |

### Tiers

| Tier | Monthly Credits | Cost | Overage |
|------|-----------------|------|---------|
| **Free** | 10 | $0 | N/A — hits limit |
| **Paid** | 1,000 | Varies by plan | $0.10/extra credit |

### Sandbox Mode (Free)

- ✅ Completely free — zero credits consumed
- ❌ Limited to "Wayne" avatar only (`dd73ea75-1218-4ef3-92ce-606d5f7fbc0a`)
- ✅ Perfect for development and testing

To enable sandbox mode:
```env
HEYGEN_SANDBOX=true
```

### Examples

- **Voice chat for 10 minutes (FULL mode):** 10 × 2 = 20 credits
- **Text chat for 5 minutes (FULL mode):** 5 × 2 = 10 credits
- **Free tier:** 10 credits/month = ~5 min FULL mode, ~10 min LITE mode

Once you exhaust your free tier, you'll need to add payment or enable overage billing ($0.10/credit).

---

## Controls

### Start Session
Click **"Start Session"** to initialize the avatar and fetch a session token from the server.

### Voice Chat
- **Microphone enabled by default** — the avatar listens and responds to speech
- Click **"Mute Mic"** to disable voice input (switch to text-only)
- Click **"Unmute Mic"** to re-enable listening

### Text Chat
Type a message and press **Enter** or click **"Send"** to send text to the avatar.

### Interrupt
Click **"Interrupt"** to stop the avatar mid-speech. Useful if you want to ask a follow-up question without waiting.

### Stop Session
Click **"Stop Session"** to end the session and disconnect from the avatar. You'll be returned to the start screen.

---

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org) (App Router)
- **UI Library:** [React 19](https://react.dev)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **Avatar SDK:** [@heygen/liveavatar-web-sdk](https://www.npmjs.com/package/@heygen/liveavatar-web-sdk)
- **Runtime:** Node.js

---

## Project Structure

```
app/
├── api/
│   ├── secrets.ts                 # Config loaded from env vars
│   ├── start-session/route.ts     # Exchange API key for session token
│   ├── stop-session/route.ts      # End session (stub)
│   └── keep-session-alive/route.ts # Prevent timeout (stub)
├── page.tsx                        # Home page entry point
└── layout.tsx
src/
└── components/
    ├── LiveAvatarDemo.tsx         # Session setup UI
    └── LiveAvatarSession.tsx       # Avatar stream + controls
.env.example                        # Template (safe to commit)
.env.local                          # Your secrets (git-ignored)
```

---

## Development

### Run Development Server
```bash
npm run dev
```
Opens [http://localhost:3000](http://localhost:3000) with hot reload.

### Build for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

---

## Security Notes

1. **API Key is Server-Side Only**
   - Never expose your `HEYGEN_API_KEY` to the browser
   - The `/api/start-session` route handles the secret exchange
   - The browser receives only a time-limited session token

2. **Session Tokens are Ephemeral**
   - Each token is valid for one session only
   - Tokens expire after the session ends
   - Tokens cannot be reused

3. **.env.local is Git-Ignored**
   - Your credentials are never committed to version control
   - Each developer has their own `.env.local` file
   - Use `.env.example` to document required variables

---

## Troubleshooting

### "Bad request error" or "Avatar is expired"
- Your avatar ID is no longer active
- **Solution:** Use a public avatar or create a new one in your HeyGen dashboard

### "Avatar is not supported in sandbox mode"
- Public avatars don't work in sandbox mode
- **Solution:** Either disable sandbox mode (`HEYGEN_SANDBOX=false`) or use only the "Wayne" avatar in sandbox

### "HEYGEN_VOICE_ID and HEYGEN_CONTEXT_ID must be set"
- Missing required environment variables
- **Solution:** Fill in all required fields in `.env.local` and restart the dev server

### Session cuts off after ~1 minute
- Likely in sandbox mode
- **Solution:** Verify `HEYGEN_SANDBOX=false` in `.env.local`

### Microphone not working
- Browser permission denied
- **Solution:** Check browser permissions for microphone access and reload the page

---

## Deployment

### Deploy to Vercel (Recommended)

The easiest way to deploy:

```bash
npm install -g vercel
vercel
```

Then set environment variables in the Vercel dashboard:
- Go to **Settings > Environment Variables**
- Add all `HEYGEN_*` variables
- Redeploy

### Deploy Elsewhere

This is a standard Next.js app. It runs on any Node.js host:
- AWS, Google Cloud, Azure, DigitalOcean, Railway, Render, etc.
- Just set the environment variables before deploying

---

## License

This demo is open source. See [LICENSE](LICENSE) for details.

---

## Resources

- [HeyGen Live Avatar Docs](https://docs.liveavatar.com/)
- [HeyGen API Reference](https://docs.liveavatar.com/api-reference)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## Questions?

- Check [HeyGen's FAQ](https://docs.liveavatar.com/faq)
- Review [API error responses](https://docs.liveavatar.com/api-reference)
- Open an issue on GitHub
