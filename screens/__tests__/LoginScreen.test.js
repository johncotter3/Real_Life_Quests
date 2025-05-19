import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LoginScreen from '../LoginScreen';

jest.mock('expo-web-browser', () => ({
  maybeCompleteAuthSession: jest.fn(),
}));

jest.mock('expo-auth-session/providers/google', () => {
  const promptAsync = jest.fn();
  return {
    useIdTokenAuthRequest: () => [{}, null, promptAsync],
    promptAsync,
  };
});

jest.mock('firebase/app', () => ({
  getApp: jest.fn(() => ({})),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  signInWithCredential: jest.fn(),
  GoogleAuthProvider: { credential: jest.fn() },
}));

describe('LoginScreen', () => {
  it('calls promptAsync when Sign in with Google is pressed', () => {
    const navigation = { navigate: jest.fn(), replace: jest.fn() };
    const { getByText } = render(<LoginScreen navigation={navigation} />);
    fireEvent.press(getByText('Sign in with Google'));
    const google = require('expo-auth-session/providers/google');
    expect(google.promptAsync).toHaveBeenCalled();
  });

  it('navigates to SignUp when link pressed', () => {
    const navigation = { navigate: jest.fn(), replace: jest.fn() };
    const { getByText } = render(<LoginScreen navigation={navigation} />);
    fireEvent.press(getByText("Don't have an account? Sign Up"));
    expect(navigation.navigate).toHaveBeenCalledWith('SignUp');
  });
});
