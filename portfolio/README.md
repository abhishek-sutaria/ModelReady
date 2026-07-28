# Abhishek Sutaria — Portfolio (`abhishek-sutaria.me`)

Vite + React + TypeScript personal site for **[abhishek-sutaria.me](https://abhishek-sutaria.me)**.

> This starter currently lives under `portfolio/` in the ModelReady repo because the cloud agent can only push to that repository. To develop in a dedicated GitHub repo: create an empty repo (e.g. `abhishek-sutaria/abhishek-sutaria.me`), copy this folder into it, and continue there.

## Develop

```bash
cd portfolio
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

## Deploy to Vercel + Namecheap domain

1. Import the GitHub repo (or this `portfolio/` folder as the project root) into [Vercel](https://vercel.com).
2. Framework preset: **Vite** — build `npm run build`, output `dist`.
   - If the app stays nested in ModelReady, set **Root Directory** to `portfolio`.
3. Vercel → Project → Settings → Domains, add:
   - `abhishek-sutaria.me`
   - `www.abhishek-sutaria.me` (optional)
4. Namecheap → Domain List → `abhishek-sutaria.me` → **Advanced DNS**:

| Type  | Host | Value                  | TTL  |
| ----- | ---- | ---------------------- | ---- |
| A     | `@`  | `76.76.21.21`          | Auto |
| CNAME | `www`| `cname.vercel-dns.com` | Auto |

Use the exact records Vercel shows if they differ.

5. Wait for DNS, then confirm HTTPS in Vercel.

## Content

- Resume: `public/resume.pdf`
- Photos: `public/profile.jpg`, `public/portrait.jpg`
- Copy: `src/data/content.ts`
