// React Native Phase 1 App: Real Life Quests MVP

import React from 'react';
import { Platform, View } from 'react-native';
import AppNavigator from './navigation/AppNavigator';

// Platform-specific handling for Gesture Handler
// On native platforms, we use the actual GestureHandlerRootView
// On web, we use a standard View component to avoid dependency issues
let GestureHandlerRootView = View;
if (Platform.OS !== 'web') {
  try {
    // Only import on native platforms
    const GestureHandler = require('react-native-gesture-handler');
    if (GestureHandler && GestureHandler.GestureHandlerRootView) {
      GestureHandlerRootView = GestureHandler.GestureHandlerRootView;
    }
  } catch (e) {
    console.warn('Failed to import GestureHandlerRootView, using fallback');
  }
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppNavigator />
    </GestureHandlerRootView>
  );
}

// Note: Quest management and styling have been moved to HomeScreen.js
