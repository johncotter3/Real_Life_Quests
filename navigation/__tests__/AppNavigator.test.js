import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import AppNavigator from '../AppNavigator';

jest.mock('firebase/auth', () => {
  const getAuth = jest.fn();
  const onAuthStateChanged = jest.fn();
  return { getAuth, onAuthStateChanged };
});

jest.mock('../../screens/LoginScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => React.createElement(Text, null, 'Login Screen');
});

jest.mock('../../screens/SignUpScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => React.createElement(Text, null, 'SignUp Screen');
});

jest.mock('../../screens/HomeScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => React.createElement(Text, null, 'Home Screen');
});

describe('AppNavigator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows Login screen when no user is authenticated', async () => {
    const auth = require('firebase/auth');
    auth.onAuthStateChanged.mockImplementation((a, cb) => {
      cb(null);
      return jest.fn();
    });
    auth.getAuth.mockReturnValue({});
    const { getByText } = render(<AppNavigator />);
    await waitFor(() => expect(getByText('Login Screen')).toBeTruthy());
  });

  it('shows Home screen when user is authenticated', async () => {
    const auth = require('firebase/auth');
    auth.onAuthStateChanged.mockImplementation((a, cb) => {
      cb({ uid: '1' });
      return jest.fn();
    });
    auth.getAuth.mockReturnValue({});
    const { getByText } = render(<AppNavigator />);
    await waitFor(() => expect(getByText('Home Screen')).toBeTruthy());
  });
});
