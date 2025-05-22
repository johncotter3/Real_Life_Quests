import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';

jest.mock('firebase/auth', () => {
  const getAuth = jest.fn();
  const onAuthStateChanged = jest.fn();
  return { getAuth, onAuthStateChanged };
});

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(async () => ({ docs: [] })),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
}));

jest.mock('../../config/firebaseClient', () => ({ db: {} }));

jest.mock('../../components/QuestItem', () => 'QuestItem');

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to Login when user is not authenticated', async () => {
    const auth = require('firebase/auth');
    auth.onAuthStateChanged.mockImplementation((a, cb) => {
      cb(null);
      return jest.fn();
    });
    auth.getAuth.mockReturnValue({ signOut: jest.fn() });
    const navigation = { replace: jest.fn() };
    render(<HomeScreen navigation={navigation} />);
    await waitFor(() => {
      expect(navigation.replace).toHaveBeenCalledWith('Login');
    });
  });

  it('signs out and navigates to Login', async () => {
    const auth = require('firebase/auth');
    const signOut = jest.fn(() => Promise.resolve());
    auth.onAuthStateChanged.mockImplementation((a, cb) => {
      cb({ uid: '1', email: 'test@example.com' });
      return jest.fn();
    });
    auth.getAuth.mockReturnValue({ signOut });
    const navigation = { replace: jest.fn() };
    const { getByText } = render(<HomeScreen navigation={navigation} />);
    fireEvent.press(getByText('Sign Out'));
    await waitFor(() => expect(signOut).toHaveBeenCalled());
    expect(navigation.replace).toHaveBeenCalledWith('Login');
  });

  it('resets quests when lastReset is not today', async () => {
    const auth = require('firebase/auth');
    const firestore = require('firebase/firestore');

    auth.onAuthStateChanged.mockImplementation((a, cb) => {
      cb({ uid: '1', email: 'test@example.com' });
      return jest.fn();
    });
    auth.getAuth.mockReturnValue({ signOut: jest.fn() });

    const yesterday = '2000-01-01';
    const today = new Date().toISOString().split('T')[0];

    firestore.getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ xp: 0, level: 1, lastReset: yesterday }),
    });

    firestore.getDocs.mockResolvedValue({
      docs: [
        { id: 'q1', data: () => ({ completed: true, xp: 10 }) },
      ],
    });

    firestore.doc.mockImplementation((db, coll, id) => `${coll}/${id}`);

    const navigation = { replace: jest.fn() };
    render(<HomeScreen navigation={navigation} />);

    await waitFor(() => {
      expect(firestore.updateDoc).toHaveBeenCalledWith('quests/q1', { completed: false });
    });
    expect(firestore.updateDoc).toHaveBeenCalledWith('users/1', { lastReset: today });
  });
});
