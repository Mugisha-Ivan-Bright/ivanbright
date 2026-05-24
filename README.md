# Mugisha Ivan Bright — Portfolio

A personal portfolio built with React, Vite, Tailwind CSS, and GSAP.

## Stack

- **Frontend**: React 19, Vite 8, Tailwind CSS 4, GSAP, Three.js
- **Backend** (serverless): Nodemailer
- **Fonts**: Syne (display), JetBrains Mono (code)

## Sections

- Hero — animated intro with 3D canvas
- Story — timeline of how I got here
- Engineering Depth — how I think about systems
- Growth Graph — visual builder activity journal
- Projects — real things I built
- My Time — futuristic countdown dashboard
- Skills, Community, Why I Build, Failures, Obsession, Becoming, Beliefs, Contact

## Getting Started (Local Dev)

```bash
npm install
npm run dev        # frontend on port 5173
npm run server     # backend on port 3001
```

## Deploy to Vercel (Frontend + API)

The backend runs as [Vercel Serverless Functions](https://vercel.com/docs/functions) inside the same project — no separate server needed.

1. Push to GitHub
2. Import repo into Vercel
3. Vercel auto-detects Vite (build: `npm run build`, output: `dist`)
4. Set environment variables in Vercel dashboard → Project Settings:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=mugishaivanbright250@gmail.com
SMTP_PASS=your-gmail-app-password
```

5. Deploy. Done.

The `vercel.json` rewrites all non-API routes to `index.html` for SPA routing.  
API routes (`/api/time`, `/api/contact`) are handled by the functions in `/api/`.

## Environment Variables (local)

| Variable | Purpose |
|---|---|
| `SMTP_HOST` | Gmail SMTP |
| `SMTP_PORT` | 587 |
| `SMTP_USER` | your email |
| `SMTP_PASS` | Gmail app password |
| `VITE_API_URL` | backend URL (dev only, default `http://localhost:3001`) |

## Build

```bash
npm run build
```

Output goes to `dist/`.

## License

MIT
