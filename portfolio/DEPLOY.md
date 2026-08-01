# Host on `abhishek-sutaria.me` (Namecheap + Vercel)

Your domain **abhishek-sutaria.me** is registered at Namecheap. This site is a static Vite app — the easiest host is **Vercel** (free), then you point Namecheap DNS at it.

> Right now the domain’s A records point at **GitHub Pages** (`185.199.x.x`). You’ll replace those with Vercel’s records below.

---

## 1. Deploy on Vercel (~3 minutes)

1. Go to [vercel.com](https://vercel.com) and sign in with **GitHub** (`abhishek-sutaria`).
2. **Add New… → Project** → import **`abhishek-sutaria/ModelReady`**.
3. Before deploying, open **Root Directory** → set to:
   ```
   portfolio
   ```
4. Framework Preset should be **Vite**. Leave build as `npm run build` / output `dist`.
5. Click **Deploy**.

When the deploy finishes you’ll get a URL like  
`https://modelready-….vercel.app` — open it and confirm About / Projects / Experience work.

*(Optional later: move this folder into its own repo `abhishek-sutaria.me` and redeploy from that root — not required.)*

---

## 2. Attach the custom domain in Vercel

1. In the Vercel project → **Settings → Domains**.
2. Add:
   - `abhishek-sutaria.me`
   - `www.abhishek-sutaria.me`
3. Vercel will show the DNS records it wants. Use the table in step 3 (standard Vercel values).

---

## 3. Point Namecheap DNS at Vercel

In Namecheap (the Domain List screen you shared):

1. Click **Manage** next to **abhishek-sutaria.me**.
2. Open the **Advanced DNS** tab.
3. Under **Host Records**, remove old GitHub Pages / parking records for `@` and `www` (A records `185.199.*`, etc.).
4. Add / keep exactly:

| Type  | Host | Value                  | TTL  |
| ----- | ---- | ---------------------- | ---- |
| **A**     | `@`  | `76.76.21.21`          | Automatic |
| **CNAME** | `www`| `cname.vercel-dns.com` | Automatic |

5. Save. Leave **Domain Privacy** ON (already on — good).

DNS usually updates in a few minutes; can take up to ~30 minutes.

---

## 4. Verify

```bash
dig +short abhishek-sutaria.me A
# expect: 76.76.21.21

dig +short www.abhishek-sutaria.me CNAME
# expect: cname.vercel-dns.com.
```

Then open:

- https://abhishek-sutaria.me  
- https://www.abhishek-sutaria.me  

Vercel will provision HTTPS automatically once DNS is correct (green check on Domains).

---

## What you do **not** need

- Namecheap Shared / WordPress hosting (not needed for this site)
- Buying SSL from Namecheap (Vercel includes HTTPS)
- Changing nameservers away from Namecheap unless you want to — keep `dns1/dns2.registrar-servers.com` and only edit **Advanced DNS** host records

---

## Updating the site later

Push to the branch Vercel deploys from (after merge: `main`, or wire the project to `cursor/neel-style-portfolio-48a2` until then). Vercel rebuilds automatically.
