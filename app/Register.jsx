import React, { useState } from 'react';
import { View, Image, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { BASE_URL } from '../config.js';


export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const valid = name && email && password.length >= 8;
  
  const router = useRouter();

  const handleCreateAccount = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter your name');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Validation Error', 'Please enter your email');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Validation Error', 'Password should be at least 8 characters');
      return;
    }
    try {
    // Send OTP to backend
    const res = await fetch(`${BASE_URL}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Failed to send OTP');
    }

    Alert.alert('Success', data.message);

    // Navigate to Verify page and pass user info
    router.push({
      pathname: '/Verify',
      params: { name, email, password },
    });
    console.log("VERIFY PARAMS:", name, email, password);

  } catch (err) {
    Alert.alert('Error', err.message);
}}

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          placeholder="Enter your Full Name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Enter your Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Password</Text>
        <View style={{ position: 'relative' }}>
          <TextInput
            placeholder="Enter your Password"
            style={[styles.input, { paddingRight: 40, marginBottom: 0 }]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{ position: 'absolute', right: 10, top: 12 }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name={showPassword ? 'eye' : 'eye-off'} size={20} color="#BCBCBC" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={{ color: valid ? 'green' : 'grey', marginBottom: 10 }}>At least 8 characters</Text>

      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>

      <TouchableOpacity style={styles.googleBtn}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Image source={require('../assets/google.png')} style={styles.googleIcon} />
          <Text style={styles.googleText}>Continue with Google</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.createBtn, { backgroundColor: valid ? '#538dfe' : '#5E5C58' }]}
        disabled={!valid}
        onPress={handleCreateAccount}
      >
        <Text style={{ color: '#fff' }}>CREATE ACCOUNT</Text>
      </TouchableOpacity>

      <Text style={styles.terms}>By continuing, you agree to our Terms of Service and {'\n'} Privacy Policy.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 10 },
  label: { marginBottom: 7, marginLeft: 4, color: '#7b7b7b', fontSize: 15, fontWeight: '500' },
  input: { borderWidth: 1, borderColor: '#d6e6f294', padding: 12, borderRadius: 6, marginBottom: 20, backgroundColor: '#F7FBFC' },
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f5f8fa' },
  title: { fontSize: 22, fontWeight: '500', marginBottom: 22, textAlign: 'center', color: '#87a1c5', marginTop: 30 },
  googleBtn: { borderWidth: 1, backgroundColor: '#fff', borderColor: '#dce2e6e9', padding: 12, alignItems: 'center', borderRadius: 6, marginVertical: 20, marginBottom: 70 },
  googleIcon: { width: 20, height: 20, marginRight: 10 },
  googleText: { fontSize: 16, color: '#444' },
  createBtn: { padding: 14, borderRadius: 20, alignItems: 'center' },
  terms: { textAlign: 'center', marginTop: 12, marginBottom: 20, color: '#888', fontSize: 12 },
  orContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 10, marginTop: 12, marginBottom: 12 },
  line: { flex: 1, height: 1, backgroundColor: '#ccc' },
  orText: { marginHorizontal: 10, color: '#666', fontWeight: 'bold' }
});
