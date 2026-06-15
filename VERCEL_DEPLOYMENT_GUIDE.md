# OpportuNet Frontend - Vercel Deployment Guide

Complete step-by-step guide to deploy the OpportuNet Job Portal frontend to Vercel.

---

## STEP 1: Prepare Your Frontend Project Locally

### 1.1 Verify Build Works Locally
```bash
cd c:\Users\LENOVO\Downloads\OpportuNet
pnpm install
cd artifacts/job-portal
pnpm run build
```

Expected output: `dist/public/` folder should be created with `index.html` and assets.

### 1.2 Preview Build Locally
```bash
pnpm run serve
```

Visit `http://localhost:4173` and verify the app loads correctly.

---

## STEP 2: Push Frontend Code to GitHub

### 2.1 Ensure Code is on GitHub
Your OpportuNet repository on GitHub should contain the full project including `artifacts/job-portal/`.

```bash
cd c:\Users\LENOVO\Downloads\OpportuNet
git add .
git commit -m "Add job portal frontend"
git push origin main
```

### 2.2 Verify on GitHub
Navigate to `https://github.com/YOUR_USERNAME/OpportuNet/tree/main/artifacts/job-portal`
- You should see all the frontend files there

---

## STEP 3: Create Vercel Account & Deploy

### 3.1 Create Vercel Account
1. Go to https://vercel.com
2. Click **"Sign Up"** and choose **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub repositories
4. Verify your email

### 3.2 Create New Vercel Project
1. In Vercel dashboard, click **"Add New..."** → **"Project"**
2. Find and select your **`OpportuNet`** repository
3. Click **"Import"**

### 3.3 Configure Project Settings

#### **Root Directory**
- Set to: `artifacts/job-portal`
- This tells Vercel where the frontend code is

#### **Framework Preset**
- Select: **"Vite"**
- Vercel should auto-detect this

