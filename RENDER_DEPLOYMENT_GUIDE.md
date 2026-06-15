# OpportuNet Backend - Render Deployment Guide

Complete step-by-step guide to deploy the OpportuNet API Server to Render.

---

## STEP 1: Prepare Your Project Locally

### 1.1 Verify Build Works Locally
```bash
cd c:\Users\LENOVO\Downloads\OpportuNet
pnpm install
cd artifacts/api-server
pnpm run build
```

Expected output: `dist/index.mjs` should be created without errors.

### 1.2 Test the Build Locally
```bash
pnpm run start
```

The server should start on the port specified in `PORT` environment variable (default: 3001).

---

## STEP 2: Create/Update GitHub Repository

### 2.1 Push Your Code to GitHub
If you don't have it on GitHub yet:

```bash
cd c:\Users\LENOVO\Downloads\OpportuNet
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/OpportuNet.git
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username.**

### 2.2 Verify Repository
- Navigate to `https://github.com/YOUR_USERNAME/OpportuNet`
- Ensure you can see your code there

---

## STEP 3: Create Render Account & Web Service

### 3.1 Create Render Account
1. Go to https://render.com
2. Click "Get Started" (sign up with GitHub for easier connection)
3. Verify your email

### 3.2 Create New Web Service
1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Select **"Connect a repository"**
3. Grant Render permission to access your GitHub repos
4. Find and select **`OpportuNet`** repository
5. Click **"Connect"**

### 3.3 Configure Service Settings
Fill in the following:

| Setting | Value |
|---------|-------|
| **Name** | `opportunet-api-backend` (or your preferred name) |
| **Environment** | `Node` |
| **Region** | `Singapore` (or closest to your users) |
| **Branch** | `main` |
| **Build Command** | `cd artifacts/api-server && pnpm install && pnpm run build` |
| **Start Command** | `node --enable-source-maps ./artifacts/api-server/dist/index.mjs` |

---

## STEP 4: Configure Environment Variables

### 4.1 Add Environment Variables in Render Dashboard

In the Render dashboard for your service, scroll to **"Environment"** section and add:

```
PORT=3008
DATABASE_URL=postgresql://postgres.vyjcsbrizpqxerhmuxfn:Lakshitha%402005@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.vyjcsbrizpqxerhmuxfn:Lakshitha%402005@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres
FRONTEND_URL=https://yourdomain.com
OAUTH_CALLBACK_BASE_URL=https://yourdomain.com
SUPABASE_URL=https://your-supabase-url.supabase.co
VITE_SUPABASE_URL=https://your-supabase-url.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_publishable_key
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="OpportuNet Staff" <your_email@gmail.com>
API_KEY=your_api_key
```

⚠️ **IMPORTANT**: Update `FRONTEND_URL` and `OAUTH_CALLBACK_BASE_URL` to your actual frontend URL once it's deployed.

### 4.2 Critical Security Note
Once deployed:
1. Rotate all credentials (especially `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_SECRET`, `SMTP_PASS`)
2. Store secrets in environment variables, NOT in code
3. Never commit `.env` to GitHub

---

## STEP 5: Deploy

### 5.1 Deploy from Render Dashboard
1. Scroll to bottom and click **"Create Web Service"**
2. Render will automatically start the deployment
3. Watch the logs in real-time on the Render dashboard

### 5.2 Monitor Deployment
- Check **"Logs"** tab in Render dashboard
- Look for messages like:
  ```
  Server is running on port 3008
  ```
- If there are errors, see **Troubleshooting** section below

### 5.3 Get Your Live URL
Once deployment completes successfully:
- Your service will have a URL like: `https://opportunet-api-backend.onrender.com`
- Use this URL for API requests

---

## STEP 6: Verify Deployment

### 6.1 Test API Endpoint
Open in browser or use curl:
```bash
curl https://opportunet-api-backend.onrender.com/health
```

You should get a response (even if it's a 404, the server is running).

### 6.2 Check Logs
In Render dashboard → **Logs** tab:
- Should see no error messages
- Should see server startup logs

---

## Troubleshooting

### Issue: "Build command failed"

**Solution 1: Check pnpm installation**
```
Error: pnpm: command not found
```
- Edit build command to:
  ```
  npm install -g pnpm && cd artifacts/api-server && pnpm install && pnpm run build
  ```

**Solution 2: Check Node version**
- In Render dashboard, set `NODE_VERSION=20` in environment variables
- Render defaults to an older version sometimes

### Issue: "Cannot find module '@workspace/db'"

**Solution:** Ensure the root `pnpm-workspace.yaml` is in repository root:
- Build command should be from root directory
- Use: `cd artifacts/api-server && pnpm install && pnpm run build`

### Issue: "Database connection failed"

**Solution:**
1. Verify `DATABASE_URL` in environment variables
2. Check if your Supabase project is active
3. Verify IP whitelist in Supabase (add Render IP or allow all: 0.0.0.0/0)

### Issue: "Port is already in use"

**Solution:**
- Render manages ports. Don't hardcode port 3008
- Change to: `const port = process.env.PORT || 3001;`
- Let Render assign the PORT

### Issue: "Service keeps crashing"

**Check:**
1. Look at **Logs** tab in Render for error messages
2. Verify all environment variables are set correctly
3. Run locally: `pnpm run start` to test

---

## Post-Deployment Checklist

- [ ] Service deployed successfully on Render
- [ ] API endpoint is accessible
- [ ] Database connection working (check logs)
- [ ] Environment variables all set correctly
- [ ] Frontend is configured to use new API URL
- [ ] Test social login (if enabled)
- [ ] Monitor logs for 24 hours for any issues
- [ ] Set up automatic redeployment on GitHub push (Render does this by default)

---

## Next Steps

1. **Update Frontend URL**: Update FRONTEND_URL in environment to point to your frontend
2. **Deploy Frontend**: Deploy job-portal to Vercel/Netlify
3. **Set up monitoring**: Enable error tracking in Render dashboard
4. **Custom domain**: Add your custom domain in Render dashboard
5. **SSL certificate**: Render provides free SSL automatically

---

## Useful Links

- Render Documentation: https://render.com/docs
- Node.js on Render: https://render.com/docs/deploy-node-express-app
- Supabase PostgreSQL: https://supabase.com/docs
- Environment Variables: https://render.com/docs/environment-variables

---

## Support

If you encounter issues:
1. Check Render logs first
2. Verify environment variables
3. Test locally with same .env file
4. Check GitHub Actions for deployment logs
