import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SignUpScreen from '../SignUpScreen';

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

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  signInWithCredential: jest.fn(),
  GoogleAuthProvider: { credential: jest.fn() },
}));

describe('SignUpScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('calls promptAsync when Sign up with Google is pressed', () => {
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(<SignUpScreen navigation={navigation} />);
    fireEvent.press(getByText('Sign up with Google'));
    const google = require('expo-auth-session/providers/google');
    expect(google.promptAsync).toHaveBeenCalled();
  });

  it('navigates to Login when link pressed', () => {
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(<SignUpScreen navigation={navigation} />);
    fireEvent.press(getByText('Already have an account? Log in'));
    expect(navigation.navigate).toHaveBeenCalledWith('Login');
  });
});
