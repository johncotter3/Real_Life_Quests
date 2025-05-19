import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import QuestItem from '../QuestItem';

jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const { View } = require('react-native');
  const Swipeable = ({ renderLeftActions, renderRightActions, children }) => (
    <View>
      {renderLeftActions && renderLeftActions()}
      {children}
      {renderRightActions && renderRightActions()}
    </View>
  );
  return { Swipeable };
});

let baseProps;

describe('QuestItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    baseProps = {
      item: { id: 1, title: 'Quest', xp: 10, completed: false },
      onComplete: jest.fn(),
      onDelete: jest.fn(),
      onSave: jest.fn(),
      onMoveUp: jest.fn(),
      onMoveDown: jest.fn(),
    };
  });
  it('triggers edit mode when Edit is pressed', () => {
    const { getByText } = render(<QuestItem {...baseProps} />);
    fireEvent.press(getByText('Edit'));
    expect(getByText('Save')).toBeTruthy();
  });

  it('calls onDelete when Delete is pressed', () => {
    const { getByText } = render(<QuestItem {...baseProps} />);
    fireEvent.press(getByText('Delete'));
    expect(baseProps.onDelete).toHaveBeenCalledWith(1);
  });
});
