import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';

export default function QuestItem({ item, onComplete }) {
  return (
    <TouchableOpacity
      style={[styles.questItem, item.completed && styles.completed]}
      onPress={() => onComplete(item.id)}
    >
      <Text style={styles.questText}>
        {item.title} (+{item.xp} XP)
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  questItem: {
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    cursor: 'pointer', // This will only apply on web
    transition: 'transform 0.2s', // Smooth transition for hover effect
    ...(Platform.OS === 'web' && {
      ':hover': {
        transform: 'scale(1.02)'
      }
    })
  },
  completed: {
    backgroundColor: '#A8D5BA',
  },
  questText: {
    fontSize: 16,
    color: '#333',
    userSelect: 'none', // Prevent text selection on web
  },
});
