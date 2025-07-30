# AuraMobile Development Guide 📱

This guide explains how to launch the AuraMobile React Native app and build APK files for testing and distribution.

## 📋 Prerequisites

Make sure you have the following installed and configured:

- ✅ **Java JDK 17** - `java -version` should show version 17
- ✅ **Android SDK** - Located at `/opt/homebrew/share/android-commandlinetools`
- ✅ **React Native dependencies** - Run `npm install` if not done
- ✅ **Android Emulator** - AVD named `AuraMobile_Emulator`

## 🚀 Quick Start

### 1. Start the Android Emulator

```bash
# Start the emulator
emulator -avd AuraMobile_Emulator -no-audio

# Verify it's running (in a new terminal)
adb devices
# Should show: emulator-5554    device
```

### 2. Launch the App in Development Mode

```bash
# Navigate to project directory
cd /Users/jwander/Desktop/AuraMobile

# Run the app on emulator
npx react-native run-android
```

The app will automatically:
- Build the debug APK
- Install it on the emulator
- Start the Metro bundler
- Launch the app

## 🔧 Development Workflow

### Hot Reloading & Development

Once the app is running:

- **Fast Refresh**: Enabled by default - code changes auto-reload
- **Developer Menu**: Press `Cmd + M` in emulator
- **Reload App**: Press `R + R` in emulator
- **Metro Commands**: In the Metro terminal:
  - `r` - Reload
  - `d` - Open developer menu
  - `Shift + r` - Clear cache and reload

### Making Code Changes

1. Edit files in the `src/` directory
2. Save your changes
3. The app will automatically reload with your changes
4. If it doesn't reload, press `R + R` in the emulator

## 📦 Building APK Files

### Debug APK (For Testing)

```bash
# Navigate to android directory
cd android

# Build debug APK
./gradlew assembleDebug

# Find the APK
ls -la app/build/outputs/apk/debug/app-debug.apk
```

**Output**: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release APK (For Distribution)

⚠️ **Note**: Release builds may fail due to native dependencies. Use debug builds for testing.

```bash
# Navigate to android directory
cd android

# Clean previous builds
./gradlew clean

# Build release APK
./gradlew assembleRelease

# Find the APK
ls -la app/build/outputs/apk/release/app-release.apk
```

**Output**: `android/app/build/outputs/apk/release/app-release.apk`

## 🛠️ Environment Setup Commands

If you need to set up the environment again:

```bash
# Add to ~/.zshrc (already done)
export ANDROID_HOME=/opt/homebrew/share/android-commandlinetools
export PATH="$PATH:$ANDROID_HOME/platform-tools"
export PATH="$PATH:$ANDROID_HOME/emulator"
export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"

# Reload shell configuration
source ~/.zshrc
```

## 📱 Emulator Management

### List Available Emulators
```bash
avdmanager list avd
```

### Start Specific Emulator
```bash
emulator -avd AuraMobile_Emulator -no-audio
```

### Check Connected Devices
```bash
adb devices
```

### Stop Emulator
- Close the emulator window, or
- `adb emu kill` in terminal

## 🐛 Troubleshooting

### Common Issues & Solutions

#### 1. "Command not found: emulator"
```bash
export PATH=$PATH:$ANDROID_HOME/emulator
```

#### 2. "SDK location not found"
```bash
export ANDROID_HOME=/opt/homebrew/share/android-commandlinetools
```

#### 3. "Java not found"
```bash
export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"
java -version
```

#### 4. Metro bundler issues
```bash
# Reset Metro cache
npx react-native start --reset-cache

# Or kill and restart
killall node
npx react-native run-android
```

#### 5. Build failures
```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..
npx react-native run-android
```

#### 6. Emulator won't start
```bash
# Check if already running
adb devices

# Kill existing processes
killall emulator

# Start fresh
emulator -avd AuraMobile_Emulator -no-audio
```

## 📂 Important Directories

- **Project Root**: `/Users/jwander/Desktop/AuraMobile`
- **Source Code**: `src/`
- **Android Config**: `android/`
- **Debug APK**: `android/app/build/outputs/apk/debug/`
- **Release APK**: `android/app/build/outputs/apk/release/`
- **Node Modules**: `node_modules/`

## 🔄 Development Cycle

1. **Start Emulator**: `emulator -avd AuraMobile_Emulator -no-audio`
2. **Run App**: `npx react-native run-android`
3. **Edit Code**: Make changes in `src/`
4. **Test Changes**: App auto-reloads
5. **Build APK**: `cd android && ./gradlew assembleDebug`
6. **Test APK**: Install on device or share

## 📝 Notes

- **Debug APKs** are larger but include debugging info
- **Release APKs** are optimized but may require signing for distribution
- The emulator takes 2-3 minutes to boot the first time
- Keep the emulator running during development for faster iterations
- Use `adb install app-debug.apk` to install APK on physical devices

## 🆘 Need Help?

If you encounter issues:

1. Check the troubleshooting section above
2. Verify all environment variables are set
3. Ensure the emulator is running and connected
4. Try cleaning and rebuilding the project

---

**Happy Coding! 🚀**