
# Pluto Protocol - Firebase Deployment Guide

This application is built to be "Firebase Native". It uses:
- **Firebase Hosting:** For global, fast, and free content delivery.
- **Firebase Firestore:** For real-time syncing of user data and admin configuration.
- **Firebase Auth:** (Optional) For email authentication.

## 🚀 How to Deploy (Updates)

Whenever you make changes to the code (colors, logos, features), follow these steps to push them live.

### 1. Install Firebase Tools (First time only)
Open your terminal and run:
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Initialize Project (First time only)
If you haven't linked this folder to your project yet:
```bash
firebase init
```
- Select **Hosting** and **Firestore**.
- Choose "Use an existing project" -> Select your project ID.
- "What do you want to use as your public directory?" -> Type **`dist`**
- "Configure as a single-page app?" -> **Yes**
- "Set up automatic builds and deploys with GitHub?" -> **No** (unless you want that)

### 4. Build & Deploy
This is the command you will run every time you want to update the live site:

```bash
npm run build && firebase deploy
```

---

## 🔧 Environment Variables

Before deploying, ensure you have a `.env` file in the root directory (or set these variables in your CI/CD pipeline).

See `.env.example` for the required keys.

**Important:** Since this is a Vite app, environment variables are "baked in" at build time. If you change your API keys, you must run `npm run build` again before deploying.

---

## ⚡ Dynamic Configuration (No Redeploy Needed)

You do **NOT** need to redeploy to change:
1. **Deposit Address**
2. **User Balances**
3. **Trade Outcomes**

Use the **Admin Desk** (Triple-click the Pluto Logo) to change these settings in real-time. The app listens to Firestore and updates all connected clients instantly.

---

## 🔐 Authentication Troubleshooting

### Google Auth Error: `auth/unauthorized-domain`

If you see this error when trying to sign in with Google, it means the domain you are using (e.g., `localhost`) hasn't been allowed in the Firebase Console.

**How to Fix:**
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project (**pluto-exchange-protocol**).
3. Navigate to **Authentication** (in the left sidebar) -> **Settings** (tab at the top).
4. Scroll down to **Authorized Domains**.
5. Click **Add Domain**.
6. Add the following:
   - `localhost`
   - `127.0.0.1`
   - Your deployed domain (e.g., `pluto-exchange-protocol.web.app`)
