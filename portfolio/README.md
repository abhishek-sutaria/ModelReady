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

## Deploy (Vercel + Namecheap)

1. Import the repo in [Vercel](https://vercel.com); set **Root Directory** to `portfolio` while nested here.
2. Framework: **Vite** — build `npm run build`, output `dist`.
3. Add domains `abhishek-sutaria.me` and optionally `www.abhishek-sutaria.me`.
4. Namecheap → Advanced DNS:

| Type  | Host | Value                  | TTL  |
| ----- | ---- | ---------------------- | ---- |
| A     | `@`  | `76.76.21.21`          | Auto |
| CNAME | `www`| `cname.vercel-dns.com` | Auto |

## Content

- Copy: `src/data/content.ts`
- Resume: `public/resume.pdf`
- Optional photos: `public/profile.jpg`, `public/portrait.jpg`
