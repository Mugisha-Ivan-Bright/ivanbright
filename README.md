# Mugisha Ivan Bright — Portfolio

A personal portfolio built with React, Vite, Tailwind CSS, and GSAP.

## Stack

- **Frontend**: React 19, Vite 8, Tailwind CSS 4, GSAP, Three.js
- **Backend** (contact form): Express, Nodemailer
- **Fonts**: Syne (display), JetBrains Mono (code)

## Sections

- Hero — animated intro with 3D canvas
- Story — timeline of how I got here
- Engineering Depth — how I think about systems
- Growth Graph — visual builder activity journal
- Projects — real things I built
- My Time — futuristic countdown dashboard
- Skills, Community, Why I Build, Failures, Obsession, Becoming, Beliefs, Contact

## Getting Started

```bash
# install dependencies
npm install

# start frontend dev server
npm run dev

# start backend (for contact form + time sync)
npm run server
```

## Environment

Copy `.env` and fill in:

| Variable | Purpose |
|---|---|
| `SMTP_HOST` | Gmail SMTP |
| `SMTP_PORT` | 587 |
| `SMTP_USER` | your email |
| `SMTP_PASS` | Gmail app password |
| `VITE_API_URL` | backend URL (default `http://localhost:3001`) |

## Build

```bash
npm run build
```

Output goes to `dist/`.

## License

MIT
