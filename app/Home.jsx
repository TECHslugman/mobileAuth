import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function Home() {
  const router = useRouter();

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    router.replace('/Login'); // Navigate back to login after logout
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome to your Home Screen!</Text>
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>LOGOUT</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f8fa' },
  welcome: { fontSize: 24, fontWeight: 'bold', marginBottom: 40, color: '#769FCD' },
  logoutBtn: { padding: 14, borderRadius: 20, backgroundColor: '#538dfe', alignItems: 'center', width: '80%' },
  logoutText: { color: 'white', fontWeight: '600', fontSize: 16 },
});
