import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import firebaseApp from '../firebaseConfig';

export default function FirebaseTest() {
  const [status, setStatus] = useState('Checking Firebase...');

  useEffect(() => {
    try {
      console.log('Firebase app initialized:', firebaseApp.name);
      setStatus('Firebase initialized successfully!');
    } catch (error) {
      console.error('Firebase initialization error:', error);
      setStatus('Firebase initialization failed: ' + error.message);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.statusText}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    margin: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  statusText: {
    fontSize: 16,
    textAlign: 'center',
  }
}); 