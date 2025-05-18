import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { getAuth, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

// Make sure WebBrowser redirects go back to our app
WebBrowser.maybeCompleteAuthSession();

const SignUpScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const auth = getAuth();  // Set up Google Auth with proper configuration for Firebase
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    webClientId: '464867383015-bind77bq7pitq0ju3pf19ndrt023lp3m.apps.googleusercontent.com',
    // Use the client ID associated with your Firebase project
    expoClientId: '464867383015-bind77bq7pitq0ju3pf19ndrt023lp3m.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
  });

  // Handle Google Auth response
  useEffect(() => {
    if (response?.type === 'success') {
      setLoading(true);
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          // Successfully signed up & signed in
          // Here you can check if the user is new (userCredential.additionalUserInfo.isNewUser)
          // and redirect to onboarding if they are
          setLoading(false);
          // For now, we'll navigate to the Home screen
          navigation.navigate('Home');
        })
        .catch((error) => {
          setLoading(false);
          Alert.alert('Error', error.message);
        });
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join Real Life Quests</Text>
      <Text style={styles.subtitle}>Start your adventure today</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#5D3FD3" />
      ) : (
        <>
          <TouchableOpacity
            style={styles.googleButton}
            onPress={() => promptAsync()}
            disabled={!request}
          >
            <Text style={styles.buttonText}>Sign up with Google</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.linkText}>Already have an account? Log in</Text>
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

export default SignUpScreen;
