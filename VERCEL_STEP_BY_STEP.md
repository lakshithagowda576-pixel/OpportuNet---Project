# ✅ Vercel 404 Error - STEP-BY-STEP FIX

## Your Issue
Vercel deployment showing **404 NOT_FOUND** error.

## Root Cause
The Output Directory in Vercel is likely set to `dist` instead of `dist/public`.

---

## 🔧 EXACT STEPS TO FIX

### **STEP 1: Go to Vercel Dashboard**
1. Open: https://vercel.com/dashboard
2. Click on your **OpportuNet** project
3. You should see your project name and recent deployments

---

### **STEP 2: Go to Settings**
1. Click the **Settings** tab (at the top, next to Deployments)
2. On the left sidebar, click **General**

---

### **STEP 3: Fix Build Settings**
Look for this section: **"Build & Development Settings"**

**Find these fields and set them EXACTLY as shown:**

```
Root Directory:
┌─────────────────────────────┐
│ artifacts/job-portal        │  ← Make sure this is set
└─────────────────────────────┘

Build Command:
┌─────────────────────────────┐
│ pnpm run build              │  ← Should be this
└─────────────────────────────┘

Output Directory:
┌─────────────────────────────┐
│ dist/public                 │  ← **CRITICAL** Change if different!
└─────────────────────────────┘

Install Command:
┌─────────────────────────────┐
│ pnpm install                │  ← Should be this
└─────────────────────────────┘
```

⚠️ **The Output Directory is the most important!** If it says `dist` or anything else, change it to `dist/public`

**After making changes, scroll down and click "Save"**

---

### **STEP 4: Add Environment Variables**
1. In Settings sidebar, click **Environment Variables**
2. Click the **"Add New"** button (or **"+ New Environment Variable"**)
3. Add these three variables ONE BY ONE:

#### **Variable 1:**
```
Name:   VITE_SUPABASE_URL
Value:  https://vyjcsbrizpqxerhmuxfn.supabase.co
```
Then click **"Save"**

#### **Variable 2:**
```
Name:   VITE_SUPABASE_ANON_KEY
Value:  sb_publishable_i4c9pWLajSadnl3OaQ2EBw_yBEl1jZy
```
Then click **"Save"**

#### **Variable 3:**
```
Name:   VITE_API_BASE_URL
Value:  http://localhost:3008
```
(For production, use your real backend URL)
Then click **"Save"**

---

### **STEP 5: Redeploy**
1. Click the **Deployments** tab (at the top)
2. You should see your latest deployment with a ❌ or similar
3. Click the **...** (three dots) menu on that deployment
4. Click **Redeploy** 
   - **OR** Click the **"Redeploy"** button in the top right

5. A dialog will appear - just click **"Redeploy"** again to confirm

---

### **STEP 6: Wait for Deployment**
1. Watch the deployment progress
2. You should see: **Building** → **Deploying** → **Ready** ✅
3. This takes about 1-3 minutes

---

### **STEP 7: Test Your Live URL**
1. Once you see the green ✅ checkmark, click your project URL
2. The page should load (no 404 error!)
3. Press **F12** to open DevTools
4. Click the **Console** tab
5. Check for any red errors - there should be none

---

## ✅ Success Checklist

After completing all 7 steps:

- [ ] Page loads without 404 error
- [ ] Page content displays (not blank)
- [ ] Console has no red errors (F12 → Console)
- [ ] Images and styling visible
- [ ] Can click buttons and interact with page

---

## 🐛 If Something Goes Wrong

### Issue: Still Shows 404
**Solution:**
1. Verify Output Directory is exactly: `dist/public`
2. Check that all three environment variables are added
3. Try clearing browser cache (Ctrl+Shift+Delete)
4. Click **Redeploy** again

### Issue: Build Failed (red X)
**Solution:**
1. Click on the failed deployment
2. Click **View Logs**
3. Look at the bottom for red error text
4. Common errors:
   - `Cannot find module` → Missing environment variable
   - `ENOENT` → Missing file (usually fixed by now)
   - `SyntaxError` → Code error (should not happen - code is fixed)

### Issue: Blank Page with Console Errors
**Solution:**
1. Press **F12** → **Console** tab
2. Read the error message
3. Usually means VITE_API_BASE_URL is wrong
4. Or VITE_SUPABASE_* variables are missing

---

## 📞 Quick Reference

**Your Values (for copy-paste):**

```
Root Directory:        artifacts/job-portal
Build Command:         pnpm run build
Output Directory:      dist/public
Install Command:       pnpm install

VITE_SUPABASE_URL:     https://vyjcsbrizpqxerhmuxfn.supabase.co
VITE_SUPABASE_ANON_KEY: sb_publishable_i4c9pWLajSadnl3OaQ2EBw_yBEl1jZy
VITE_API_BASE_URL:     http://localhost:3008
```

---

**Expected Timeline:**
- Configuration: 5 minutes
- Redeploy: 2-3 minutes
- **Total: ~10 minutes until live site works! ✅**

Good luck! 🚀
