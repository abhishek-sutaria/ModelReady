# Abhishek Sutaria — Personal Site

Minimal personal site inspired by [neelsomani.com](https://www.neelsomani.com/) for **[abhishek-sutaria.me](https://abhishek-sutaria.me)**.

Vite + React + TypeScript. Pages: **About**, **Projects**, **Experience**.

> Lives under `portfolio/` in the ModelReady repo because this cloud agent can only push there. For a dedicated repo, copy this folder into e.g. `abhishek-sutaria/abhishek-sutaria.me`.

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

## Deploy on `abhishek-sutaria.me`

Step-by-step for **Vercel + Namecheap Advanced DNS**: see **[DEPLOY.md](./DEPLOY.md)**.

Quick version: Vercel project root = `portfolio` → add domain `abhishek-sutaria.me` → Namecheap Advanced DNS:

| Type  | Host | Value                  | TTL  |
| ----- | ---- | ---------------------- | ---- |
| A     | `@`  | `76.76.21.21`          | Auto |
| CNAME | `www`| `cname.vercel-dns.com` | Auto |

## Content

- Copy: `src/data/content.ts`
- Resume: `public/resume.pdf`
- Optional photos: `public/profile.jpg`, `public/portrait.jpg`
