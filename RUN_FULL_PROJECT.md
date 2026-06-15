# 🎯 RUN ENTIRE PROJECT - Step by Step Instructions

## ⚡ Quick Start (Automated Setup)

If you want everything to run automatically, use this script:

```powershell
cd c:\Users\LENOVO\Downloads\OpportuNet
.\SETUP_FULL.ps1
```

This will:
- ✅ Create all database tables
- ✅ Seed 1000+ job applications
- ✅ Build backend and frontend
- ✅ Show you next steps

**Then follow the "Next Steps" at the end of the script output.**

---

## 📋 Manual Setup (If Automated Doesn't Work)

### **STEP 1: Create Database Tables** (2 minutes)

```bash
cd c:\Users\LENOVO\Downloads\OpportuNet\lib\db
pnpm run push
```

**Expected output:**
```
✓ Migrations applied successfully
✓ Tables created
```

---

### **STEP 2: Seed Database with 1000+ Applications** (3 minutes)

First install dependencies:
```bash
cd c:\Users\LENOVO\Downloads\OpportuNet\lib\db
pnpm install
```

Then seed the data:
```bash
pnpm run seed-full
```

**Expected output:**
```
✨ DATABASE SEEDING COMPLETED SUCCESSFULLY! ✨
📊 Seeding Summary:
   ✅ Companies: 8
   ✅ Jobs: 40
   ✅ Users: 500
   ✅ Job Applications: 1200
   ✅ Colleges: 16
   ✅ Exams: 5
   ✅ Study Materials: 20
```

---

### **STEP 3: Install Root Dependencies** (2 minutes)

```bash
cd c:\Users\LENOVO\Downloads\OpportuNet
pnpm install
```

**You should see:**
```
✔ Hoisted 1234 packages
```

---

### **STEP 4: Build Backend** (2 minutes)

```bash
cd c:\Users\LENOVO\Downloads\OpportuNet\artifacts\api-server
pnpm install
pnpm run build
```

**Expected output:**
```
✔ Build successful
✔ dist/index.mjs created
```

---

### **STEP 5: Build Frontend** (2 minutes)

```bash
cd c:\Users\LENOVO\Downloads\OpportuNet\artifacts\job-portal
pnpm install
pnpm run build
```

**Expected output:**
```
✔ Built 1234 files
✔ dist/public/ created
```

---

## 🚀 RUN THE PROJECT

### **Terminal 1: Backend Server**

```bash
cd c:\Users\LENOVO\Downloads\OpportuNet\artifacts\api-server
pnpm run start
```

**You should see:**
```
Server is running on port 3008
Database connected
✓ Ready to accept requests
```

**Keep this terminal OPEN!**

---

### **Terminal 2: Frontend Development Server**

Open a **NEW terminal** and run:

```bash
cd c:\Users\LENOVO\Downloads\OpportuNet\artifacts\job-portal
pnpm run dev
```

**You should see:**
```
✔ [5173] Local: http://localhost:5173/
```

**Keep this terminal OPEN!**

---

## ✅ VERIFY EVERYTHING WORKS

### **Test 1: Backend API**

Open a third terminal and run:

```bash
curl http://localhost:3008/api/health
```

**Expected response:**
```json
{"status":"ok"}
```

---

### **Test 2: Frontend Loads**

Open your browser and visit:
```
http://localhost:5173
```

**You should see:**
- ✅ OpportuNet logo
- ✅ Login page with "Continue with Google" button
- ✅ No blank white screen
- ✅ No red errors in console (F12)

---

### **Test 3: Check Database Has 1000+ Applications**

In Supabase dashboard:
1. Go to https://supabase.com
2. Select your project
3. Go to **SQL Editor**
4. Run this query:

```sql
SELECT COUNT(*) as total_applications FROM applications;
```

**Should show:**
```
total_applications: 1200
```

---

### **Test 4: View Job Listings** (When implemented)

If your job listing page is implemented:
1. Go to http://localhost:5173
2. Navigate to Jobs section
3. You should see the 40 job postings we seeded
4. Each job should show application count

---

## 🐛 Troubleshooting

### **Issue: "Cannot find module '@workspace/db'"**

**Solution:**
```bash
cd c:\Users\LENOVO\Downloads\OpportuNet
pnpm install
```

Make sure you're installing from the ROOT directory, not from subfolders.

---

### **Issue: "Connection refused" or "Database error"**

**Solution:**
1. Check DATABASE_URL in `.env`:
   ```bash
   # Should look like:
   DATABASE_URL="postgresql://..."
   ```
2. Verify Supabase project is active
3. Test connection:
   ```bash
   cd lib/db
   pnpm run push
   ```

---

### **Issue: "Unexpected token 'T'" JSON error**

**Solution:**
1. Make sure backend is running (Terminal 1)
2. Make sure `VITE_API_BASE_URL=http://localhost:3008` in `.env`
3. Restart both terminals

---

### **Issue: Blank white screen in browser**

**Solution:**
1. Open DevTools (F12) → Console
2. Check for error messages
3. Verify environment variables are loaded
4. Try: `curl http://localhost:3008/api/auth/me` in terminal

---

### **Issue: Port 3008 already in use**

**Solution:**
```bash
# Find what's using port 3008
netstat -ano | findstr :3008

# Kill the process (replace XXXX with PID)
taskkill /PID XXXX /F

# Then restart backend
pnpm run start
```

---

### **Issue: pnpm: command not found**

**Solution:**
```bash
npm install -g pnpm
```

---

## 📊 What You Now Have

| Component | Status | Port |
|-----------|--------|------|
| Backend API | ✅ Running | 3008 |
| Frontend App | ✅ Running | 5173 |
| Database | ✅ Connected | Supabase |
| Companies | ✅ 8 seeded | - |
| Jobs | ✅ 40 seeded | - |
| Users | ✅ 500 created | - |
| Applications | ✅ 1200 seeded | - |
| Colleges | ✅ 16 seeded | - |
| Exams | ✅ 5 seeded | - |

---

## 🎯 Next Steps

1. **Test the app** - Try all features
2. **Check logs** - Look for any errors
3. **Verify database** - Count records
4. **Test API endpoints** - Use curl or Postman
5. **Deploy** - When everything works (see Render/Vercel guides)

---

## 📞 Common Commands Reference

```bash
# Build
pnpm run build                  # Backend
pnpm run build                  # Frontend (in job-portal)

# Run dev
pnpm run dev                    # Frontend only
pnpm run start                  # Backend only

# Database
pnpm run push                   # Create tables
pnpm run seed-full              # Seed 1000+ records
pnpm run seed                   # Original seed script

# Clean everything
pnpm clean                      # Delete node_modules
pnpm install                    # Reinstall everything
```

---

## ✨ You're All Set!

Your OpportuNet application is now:
- ✅ Fully set up
- ✅ Loaded with 1000+ realistic test data
- ✅ Backend running
- ✅ Frontend running
- ✅ Ready for testing and deployment

**Enjoy coding! 🚀**
