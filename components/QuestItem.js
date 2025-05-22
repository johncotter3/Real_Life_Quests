import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  Platform,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

export default function QuestItem({
  item,
  onComplete,
  onDelete,
  onSave,
  onMoveUp,
  onMoveDown,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(item.title);

  const handleSave = () => {
    onSave(item.id, editedTitle);
    setIsEditing(false);
  };

  const renderLeftActions = () => (
    <TouchableOpacity
      style={styles.leftAction}
      onPress={() => onDelete(item.id)}
    >
      <Text style={styles.actionText}>Delete</Text>
    </TouchableOpacity>
  );

  const renderRightActions = () => (
    <TouchableOpacity
      style={styles.rightAction}
      onPress={() => setIsEditing(true)}
    >
      <Text style={styles.actionText}>Edit</Text>
    </TouchableOpacity>
  );

  const content = isEditing ? (
    <View style={styles.editContainer}>
      <TextInput
        value={editedTitle}
        onChangeText={setEditedTitle}
        style={styles.editInput}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <TouchableOpacity
      style={[styles.questItem, item.completed && styles.completed]}
      onPress={() => onComplete(item.id)}
    >
      <Text style={styles.questText}>
        {item.title} (+{item.xp} XP)
      </Text>
      <View style={styles.moveButtons}>
        <TouchableOpacity onPress={onMoveUp} style={styles.moveButton}>
          <Text style={styles.moveText}>↑</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onMoveDown} style={styles.moveButton}>
          <Text style={styles.moveText}>↓</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <Swipeable
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      onSwipeableLeftOpen={() => onDelete(item.id)}
      onSwipeableRightOpen={() => setIsEditing(true)}
    >
      {content}
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  questItem: {
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    ...(Platform.OS === 'web' && {
      ':hover': {
        transform: 'scale(1.02)',
      },
    }),
  },
  completed: {
    backgroundColor: '#A8D5BA',
  },
  questText: {
    fontSize: 16,
    color: '#333',
    userSelect: 'none',
  },
  leftAction: {
    flex: 1,
    backgroundColor: '#5D3FD3',
    justifyContent: 'center',
    paddingLeft: 20,
  },
  rightAction: {
    flex: 1,
    backgroundColor: '#E3564A',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  actionText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  editInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 40,
  },
  saveButton: {
    marginLeft: 10,
    backgroundColor: '#5D3FD3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  moveButtons: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  moveButton: {
    marginLeft: 10,
  },
  moveText: {
    fontSize: 18,
  },
});
