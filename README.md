# SyncFlow — Cross-Platform Personal File Sync

A modern full-stack web application for syncing files across iOS, Android, and Desktop browsers using a single account.

## Features

- **Progressive enhancement** — File System Access API on Chrome/Edge/Desktop; manual upload/download fallback on iOS Safari
- **Multi-device sync** — Register and manage multiple devices per account
- **Multi-language UI** — English, French, and Arabic (with RTL support)
- **JWT authentication** — Secure email/password login with HTTP-only cookies
- **Offline queue** — Uploads queued locally when offline, synced on reconnect
- **Dark mode** — Optional dark theme
- **Responsive design** — Works on iPhone, iPad, Android, and desktop browsers

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TailwindCSS 4 |
| Backend | Next.js API Routes |
| Database | SQLite (dev) / PostgreSQL (prod) via Prisma |
| Auth | JWT (jose) + bcrypt |
| i18n | next-intl |
| Storage | Local filesystem (`./uploads`) |

## Quick Start

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
cd Projects/file-sync-app
npm install
npm run db:push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production (PostgreSQL)

1. Start PostgreSQL (optional Docker):

```bash
docker compose up -d
```

2. Update `.env`:

```
DATABASE_URL="postgresql://filesync:filesync@localhost:5432/filesync?schema=public"
JWT_SECRET="your-long-random-secret"
```

3. Change `provider` in `prisma/schema.prisma` from `sqlite` to `postgresql`, then:

```bash
npm run db:push
npm run build
npm start
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| POST | `/api/auth/logout` | Sign out |
| GET | `/api/user/devices` | List devices |
| PATCH | `/api/user/settings` | Update user settings |
| POST | `/api/devices/register` | Register current device |
| PATCH | `/api/devices/:id` | Update device |
| DELETE | `/api/devices/:id` | Remove device |
| GET | `/api/files` | List files |
| POST | `/api/files/upload` | Upload file |
| GET | `/api/files/:id` | Download file |
| DELETE | `/api/files/:id` | Delete file |
| POST | `/api/sync` | Trigger sync |
| GET | `/api/sync/status` | Sync status |

## Browser Compatibility

| Feature | Chrome/Edge Desktop | Android Chrome | iOS Safari |
|---------|--------------------|--------------------|------------|
| Folder sync (File System Access) | ✅ | ✅ (limited) | ❌ |
| File upload | ✅ | ✅ | ✅ |
| Manual download | ✅ | ✅ | ✅ |
| Manual sync button | ✅ | ✅ | ✅ |
| Offline queue | ✅ | ✅ | ✅ |

## Sync Behavior

- Sync runs on **app open** and when clicking **Sync Now**
- No background sync (by design, for iOS compatibility)
- Auto mode writes files to a selected local folder (where supported)
- Manual mode triggers browser download prompts (iOS Safari)

## Project Structure

```
src/
├── app/
│   ├── [locale]/          # Localized pages
│   └── api/               # REST API routes
├── components/            # UI components
├── hooks/                 # Client hooks (auth, sync, devices)
├── i18n/                  # Internationalization config
├── lib/                   # Server utilities
└── types/                 # TypeScript declarations
messages/                  # Translation files (en, fr, ar)
prisma/                    # Database schema
uploads/                   # File storage (gitignored)
```

## License

MIT
