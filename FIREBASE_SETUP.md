# Firebase Setup Guide

This guide will help you set up Firebase Authentication and Firestore for your Next.js application.

## 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In your Firebase project console, click on "Authentication" in the left sidebar
2. Click on the "Get started" button
3. Go to the "Sign-in method" tab
4. Enable the following sign-in providers:
   - **Email/Password**: Click on it and toggle "Enable"
   - **Google**: Click on it, toggle "Enable", and add your project's domain

## 3. Create Firestore Database

1. In your Firebase project console, click on "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (you can configure security rules later)
4. Select a location for your database
5. Click "Done"

## 4. Get Firebase Configuration

1. In your Firebase project console, click on the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to the "Your apps" section
4. Click on the web icon (`</>`) to add a web app
5. Register your app with a nickname
6. Copy the Firebase configuration object

## 5. Configure Environment Variables

1. Create a `.env.local` file in your project root (copy from `.env.local.example`)
2. Replace the placeholder values with your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## 6. Configure Firestore Security Rules (Optional)

For production, you should configure proper security rules. Here's a basic example:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /notes/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    match /recordings/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

## 7. Test Your Setup

1. Start your development server: `npm run dev`
2. Navigate to `/auth/v1/login`
3. Try creating an account or signing in
4. Check that authentication works and you can access the dashboard

## Features Included

- ✅ Email/Password Authentication
- ✅ Google Sign-in
- ✅ User Registration
- ✅ Password Reset
- ✅ Protected Routes
- ✅ Firestore Integration
- ✅ Real-time Data Sync
- ✅ User-specific Data Access

## Firestore Collections

The app creates the following collections:

- **notes**: User notes with title, content, timestamps
- **recordings**: Voice recordings with transcriptions and metadata

Each document includes a `userId` field to ensure users only access their own data.

## Troubleshooting

### Common Issues

1. **"Firebase: Error (auth/invalid-api-key)"**
   - Check that your API key is correct in `.env.local`
   - Ensure the environment file is properly loaded

2. **"Firebase: Error (auth/unauthorized-domain)"**
   - Add your domain to the authorized domains in Firebase Console
   - Go to Authentication > Settings > Authorized domains

3. **"Missing or insufficient permissions"**
   - Check your Firestore security rules
   - Ensure the user is authenticated before accessing data

### Getting Help

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/)
- [Next.js Firebase Integration Guide](https://firebase.google.com/docs/web/setup) 