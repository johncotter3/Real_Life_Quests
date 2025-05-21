@echo off
REM This script builds and deploys the Real Life Quests app to Firebase

echo ==================================
echo Real Life Quests: Build and Deploy
echo ==================================
echo.

echo Step 1: Building web version...
call npm run build-web

echo.
echo Step 2: Deploying to Firebase...
call npm run deploy-hosting

echo.
echo Build and deploy completed!
echo ==================================
