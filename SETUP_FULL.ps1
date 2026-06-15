# 🚀 COMPLETE PROJECT SETUP GUIDE
# Run this script step-by-step to get everything working

# ========== STEP 1: DATABASE SETUP ==========
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "STEP 1: Creating Database Tables" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

cd c:\Users\LENOVO\Downloads\OpportuNet\lib\db

Write-Host "Creating database tables..." -ForegroundColor Yellow
pnpm run push

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create tables" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Database tables created successfully!" -ForegroundColor Green

# ========== STEP 2: INSTALL DEPENDENCIES ==========
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "STEP 2: Installing Dependencies" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

cd c:\Users\LENOVO\Downloads\OpportuNet

Write-Host "Installing root dependencies..." -ForegroundColor Yellow
pnpm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "Installing DB package dependencies..." -ForegroundColor Yellow
cd lib\db
pnpm install

Write-Host "✅ Dependencies installed!" -ForegroundColor Green

# ========== STEP 3: SEED DATABASE WITH 1000+ RECORDS ==========
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "STEP 3: Seeding Database (1000+ Records)" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

cd c:\Users\LENOVO\Downloads\OpportuNet\lib\db

Write-Host "Seeding 1000+ job applications..." -ForegroundColor Yellow
Write-Host "This may take a minute..." -ForegroundColor Yellow

pnpm run seed-full

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to seed database" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Database seeded successfully!" -ForegroundColor Green

# ========== STEP 4: BUILD BACKEND ==========
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "STEP 4: Building Backend" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

cd c:\Users\LENOVO\Downloads\OpportuNet\artifacts\api-server

Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
pnpm install

Write-Host "Building backend API server..." -ForegroundColor Yellow
pnpm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to build backend" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Backend built successfully!" -ForegroundColor Green

# ========== STEP 5: BUILD FRONTEND ==========
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "STEP 5: Building Frontend" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

cd c:\Users\LENOVO\Downloads\OpportuNet\artifacts\job-portal

Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
pnpm install

Write-Host "Building frontend..." -ForegroundColor Yellow
pnpm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to build frontend" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Frontend built successfully!" -ForegroundColor Green

# ========== SETUP COMPLETE ==========
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "✨ SETUP COMPLETE! ✨" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`n📊 Database Summary:" -ForegroundColor Yellow
Write-Host "   ✅ 8 Companies" -ForegroundColor Green
Write-Host "   ✅ 40 Job Postings" -ForegroundColor Green
Write-Host "   ✅ 500 Users" -ForegroundColor Green
Write-Host "   ✅ 1200 Job Applications" -ForegroundColor Green
Write-Host "   ✅ 16 Colleges" -ForegroundColor Green
Write-Host "   ✅ 5 Exams with Study Materials" -ForegroundColor Green

Write-Host "`n🚀 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "`n1️⃣  Open Terminal 1 and run Backend:" -ForegroundColor Yellow
Write-Host "   cd c:\Users\LENOVO\Downloads\OpportuNet\artifacts\api-server" -ForegroundColor White
Write-Host "   pnpm run start" -ForegroundColor White

Write-Host "`n2️⃣  Open Terminal 2 and run Frontend:" -ForegroundColor Yellow
Write-Host "   cd c:\Users\LENOVO\Downloads\OpportuNet\artifacts\job-portal" -ForegroundColor White
Write-Host "   pnpm run dev" -ForegroundColor White

Write-Host "`n3️⃣  Open your browser:" -ForegroundColor Yellow
Write-Host "   http://localhost:5173" -ForegroundColor Cyan

Write-Host "`n📝 Expected URLs:" -ForegroundColor Cyan
Write-Host "   Backend API:  http://localhost:3008" -ForegroundColor White
Write-Host "   Frontend:     http://localhost:5173" -ForegroundColor White

Write-Host "`n✅ Backend Status Check:" -ForegroundColor Yellow
Write-Host "   curl http://localhost:3008/api/health" -ForegroundColor White

Write-Host "`n💡 Tips:" -ForegroundColor Cyan
Write-Host "   - Keep both terminal windows open while developing" -ForegroundColor White
Write-Host "   - Changes to frontend reload automatically" -ForegroundColor White
Write-Host "   - You may need to restart backend after changes" -ForegroundColor White

Write-Host "`n═══════════════════════════════════════" -ForegroundColor Green
Write-Host "Setup Complete! Ready to test! 🎉" -ForegroundColor Green
Write-Host "═══════════════════════════════════════" -ForegroundColor Green
