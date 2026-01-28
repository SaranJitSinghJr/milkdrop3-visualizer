# GitHub Automated APK Build Setup

This guide shows how to set up GitHub Actions to automatically build your MilkDrop 3 APK without needing a computer. Everything runs on GitHub's free servers!

## What You'll Get

✅ **Automatic APK builds** whenever you push code to GitHub  
✅ **No computer needed** - builds run in the cloud  
✅ **Free** - GitHub Actions includes 2,000 free minutes/month  
✅ **Download APK** directly from GitHub  
✅ **Release history** - keeps all your builds organized  

## Prerequisites

1. **Free GitHub account** - Sign up at [github.com](https://github.com)
2. **Free Expo account** - Sign up at [expo.dev](https://expo.dev)
3. **Expo token** - Generate at expo.dev/settings/tokens

## Step 1: Create GitHub Account

1. Go to [github.com](https://github.com)
2. Click **"Sign up"**
3. Enter email, create password, choose username
4. Verify email address
5. Done! You now have a GitHub account

## Step 2: Create Expo Token

1. Go to [expo.dev](https://expo.dev) and log in
2. Click your profile → **Settings**
3. Scroll to **Access Tokens**
4. Click **Create Token**
5. Give it a name: `GitHub Actions`
6. Copy the token (you'll need it in Step 4)
7. **Keep this secret!** Don't share it

## Step 3: Create GitHub Repository

1. Log in to [github.com](https://github.com)
2. Click **"+"** in top-right corner
3. Select **"New repository"**
4. Fill in:
   - **Repository name:** `milkdrop3-mobile`
   - **Description:** `MilkDrop 3 Mobile - Audio Visualizer for Android`
   - **Visibility:** Public (or Private if you prefer)
5. Click **"Create repository"**

## Step 4: Upload Project Files

### Option A: Using GitHub Web Interface (Easiest)

1. In your new repository, click **"Add file"** → **"Upload files"**
2. Download the MilkDrop 3 project from Manus (click "Code" → "Download All Files")
3. Extract the ZIP file
4. Drag and drop all files into the GitHub upload area
5. Scroll down and click **"Commit changes"**

### Option B: Using Git Command Line

```bash
# Download project from Manus
# Extract the ZIP file
cd milkdrop3-mobile

# Initialize git
git init
git add .
git commit -m "Initial commit: MilkDrop 3 Mobile"

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/milkdrop3-mobile.git
git branch -M main
git push -u origin main
```

## Step 5: Add Expo Token to GitHub Secrets

1. In your GitHub repository, click **Settings** (top menu)
2. Click **Secrets and variables** → **Actions** (left sidebar)
3. Click **"New repository secret"**
4. Fill in:
   - **Name:** `EXPO_TOKEN`
   - **Secret:** Paste your Expo token from Step 2
5. Click **"Add secret"**

**Important:** This keeps your Expo token private and secure!

## Step 6: Trigger First Build

The GitHub Actions workflow is already configured in `.github/workflows/build-apk.yml`

### Automatic Build (on every push)

Any time you push code to GitHub, a build automatically starts:

```bash
git add .
git commit -m "Update: new feature"
git push origin main
```

### Manual Build

To manually trigger a build without pushing code:

1. Go to your GitHub repository
2. Click **Actions** (top menu)
3. Click **"Build APK with EAS"** (left sidebar)
4. Click **"Run workflow"** → **"Run workflow"** button
5. Wait 15-20 minutes for build to complete

## Step 7: Download Your APK

### From Artifacts

1. Go to your GitHub repository
2. Click **Actions** (top menu)
3. Click the latest build (shows green checkmark if successful)
4. Scroll down to **Artifacts** section
5. Click **"milkdrop3-apk"** to download

### From Releases

1. Go to your GitHub repository
2. Click **Releases** (right sidebar)
3. Click the latest release
4. Download the APK file

## Step 8: Install on Android

1. **Download APK** from GitHub (see Step 7)
2. **Transfer to Android device** via:
   - Email to yourself
   - Cloud storage (Google Drive, Dropbox, etc.)
   - USB cable
3. **Enable "Install from Unknown Sources"**:
   - Settings → Security → Install Unknown Apps → Enable
4. **Open file manager** and tap the APK file
5. **Click "Install"**
6. **Open MilkDrop 3** from app drawer!

## Troubleshooting

### Build Failed: "EXPO_TOKEN not found"

**Solution:** You forgot Step 5. Add the Expo token to GitHub Secrets:

1. Go to repository Settings
2. Click Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `EXPO_TOKEN`
5. Value: Your Expo token from expo.dev/settings/tokens

### Build Failed: "Build timed out"

**Cause:** EAS build took too long (>60 min)

**Solution:** 
- Check EAS dashboard at expo.dev/builds
- If still building, wait a bit longer
- If failed, GitHub Actions will retry automatically

### Build Failed: "Android SDK not found"

**This shouldn't happen** - GitHub Actions includes everything needed. If you see this:

1. Go to Actions → Latest build
2. Click "Re-run all jobs"
3. Wait for retry

### APK Won't Install

**"App not installed" error:**

1. Uninstall old version first
2. Re-download APK from GitHub
3. Ensure Android OS 7.0+ (API 24+)
4. Check you have enough storage space

### Can't Find GitHub Actions Tab

**Solution:** Actions tab only appears after first push. If missing:

1. Make sure you pushed code to GitHub
2. Refresh the page
3. Actions tab should now be visible

## Continuous Updates

### Update App Code

1. Download the project from Manus
2. Make changes locally
3. Upload to GitHub:

```bash
cd milkdrop3-mobile
git add .
git commit -m "Description of changes"
git push origin main
```

4. GitHub Actions automatically builds new APK
5. Download from Actions → Artifacts

### Update Presets

To add more presets:

1. Add `.milk` files to `assets/presets/`
2. Push to GitHub
3. New APK with updated presets builds automatically

### Update Settings

To modify customization options:

1. Edit `app/(tabs)/settings.tsx`
2. Push to GitHub
3. New APK with updated settings builds automatically

## GitHub Actions Limits

**Free Tier:**
- 2,000 build minutes/month
- Each build takes ~15-20 minutes
- You can build ~100 APKs per month for free

**If you exceed limits:**
- Upgrade to GitHub Pro ($4/month)
- Get 3,000 additional minutes/month
- Or wait until next month (resets on the 1st)

## Advanced: Scheduled Builds

To build automatically every week:

Edit `.github/workflows/build-apk.yml` and change:

```yaml
on:
  schedule:
    - cron: '0 0 * * 0'  # Every Sunday at midnight UTC
  workflow_dispatch:
```

## Advanced: Build on Tags

To build only when you create a release tag:

Edit `.github/workflows/build-apk.yml` and change:

```yaml
on:
  push:
    tags:
      - 'v*'  # Build on tags like v1.0.0
  workflow_dispatch:
```

Then create releases:

```bash
git tag v1.0.0
git push origin v1.0.0
```

## Support

- **GitHub Help:** [docs.github.com](https://docs.github.com)
- **GitHub Actions:** [docs.github.com/actions](https://docs.github.com/actions)
- **Expo Docs:** [docs.expo.dev](https://docs.expo.dev)
- **GitHub Community:** [github.community](https://github.community)

## Summary

| Step | Action | Time |
|------|--------|------|
| 1 | Create GitHub account | 5 min |
| 2 | Create Expo token | 2 min |
| 3 | Create GitHub repo | 2 min |
| 4 | Upload project files | 5 min |
| 5 | Add Expo token secret | 2 min |
| 6 | Trigger build | 1 min |
| 7 | Wait for build | 20 min |
| 8 | Download APK | 2 min |
| 9 | Install on Android | 5 min |
| **Total** | **From zero to app** | **~45 min** |

You now have a fully automated build system! Every time you update the code, a new APK is automatically built and ready to download.

---

**Last Updated:** January 22, 2026  
**Status:** Ready for production  
**Support:** See support links above
