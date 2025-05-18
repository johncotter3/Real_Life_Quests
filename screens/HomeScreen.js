import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../App';
import QuestItem from '../components/QuestItem';
import { calculateNewXPAndLevel } from '../utils/xpUtils';
const HomeScreen = ({ navigation }) => {
  const [quests, setQuests] = useState([]);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [newQuest, setNewQuest] = useState('');
  const auth = getAuth();
  const user = auth.currentUser;
  
  // References for Firestore
  const questsRef = collection(db, 'quests');

  useEffect(() => {
    const fetchQuests = async () => {
      try {
        // If logged in, we could filter quests by user.uid
        const snapshot = await getDocs(questsRef);
        const fetchedQuests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setQuests(fetchedQuests);
      } catch (error) {
        console.error("Error fetching quests:", error);
      }
    };
    
    fetchQuests();
  }, []);

  const addQuest = async () => {
    if (newQuest.trim().length === 0) return;
    
    try {
      const newQuestData = { 
        title: newQuest, 
        xp: 10, 
        completed: false,
        userId: user ? user.uid : 'anonymous',
        createdAt: new Date().toISOString()
      };
      
      const docRef = await addDoc(questsRef, newQuestData);
      setQuests([...quests, { id: docRef.id, ...newQuestData }]);
      setNewQuest('');
    } catch (error) {
      console.error("Error adding quest:", error);
    }
  };

  const completeQuest = async (id) => {
    try {
      const updatedQuests = quests.map(q => {
        if (q.id === id && !q.completed) {
          const { newXp, newLevel } = calculateNewXPAndLevel(xp, q.xp);
          setXp(newXp);
          setLevel(newLevel);
          updateDoc(doc(db, 'quests', id), { completed: true });
          return { ...q, completed: true };
        }
        return q;
      });
      setQuests(updatedQuests);
    } catch (error) {
      console.error("Error completing quest:", error);
    }
  };

  const handleSignOut = () => {
    const auth = getAuth();
    auth.signOut()
      .then(() => {
        navigation.navigate('Login');
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Real Life Quests</Text>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.subheader}>Level {level} - XP: {xp}</Text>
      
      <FlatList
        data={quests}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <QuestItem item={item} onComplete={completeQuest} />
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
    paddingHorizontal: 20,
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
