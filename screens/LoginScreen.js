// filepath: d:\dev\Real Life Quests\screens\LoginScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native';
import { getAuth, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { getApp } from 'firebase/app';

// Make sure WebBrowser redirects go back to our app
WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  
  // Use the existing Firebase app instance instead of creating a new one
  const app = getApp();
  const auth = getAuth(app);  // Set up Firebase Auth with the app instance
    // Use correct Google OAuth client ID that matches the Firebase project
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    // Using client ID that matches Firebase messaging sender ID
    clientId: Platform.OS === 'web' 
      ? "464867383015-web_client_id.apps.googleusercontent.com" // Replace with actual web client ID
      : Platform.OS === 'ios'
        ? "464867383015-ios_client_id.apps.googleusercontent.com" // Replace with actual iOS client ID 
        : "464867383015-android_client_id.apps.googleusercontent.com", // Replace with actual Android client ID
    scopes: ['profile', 'email'],
    ...(Platform.OS === 'web' && {
      redirectUri: window.location.origin,
    }),
  });

  // Handle Google Auth response
  useEffect(() => {
    if (response?.type === 'success') {
      setLoading(true);
      const { id_token } = response.params;
      
      // Create credential from token
      const credential = GoogleAuthProvider.credential(id_token);
      
      // Sign in with Firebase
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          // Successfully signed in
          setLoading(false);
          navigation.navigate('Home');
        })
        .catch((error) => {
          console.error("Firebase auth error:", error);
          setLoading(false);
          Alert.alert('Error', 'Authentication failed: ' + (error.message || 'Please try again'));
        });
    } else if (response?.type === 'error') {
      // Handle specific authentication errors
      console.error('Authentication error:', response.error);
      Alert.alert(
        'Authentication Error', 
        'There was a problem signing in. Please try again.'
      );
    }
  }, [response]);

  // Custom sign in handler that can add additional error handling
  const handleSignIn = async () => {
    try {
      setLoading(true);
      if (Platform.OS === 'web') {
        // On web, we need to handle the flow slightly differently
        await promptAsync({ showInRecents: true, useProxy: false });
      } else {
        await promptAsync();
      }
    } catch (error) {
      setLoading(false);
      console.error('Sign in error:', error);
      Alert.alert(
        'Sign In Error', 
        'An error occurred during sign in. Please try again.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Real Life Quests</Text>
      <Text style={styles.subtitle}>Turn your habits into adventures</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#5D3FD3" />
      ) : (        
        <>
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleSignIn}
            disabled={!request}
          >
            <Text style={styles.buttonText}>Sign in with Google</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF8F0',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#5D3FD3',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 40,
    color: '#666',
    textAlign: 'center',
  },
  googleButton: {
    backgroundColor: '#5D3FD3',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    marginBottom: 16,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 20,
  },
  linkText: {
    color: '#5D3FD3',
    fontSize: 16,
  },
});

export default LoginScreen;
