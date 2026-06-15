# 🚀 QUICK START SETUP SCRIPT

Follow these steps **in order** to get your app working!

---

## **STEP 1: Fix Environment Variables** ✅ DONE

Added `VITE_API_BASE_URL=http://localhost:3008` to your `.env` file.

---

## **STEP 2: Create Database Tables**

### Option A: Using Drizzle Push (Easiest)

```bash
cd c:\Users\LENOVO\Downloads\OpportuNet\lib\db
pnpm run push
```

This will automatically create all tables in your Supabase database.

**Expected output:**
```
✓ Migrations applied
✓ All tables created
```

---

## **STEP 3: Seed Sample Data**

Run this in a terminal to add initial data:

```bash
cd c:\Users\LENOVO\Downloads\OpportuNet\lib\db
pnpm run seed
```

This will add:
- Sample companies (Google, Microsoft, Amazon)
- Sample jobs
- Sample exams
- Sample colleges

---

## **STEP 4: Start Backend Server**

Open a **new terminal** and run:

```bash
cd c:\Users\LENOVO\Downloads\OpportuNet\artifacts\api-server
pnpm run build
pnpm run start
```

**You should see:**
```
Server is running on port 3008
Database connected
```

✅ **Leave this terminal open!**

---

## **STEP 5: Start Frontend Development Server**

Open a **new terminal** and run:

```bash
cd c:\Users\LENOVO\Downloads\OpportuNet\artifacts\job-portal
pnpm run dev
```

**You should see:**
```
✔ [5173] Local: http://localhost:5173/
```

---

## **STEP 6: Test the Application**

1. Open your browser: **http://localhost:5173**
2. Open DevTools: **F12 → Console**
3. Click **"Continue with Google"** or **"Sign In"**

### ✅ Success Signs:
- Page loads without blank white screen
- No red errors in console
- Network tab shows API calls to `http://localhost:3008`
- API responses are JSON, not HTML

### ❌ If You Get Errors:

**Error: `Unexpected token 'T'`**
- Make sure backend is running (Step 4)
- Check backend is on http://localhost:3008
- Look at Network tab in DevTools

**Error: `Cannot find module '@workspace/db'`**
- Make sure you ran `pnpm install` from root
- Check pnpm-workspace.yaml exists in root

**Error: `Table does not exist`**
- Run Step 2 again (pnpm run push)
- Check migrations were created

---

## **STEP 7: Test API Endpoints Directly**

Open PowerShell and test these:

### Test Backend is Running:
```powershell
curl http://localhost:3008/api/health
```

Should return: `{"status":"ok"}`

### Test Auth Endpoint:
```powershell
curl http://localhost:3008/api/auth/me
```

Should return: `{"error":"Not authenticated"}` (this is expected if not logged in)

### Test Jobs Endpoint:
```powershell
curl http://localhost:3008/api/jobs
```

Should return a JSON array of jobs.

---

## **STEP 8: Create Test Account**

1. Go to http://localhost:5173
2. Click **"Sign In"** link if you see one, or look for sign-up button
3. Create account with:
   - Email: `test@example.com`
   - Password: `Test123456!`

---

## **Troubleshooting Commands**

### Check if port 3008 is in use:
```powershell
netstat -ano | findstr :3008
```

### Kill process using port 3008:
```powershell
taskkill /PID <PID_NUMBER> /F
```

### Check if pnpm modules are installed:
```bash
cd c:\Users\LENOVO\Downloads\OpportuNet
pnpm list
```

### Rebuild everything from scratch:
```bash
cd c:\Users\LENOVO\Downloads\OpportuNet

# Clean
pnpm clean

# Reinstall
pnpm install

# Build backend
cd artifacts/api-server
pnpm run build

# Build frontend
cd ..\job-portal
pnpm run build
```

---

## **Environment Variables Checklist**

Your `.env` should now have:

```
✅ PORT=3008
✅ DATABASE_URL=postgresql://...
✅ VITE_SUPABASE_URL=https://...
✅ VITE_SUPABASE_ANON_KEY=sb_publishable_...
✅ VITE_API_BASE_URL=http://localhost:3008
✅ FRONTEND_URL=http://localhost:5173
✅ OAUTH_CALLBACK_BASE_URL=http://localhost:5173
```

---

## **Expected File Structure After Setup**

```
OpportuNet/
├── .env (✅ Updated)
├── lib/db/
│   └── drizzle/
│       └── schema.ts (✅ Schema defined)
├── artifacts/
│   ├── api-server/
│   │   ├── dist/ (✅ Built files)
│   │   └── src/
│   └── job-portal/
│       ├── dist/ (✅ Built files)
│       └── src/
```

---

## **Before Deploying to Render/Vercel**

Once everything works locally:

1. **Update Backend Environment:**
   - Change `FRONTEND_URL` to your Vercel URL
   - Change `OAUTH_CALLBACK_BASE_URL` to your Vercel URL
   - Redeploy to Render

2. **Update Frontend Environment (in Vercel):**
   - Change `VITE_API_BASE_URL` to your Render URL
   - Redeploy to Vercel

3. **Update OAuth Providers:**
   - Add your Vercel domain to Google OAuth
   - Add your Vercel domain to GitHub OAuth

---

## **Commands Reference**

| What | Command |
|------|---------|
| Create database tables | `cd lib/db && pnpm run push` |
| Seed sample data | `cd lib/db && pnpm run seed` |
| Start backend | `cd artifacts/api-server && pnpm run start` |
| Start frontend | `cd artifacts/job-portal && pnpm run dev` |
| Build backend | `cd artifacts/api-server && pnpm run build` |
| Build frontend | `cd artifacts/job-portal && pnpm run build` |
| Test backend API | `curl http://localhost:3008/api/health` |
| Clean all | `pnpm clean` |
| Reinstall everything | `pnpm install` |

---

**Done! 🎉 Your app should be working now!**

If you encounter any issues, check the [AUTHENTICATION_AND_DATABASE_SETUP.md](./AUTHENTICATION_AND_DATABASE_SETUP.md) for detailed troubleshooting.
