# SyncFlow - PowerShell Setup Script
# Run: .\setup.ps1

$ErrorActionPreference = "Stop"

# Add Node.js to PATH for this session
$nodePath = "C:\Program Files\nodejs"
if (Test-Path $nodePath) {
    $env:Path = "$nodePath;$env:Path"
}

Write-Host ""
Write-Host "=== SyncFlow Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
try {
    $nodeVer = node -v
    Write-Host "[OK] Node.js $nodeVer" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js not found. Install from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Install dependencies
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Check .env file
if (-not (Test-Path ".env")) {
    Write-Host "[WARN] .env file missing. Copying from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host ""
    Write-Host "IMPORTANT: Edit .env and set your DATABASE_URL from Neon!" -ForegroundColor Red
    Write-Host "  1. Go to https://neon.tech" -ForegroundColor White
    Write-Host "  2. Create a project and copy the connection string" -ForegroundColor White
    Write-Host "  3. Paste it in .env as DATABASE_URL" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter after editing .env to continue"
}

# Update database schema
Write-Host "Updating database schema..." -ForegroundColor Yellow
npm run db:push
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Database update failed. Check your DATABASE_URL in .env" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] Database updated" -ForegroundColor Green

# Build check
Write-Host "Building app..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Build failed" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] Build successful" -ForegroundColor Green

Write-Host ""
Write-Host "=== Ready! ===" -ForegroundColor Green
Write-Host "Start the app with:  npm run dev" -ForegroundColor White
Write-Host "Open:               http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "To deploy online, see DEPLOY.md" -ForegroundColor Gray
Write-Host ""

# Ask to start dev server
$start = Read-Host "Start dev server now? (y/n)"
if ($start -eq "y" -or $start -eq "Y") {
    npm run dev
}