#### **Build Command**
- Set to: `pnpm run build`
- (Default should work, but verify it's set)

#### **Output Directory**
- Set to: `dist/public`
- This is where Vite outputs the built files

#### **Install Command**
- Set to: `pnpm install`

---

## STEP 4: Configure Environment Variables

### 4.1 Add Environment Variables in Vercel Dashboard

After importing the project, go to **Settings** → **Environment Variables** and add:

```
VITE_SUPABASE_URL=https://your-supabase-url.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=https://your-api-backend-url.onrender.com
```

⚠️ **IMPORTANT**: Replace `https://opportunet-api-backend.onrender.com` with your actual backend URL from Render!

### 4.2 Required Environment Variables Explained

| Variable | Value | Purpose |
|----------|-------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Supabase authentication |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase public key | Public API access to Supabase |
| `VITE_API_BASE_URL` | Your Render backend URL | API endpoint for backend calls |

---

## STEP 5: Deploy

### 5.1 Deploy from Vercel Dashboard
1. After configuring environment variables, click **"Deploy"**
2. Vercel will start the build process
3. Watch the deployment logs in real-time

### 5.2 Monitor Deployment
- Check **"Deployments"** tab in Vercel
- Look for green checkmark ✅ indicating successful deployment
- If there are errors, see **Troubleshooting** section

### 5.3 Get Your Live URL
Once deployment completes successfully:
- Your frontend will have a URL like: `https://opportunet-frontend.vercel.app`
- Or a custom domain if you've configured one

---

## STEP 6: Verify Deployment

### 6.1 Test Frontend
1. Open your Vercel URL in browser
2. Verify the app loads completely
3. Check browser console (F12) for any errors

### 6.2 Test API Connection
1. Try logging in (if login is available)
2. Try fetching data from API
3. Check Network tab (F12) to verify API calls go to your Render backend

### 6.3 Check Vercel Logs
- In Vercel dashboard → **Deployments** → Click on deployment → **View Logs**
- Should see no error messages
- Should see successful build output

---

## STEP 7: Update Backend for Frontend URL

### 7.1 Update Backend Environment Variables
Go back to your **Render dashboard** for the backend service and update:

```
FRONTEND_URL=https://opportunet-frontend.vercel.app
OAUTH_CALLBACK_BASE_URL=https://opportunet-frontend.vercel.app
```

Replace `https://opportunet-frontend.vercel.app` with your actual Vercel URL.

### 7.2 Redeploy Backend
In Render dashboard:
1. Click your service
2. Click **"Manual Deploy"** → **"Deploy latest commit"**
3. Backend will redeploy with new FRONTEND_URL

This ensures OAuth callbacks and redirects work correctly.

---

## Creating Custom Domain (Optional)

### 8.1 Add Custom Domain in Vercel
1. In Vercel dashboard → **Settings** → **Domains**
2. Enter your custom domain (e.g., `app.yourdomain.com`)
3. Add DNS records as shown by Vercel

### 8.2 Update Backend URLs
Update in Render:
```
FRONTEND_URL=https://app.yourdomain.com
OAUTH_CALLBACK_BASE_URL=https://app.yourdomain.com
```

Redeploy the backend.

---

## Troubleshooting

### Issue: "Build failed - cannot find module"

**Solution 1: Check pnpm-workspace setup**
- Ensure root `pnpm-workspace.yaml` is in GitHub
- Vercel needs to resolve workspace dependencies
- Check file exists: `OpportuNet/pnpm-workspace.yaml`

**Solution 2: Verify package.json references**
```json
{
  "dependencies": {
    "@workspace/api-client-react": "workspace:*"
  }
}
```
- If using workspace dependencies, Vercel must install from root

**Solution 3: Set root directory to root**
- Instead of `artifacts/job-portal`, set root directory to `.`
- Then use build command: `cd artifacts/job-portal && pnpm run build`

### Issue: "Blank white screen after deployment"

**Solution 1: Check environment variables**
- Missing `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY`?
- Check Vercel logs for build errors
- Use Vercel CLI to test: `vercel env pull`

**Solution 2: Check API calls in console**
- Open browser console (F12)
- Look for CORS errors or 404s
- Verify `VITE_API_BASE_URL` is set correctly

**Solution 3: Verify Vite configuration**
- Check `vite.config.ts` has correct `envDir`
- Ensure `envDir: path.resolve(import.meta.dirname, "../../")` points to root

### Issue: "CORS errors when calling API"

**Solution:**
1. Go to Render backend settings
2. Verify CORS is enabled for your Vercel domain
3. Check Express CORS configuration includes your Vercel URL

### Issue: "Login fails or OAuth redirect error"

**Solution:**
1. Update `FRONTEND_URL` in Render backend
2. Update OAuth callback URLs in Google/GitHub console
3. For Google OAuth: Add Vercel URL to authorized redirect URIs
4. For GitHub OAuth: Update callback URL in GitHub app settings

### Issue: "Environment variables not loading"

**Solution 1: Rebuild required after env variable changes**
- In Vercel: **Deployments** → **Redeploy**
- Don't just wait for automatic redeploy

**Solution 2: Verify variables are prefixed with VITE_**
- Vite only exposes variables starting with `VITE_` in browser
- API-only variables don't need this prefix (for backend only)

### Issue: "Static files (CSS, JS) returning 404"

**Solution:**
- Verify **Output Directory** is set to `dist/public`
- Not just `dist`
- Check vite.config.ts: `outDir: path.resolve(import.meta.dirname, "dist/public")`

---

## Automatic Redeployment

### 9.1 Enable Auto-Deploy
Vercel automatically redeploys when you push to GitHub:

```bash
cd c:\Users\LENOVO\Downloads\OpportuNet
git add .
git commit -m "Update frontend"
git push origin main
```

Your Vercel deployment will automatically start!

### 9.2 Check Auto-Deploy
- Go to Vercel dashboard
- **Deployments** tab shows all deployments
- Latest one should be from your last push

---

## Post-Deployment Checklist

- [ ] Frontend deployed successfully on Vercel
- [ ] Page loads without blank screen
- [ ] All CSS and images load correctly
- [ ] Environment variables set in Vercel
- [ ] API calls go to correct Render backend URL
- [ ] Test a complete user flow (if login exists)
- [ ] Update backend FRONTEND_URL and redeploy
- [ ] Update OAuth URLs in Google/GitHub console
- [ ] Test social login (if enabled)
- [ ] Monitor Vercel analytics for 24 hours

---

## Next Steps

1. **Test Complete Flow**: 
   - Backend running on Render
   - Frontend running on Vercel
   - Try a complete user journey

2. **Set Custom Domain**: 
   - Add your domain in Vercel
   - Update backend OAuth URLs

3. **Monitor Deployments**:
   - Check Vercel and Render dashboards daily
   - Monitor error logs

4. **Setup Email Notifications**:
   - Vercel: Settings → Notifications
   - Render: Dashboard → Account → Notifications

---

## Useful Links

- Vercel Docs: https://vercel.com/docs
- Vite Deployment: https://vitejs.dev/guide/static-deploy.html#vercel
- Environment Variables in Vercel: https://vercel.com/docs/projects/environment-variables
- Supabase with Vite: https://supabase.com/docs/guides/getting-started/quickstarts/reactjs

---

## Vercel CLI (Advanced - Optional)

If you want to deploy from your local machine:

### 9.1 Install Vercel CLI
```bash
npm install -g vercel
```

### 9.2 Deploy
```bash
cd c:\Users\LENOVO\Downloads\OpportuNet
vercel
```

### 9.3 Pull Environment Variables
```bash
vercel env pull
```

---

## Support

If you encounter issues:
1. Check Vercel deployment logs first
2. Check browser console (F12) for errors
3. Verify environment variables are set
4. Test locally with `pnpm run serve`
5. Check network requests in browser DevTools
