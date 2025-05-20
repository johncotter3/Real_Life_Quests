import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { db } from '../App';
import QuestItem from '../components/QuestItem';
import { calculateNewXPAndLevel } from '../utils/xpUtils';
const HomeScreen = ({ navigation }) => {
  const [quests, setQuests] = useState([]);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [newQuest, setNewQuest] = useState('');
  const [user, setUser] = useState(null);
  const auth = getAuth();
  
  // References for Firestore
  const questsRef = collection(db, 'quests');

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        // If user is not logged in, redirect to login screen
        navigation.replace('Login');
      }
    });
    
    return () => unsubscribe();
  }, [navigation]);  useEffect(() => {
    if (!user) return;
    
    const fetchUserData = async () => {
      try {
        // Filter quests by the current user's ID
        const q = query(questsRef, where("userId", "==", user.uid));
        const snapshot = await getDocs(q);
        const fetchedQuests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setQuests(fetchedQuests);
        
        // Calculate total XP from completed quests
        let totalXp = 0;
        fetchedQuests.forEach(quest => {
          if (quest.completed) {
            totalXp += quest.xp;
          }
        });
        
        // Calculate level from total XP using the same logic as quest completion
        const calculatedLevel = Math.floor(totalXp / 100) + 1;
        
        setXp(totalXp);
        setLevel(calculatedLevel);
      } catch (error) {
        console.error("Error fetching quests:", error);
        Alert.alert("Error", "Could not load your quests. Please try again.");
      }
    };
    
    fetchUserData();
  }, [user]);
  const addQuest = async () => {
    if (newQuest.trim().length === 0) return;
    if (!user) {
      Alert.alert("Error", "You must be logged in to add quests");
      return;
    }
    
    try {
      const newQuestData = { 
        title: newQuest, 
        xp: 10, 
        completed: false,
        userId: user.uid,
        createdAt: new Date().toISOString()
      };
      
      const docRef = await addDoc(questsRef, newQuestData);
      setQuests([...quests, { id: docRef.id, ...newQuestData }]);
      setNewQuest('');
    } catch (error) {
      console.error("Error adding quest:", error);
      Alert.alert("Error", "Failed to add quest. Please try again.");
    }
  };  const completeQuest = async (id) => {
    try {
      const questToComplete = quests.find(q => q.id === id && !q.completed);
      
      if (questToComplete) {
        // Calculate new XP and level
        const { newXp, newLevel } = calculateNewXPAndLevel(xp, questToComplete.xp);
        
        // Update quest in Firestore
        await updateDoc(doc(db, 'quests', id), { completed: true });
        
        // Update local state
        setXp(newXp);
        setLevel(newLevel);
        
        // Update quests list
        const updatedQuests = quests.map(q => 
          q.id === id ? { ...q, completed: true } : q
        );
        setQuests(updatedQuests);
      }
    } catch (error) {
      console.error("Error completing quest:", error);
      Alert.alert("Error", "Could not complete the quest. Please try again.");
    }
  };

  const saveQuestTitle = async (id, title) => {
    try {
      await updateDoc(doc(db, 'quests', id), { title });
      setQuests(prev => prev.map(q => (q.id === id ? { ...q, title } : q)));
    } catch (error) {
      console.error('Error updating quest:', error);
    }
  };

  const deleteQuest = async (id) => {
    try {
      await deleteDoc(doc(db, 'quests', id));
      setQuests(prev => prev.filter(q => q.id !== id));
    } catch (error) {
      console.error('Error deleting quest:', error);
    }
  };

  const moveQuest = (index, direction) => {
    const newQuests = [...quests];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newQuests.length) return;
    [newQuests[index], newQuests[targetIndex]] = [newQuests[targetIndex], newQuests[index]];
    setQuests(newQuests);
  };
  const handleSignOut = () => {
    const auth = getAuth();
    auth.signOut()
      .then(() => {
        // Replace instead of navigate to prevent going back
        navigation.replace('Login');
      })
      .catch((error) => {
        console.error("Error signing out:", error);
        Alert.alert("Error", "Could not sign out. Please try again.");
      });
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            {user ? `Welcome, ${user.displayName || user.email.split('@')[0]}` : 'Real Life Quests'}
          </Text>
          <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.subheader}>Level {level} - XP: {xp}</Text>
        
        <FlatList
          data={quests}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => (
            <QuestItem
              item={item}
              onComplete={completeQuest}
              onDelete={deleteQuest}
              onSave={saveQuestTitle}
              onMoveUp={() => moveQuest(index, 'up')}
              onMoveDown={() => moveQuest(index, 'down')}
            />
          )}
          style={styles.questList}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No quests yet. Add your first quest below!</Text>
          }
        />
        
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="New Quest"
            value={newQuest}
            onChangeText={setNewQuest}
            style={styles.input}
          />
          <TouchableOpacity style={styles.addButton} onPress={addQuest}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  container: {
    flex: 1,
    paddingHorizontal: 30, // Increased horizontal padding from 20 to 30
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5D3FD3',
  },
  signOutButton: {
    padding: 8,
  },
  signOutText: {
    color: '#5D3FD3',
    fontSize: 14,
  },
  subheader: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  questList: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 30,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 30,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 48,
    backgroundColor: '#FFF',
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: '#5D3FD3',
    paddingHorizontal: 15,
    borderRadius: 10,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 10,
  },
});

export default HomeScreen;
