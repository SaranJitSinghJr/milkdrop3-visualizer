# APK Build Instructions

This repository is now set up to automatically build APK files using GitHub Actions and EAS (Expo Application Services).

## Prerequisites

Before building the APK, you need to:

1. **Create an Expo account** at [expo.dev](https://expo.dev)
2. **Generate an Expo token**:
   - Go to [expo.dev/settings/tokens](https://expo.dev/settings/tokens)
   - Click "Create Token"
   - Give it a name like "GitHub Actions"
   - Copy the token

3. **Add the token to GitHub Secrets**:
   - Go to your repository on GitHub
   - Click **Settings** → **Secrets and variables** → **Actions**
   - Click **"New repository secret"**
   - Name: `EXPO_TOKEN`
   - Value: Paste your Expo token
   - Click **"Add secret"**

## Building the APK

### Option 1: Trigger via Git Tag (Recommended)

The build workflow is configured to run automatically when you create a version tag:

```bash
# Create a version tag
git tag v1.0.1 -m "Release v1.0.1"

# Push the tag to GitHub
git push origin v1.0.1
```

This will:
1. Trigger the GitHub Actions workflow
2. Build the APK using EAS
3. Create a GitHub Release with the APK attached
4. Make the APK available for download

### Option 2: Manual Trigger

You can also manually trigger the build from GitHub:

1. Go to your repository on GitHub
2. Click **Actions** tab
3. Click **"Build APK with EAS"** workflow
4. Click **"Run workflow"** button
5. Select the branch (usually `main`)
6. Click **"Run workflow"**

## Monitoring the Build

1. Go to **Actions** tab in your GitHub repository
2. Click on the latest workflow run
3. Watch the build progress (takes 15-20 minutes)
4. Once complete, the APK will be available in two places:
   - **Artifacts** section of the workflow run
   - **Releases** page (if triggered by a tag)

## Downloading the APK

### From GitHub Releases

1. Go to the **Releases** page
2. Find the latest release
3. Download the `milkdrop3.apk` file
4. Transfer to your Android device and install

### From GitHub Actions Artifacts

1. Go to **Actions** tab
2. Click the completed workflow run
3. Scroll to **Artifacts** section
4. Download `milkdrop3-apk`
5. Extract and transfer to your Android device

## Installing the APK on Android

1. Download the APK file
2. Transfer to your Android device (via USB, email, cloud storage, etc.)
3. On your device:
   - Go to **Settings** → **Security**
   - Enable "Install from Unknown Sources" or "Install Unknown Apps"
4. Open the APK file using a file manager
5. Tap **Install**
6. Launch **MilkDrop 3** from your app drawer

## Build Configuration

The build uses the following configuration from `eas.json`:

- **Development Build**: Debug APK with development tools
  ```bash
  eas build --platform android --profile development
  ```

- **Preview Build**: Release APK for testing (default for GitHub Actions)
  ```bash
  eas build --platform android --profile preview
  ```

- **Production Build**: AAB for Google Play Store
  ```bash
  eas build --platform android --profile production
  ```

## Troubleshooting

### Build fails with "EXPO_TOKEN not found"

Make sure you've added the `EXPO_TOKEN` secret to your repository settings (see Prerequisites above).

### Build fails with "Gradle build failed"

This is usually due to:
- Incompatible dependencies
- Missing native modules
- Memory issues

Check the EAS build logs at [expo.dev/builds](https://expo.dev/builds) for detailed error messages.

### APK won't install on device

- Make sure your device is running Android 7.0+ (API Level 24+)
- Uninstall any previous version of the app
- Enable "Install from Unknown Sources" in device settings
- Make sure the APK downloaded completely without corruption

## Next Steps

After building your first APK:

1. Test the app thoroughly on multiple Android devices
2. Gather feedback from beta testers
3. Make improvements based on feedback
4. Update the version in `app.config.ts`
5. Create a new tag to trigger another build

## For More Information

- See [BUILD_GUIDE.md](BUILD_GUIDE.md) for detailed build information
- See [EAS_BUILD_GUIDE.md](EAS_BUILD_GUIDE.md) for EAS-specific guidance
- See [GITHUB_BUILD_SETUP.md](GITHUB_BUILD_SETUP.md) for CI/CD setup details
