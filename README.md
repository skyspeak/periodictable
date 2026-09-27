# Element Spotter

A periodic table for kids, about ages 6–10. Every element is on the table with its real symbol, atomic number, and family color. Tap a square to read a short card about where that element shows up in daily life. Elements kids can actually meet (air, water, pencils, bikes, coins, phones, balloons, salt, bones, and more) are marked with a star.

Pinch with two fingers, hold Ctrl and scroll, or use Bigger, Smaller, and Reset. Zooming happens inside the page, so it also works in the Android app.

## Run it on a computer

```bash
npm install
npm run dev
```

Open http://127.0.0.1:47231/

Check the element facts:

```bash
npm run check
```

Build the web app:

```bash
npm run build
```

## Android app

The debug APK in this repo is `dist/element-spotter-debug.apk`. Package name: `com.skyspeak.elementspotter`.

To build it yourself, install the Android SDK and set `ANDROID_HOME`. Then:

```bash
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```

The new APK is written to `android/app/build/outputs/apk/debug/app-debug.apk`. Copy that file to `dist/element-spotter-debug.apk` if you want to keep it with the project.

Install it on a device or emulator:

```bash
adb install --streaming dist/element-spotter-debug.apk
adb shell pm path com.skyspeak.elementspotter
```
