// React Native Phase 1 App: Real Life Quests MVP

import React from 'react';
import AppNavigator from './navigation/AppNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppNavigator />
    </GestureHandlerRootView>
  );
}

// Note: Quest management and styling have been moved to HomeScreen.js
