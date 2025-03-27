# Firebase Setup Guide for MeatMart

## Steps to Complete Firebase Setup

### 1. Firebase Console Registration

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click on "Add project" and create a new project for MeatMart
3. Follow the steps to set up your project

### 2. Register Your Android App

1. In the Firebase console, click "Add app" and select the Android icon
2. Enter the package name: `com.company.meatmart` (this has been configured in app.json)
3. Enter app nickname: "MeatMart" (or your preferred name)
4. (Optional) Add the Debug signing certificate SHA-1 if you need Dynamic Links or Google Sign-In

### 3. Download and Add Config File

1. Download the `google-services.json` file from Firebase
2. Create an `android/app` directory in your project if it doesn't exist yet:
   ```
   mkdir -p android/app
   ```
3. Place the downloaded `google-services.json` file in the `android/app` directory

### 4. Extract Firebase Configuration

1. Open the `google-services.json` file
2. Look for the following values in the file:
   - `"api_key": [{"current_key": "YOUR_API_KEY"}]`
   - `"project_id": "YOUR_PROJECT_ID"`
   - `"storage_bucket": "YOUR_STORAGE_BUCKET"`
   - `"project_number": "YOUR_MESSAGING_SENDER_ID"`
   - `"mobilesdk_app_id": "YOUR_APP_ID"`
   - `"firebase_url": "YOUR_DATABASE_URL"` (if available)

3. Update the `src/firebaseConfig.js` file with these values:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  // measurementId: "YOUR_MEASUREMENT_ID" // Only if you're using Firebase Analytics
};
```

### 5. Enable Pre-build Script for Expo

Since you're using Expo, you need to ensure the Firebase configuration is properly integrated when building your app. Update your app.json to include Firebase in the plugins section:

```json
"plugins": [
  "expo-font",
  "@react-native-firebase/app"
]
```

### 6. Test Firebase Integration

Add the following code to a component to test if Firebase is connected properly:

```javascript
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import firebaseApp from '../firebaseConfig';

export default function FirebaseTest() {
  useEffect(() => {
    console.log('Firebase app initialized:', firebaseApp.name);
  }, []);

  return (
    <View>
      <Text>Firebase Test Component</Text>
    </View>
  );
}
```

### 7. Install Specific Firebase Services

Depending on which Firebase features you want to use, install additional packages:

- For Authentication: `npx expo install @react-native-firebase/auth`
- For Firestore Database: `npx expo install @react-native-firebase/firestore`
- For Cloud Storage: `npx expo install @react-native-firebase/storage`
- For Cloud Functions: `npx expo install @react-native-firebase/functions`
- For Analytics: `npx expo install @react-native-firebase/analytics`

### 8. Build Your App with EAS

To create an APK or app bundle with Firebase properly integrated, use Expo Application Services (EAS):

1. Install EAS CLI: `npm install -g eas-cli`
2. Configure EAS: `eas build:configure`
3. Build for Android: `eas build -p android`

## Troubleshooting

- If you encounter issues with Firebase initialization, check that the configuration values in `firebaseConfig.js` match those in your `google-services.json` file.
- Make sure your package name in app.json matches exactly with what you registered in Firebase.
- For native build issues, you may need to run `npx expo prebuild` to generate the native projects before building. 