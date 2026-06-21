# 🚀 Vercel Deployment - Complete Setup & Fixes

## ✅ Recent Fixes Applied (June 21, 2026)

### Build Issues Resolved:
- ✅ Removed `"use client"` directives from Vite components (caused sourcemap errors)
- ✅ Disabled sourcemaps in vite.config.ts
- ✅ Project builds cleanly: 3224 modules transformed successfully
- ✅ Output: `dist/public/index.html` + assets

---

## 🔧 Vercel Configuration Checklist

### **STEP 1: Verify GitHub Connection**
- [ ] Repository synced to GitHub: `lakshithagowda576-pixel/OpportuNet`
- [ ] Latest commit includes frontend fixes
- [ ] Check: https://github.com/lakshithagowda576-pixel/OpportuNet/tree/main/artifacts/job-portal

### **STEP 2: Vercel Project Settings**
Go to Vercel Dashboard → Select OpportuNet Project → **Settings** → **General**

#### **Build & Development Settings:**
- [ ] **Root Directory**: `artifacts/job-portal`
- [ ] **Framework Preset**: Vite
- [ ] **Build Command**: `pnpm run build`
- [ ] **Output Directory**: `dist/public`
- [ ] **Install Command**: `pnpm install`

**⚠️ CRITICAL**: If Output Directory says `dist` instead of `dist/public`, change it!

---

### **STEP 3: Environment Variables**
Go to **Settings** → **Environment Variables**

Add these variables (REQUIRED for build):

```
VITE_SUPABASE_URL=https://vyjcsbrizpqxerhmuxfn.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_i4c9pWLajSadnl3OaQ2EBw_yBEl1jZy
VITE_API_BASE_URL=https://your-backend-url.com
```

⚠️ **For VITE_API_BASE_URL**, use:
- Development: `http://localhost:3008`
- Production: Your production backend URL (e.g., Render, Railway, etc.)

---

### **STEP 4: Redeploy**
1. Go to **Deployments** tab
2. Click on latest deployment
3. Click **Redeploy** button (top right)
4. Select **Use existing Build Cache** (optional, for faster rebuild)
5. Wait for deployment to complete

---

## 🔍 Troubleshooting

### **Issue: 404 NOT_FOUND on Vercel**

**Cause**: Usually one of these:
1. ❌ Output Directory set to `dist` instead of `dist/public`
2. ❌ Missing or incorrect environment variables
3. ❌ Root Directory not set to `artifacts/job-portal`
4. ❌ Build failed (check Build Logs)

**Fix**:
```
Vercel Dashboard → Your Project → Settings → General

1. Root Directory: artifacts/job-portal ✅
2. Output Directory: dist/public ✅
3. Build Command: pnpm run build ✅
```

Then redeploy.

---

### **Issue: Build Fails with "Module not found"**

**Check Build Logs:**
1. Deployments → Latest Deployment
2. Click **View Logs** (or **Build Logs**)
3. Look for red error messages

**Common Causes:**
- Missing VITE_* environment variables during build
- Node version mismatch
- pnpm lockfile corruption

**Fix**:
```bash
# Clear cache and rebuild
1. Vercel Dashboard → Settings → Git
2. Click "Disconnect Git"
3. Reconnect and redeploy
```

---

### **Issue: "Cannot find module @workspace/..."**

**Cause**: Monorepo dependencies not installed correctly

**Fix:**
1. Ensure `.npmrc` or `pnpm-workspace.yaml` is committed to GitHub
2. Vercel should run `pnpm install` which reads monorepo config
3. If still failing, check that all workspace packages are published

---

## 📋 Pre-Deployment Checklist

Before deploying to Vercel:

- [ ] Local build works: `pnpm run build` → Creates `dist/public/index.html` ✅
- [ ] Local dev server works: `pnpm run dev` → Runs on port 5173 ✅
- [ ] No TypeScript errors: `pnpm run typecheck` ✅
- [ ] All changes committed to GitHub ✅
- [ ] Environment variables added to Vercel ✅
- [ ] Output Directory set to `dist/public` ✅

---

## 🚀 Quick Deploy Steps

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Latest fixes"
   git push origin main
   ```

2. **Redeploy on Vercel**:
   - Go to https://vercel.com
   - Select OpportuNet project
   - Click **Deployments**
   - Click **Redeploy** on latest deployment
   - Or let auto-deploy trigger (if enabled)

3. **Verify Deployment**:
   - Wait for deployment to complete (green checkmark)
   - Click on project URL to visit live site
   - Check browser console (F12) for any errors

---

## 📊 Build Output Reference

Current successful build output:
```
✓ 3224 modules transformed.
dist/public/index.html                     0.78 kB │ gzip:   0.44 kB
dist/public/assets/index-C5E__luK.css    178.90 kB │ gzip:  25.91 kB
dist/public/assets/index-CxQE5v9r.js   1,405.39 kB │ gzip: 392.35 kB
✓ built in 1m 19s
```

**Note**: Large chunk size warning is normal and won't cause deployment failures.

---

## 🔗 Related Documentation

- **Local Setup**: [RUN_FULL_PROJECT.md](./RUN_FULL_PROJECT.md)
- **Database Setup**: [DATABASE_REFERENCE.md](./DATABASE_REFERENCE.md)
- **Authentication**: [AUTHENTICATION_AND_DATABASE_SETUP.md](./AUTHENTICATION_AND_DATABASE_SETUP.md)
- **Backend Deployment**: [RENDER_DEPLOYMENT_GUIDE.md](./RENDER_DEPLOYMENT_GUIDE.md)

---

## ✨ Success Indicators

Once deployed successfully:
- ✅ Live URL loads without 404 errors
- ✅ Page content displays (not blank)
- ✅ No console errors (F12 → Console tab)
- ✅ API calls go to correct backend
- ✅ Images and styles load correctly

---

**Last Updated**: June 21, 2026
**Status**: ✅ Ready for Vercel Deployment
