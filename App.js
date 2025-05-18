// React Native Phase 1 App: Real Life Quests MVP

import React from 'react';
import { initializeApp, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import AppNavigator from './navigation/AppNavigator';
import { firebaseConfig } from './config/firebase';

// Initialize Firebase only once
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  // Ignore the error if it's already initialized
  if (error.code !== 'app/duplicate-app') {
    console.error('Firebase initialization error:', error);
  }
  app = getApp(); // Get the already initialized app
}

// Export for use in other files
export const db = getFirestore(app);

export default function App() {
  return <AppNavigator />;
}

// Note: Quest management and styling have been moved to HomeScreen.js
