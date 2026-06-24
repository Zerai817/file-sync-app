# Deploy SyncFlow Online (FREE) — Use on iPhone

Follow these steps to put your app on the internet for free. After this, open the URL on your iPhone Safari and sync files from anywhere.

---

## What you need (all free)

| Service | Purpose | Sign up |
|---------|---------|---------|
| **Neon** | Cloud database (stores users + files) | https://neon.tech |
| **GitHub** | Host your code | https://github.com |
| **Vercel** | Host the website | https://vercel.com |

---

## Step 1 — Create a free database (Neon)

1. Go to **https://neon.tech** and sign up (use Google/GitHub).
2. Click **New Project** → name it `syncflow`.
3. Copy the **Connection string** (starts with `postgresql://...`).
4. Keep this tab open — you'll need it in Step 4.

---

## Step 2 — Push code to GitHub

Open **PowerShell** in Cursor (`Ctrl + `` ` ``) and run:

```powershell
cd C:\Users\HP\Projects\file-sync-app
git init
git add .
git commit -m "SyncFlow app ready for deploy"
```

Then on GitHub:
1. Go to **https://github.com/new**
2. Create a repo named `file-sync-app` (Private or Public)
3. Copy the repo URL, then run (replace YOUR_USERNAME):

```powershell
git remote add origin https://github.com/YOUR_USERNAME/file-sync-app.git
git branch -M main
git push -u origin main
```

---

## Step 3 — Deploy on Vercel

1. Go to **https://vercel.com** and sign up with GitHub.
2. Click **Add New → Project**.
3. Import your `file-sync-app` repository.
4. Before clicking Deploy, add these **Environment Variables**:

| Name | Value |
|------|-------|
| `DATABASE_URL` | Your Neon connection string from Step 1 |
| `JWT_SECRET` | Any long random text (e.g. `my-super-secret-key-abc123xyz789`) |
| `STORAGE_MODE` | `database` |
| `MAX_FILE_SIZE_MB` | `25` |

5. Click **Deploy** and wait ~2 minutes.
6. You'll get a URL like: `https://file-sync-app-xxx.vercel.app`

---

## Step 4 — Use on your iPhone

1. Open **Safari** on iPhone.
2. Go to your Vercel URL (e.g. `https://file-sync-app-xxx.vercel.app`)
3. Tap **Sign up** and create an account.
4. Tap **Share** → **Add to Home Screen** (optional, works like an app).
5. Upload files on iPhone → they sync to the cloud database.
6. Open the same URL on your PC → tap **Sync Now** to download files.

### iPhone tips
- iOS uses **Manual Sync** mode (no folder access — that's normal).
- Tap **Sync Now** to download new files.
- Tap the **moon/sun icon** (top right) for dark mode.
- Max file size: **25 MB** per file on free tier.

---

## Step 5 — Update the app later

After you change code locally:

```powershell
cd C:\Users\HP\Projects\file-sync-app
git add .
git commit -m "Update app"
git push
```

Vercel redeploys automatically in ~1 minute.

---

## Local development (optional)

To run on your PC with the same cloud database:

1. Copy `.env.example` to `.env`
2. Paste your Neon `DATABASE_URL` and `JWT_SECRET`
3. Set `STORAGE_MODE=database`
4. Run:

```powershell
npm install
npm run db:push
npm run dev
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Build fails on Vercel | Check `DATABASE_URL` is correct and includes `?sslmode=require` |
| Login doesn't work | Make sure `JWT_SECRET` is set on Vercel |
| Upload fails | File may be over 25 MB — use smaller files on free tier |
| iPhone can't download | Tap Sync Now, then tap the download button on each file |
| Dark mode not saving | Clear Safari cache, or use Settings → Theme inside the app |

---

## Free tier limits

- **Neon**: 512 MB database storage (enough for hundreds of small files)
- **Vercel**: 100 GB bandwidth/month
- **File size**: 25 MB max per file (configurable)

When you outgrow free tier, upgrade Neon or Vercel — but free is enough to start.
