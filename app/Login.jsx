import React, { useState } from 'react';
import { View, Image, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { BASE_URL } from '../config.js';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const valid = email && password;
    

    const handleLogin = async () => {
        if (!email.trim()) {
            Alert.alert('Validation Error', 'Please enter your email');
            return;
        }
        if (!password.trim()) {
            Alert.alert('Validation Error', 'Please enter your password');
            return;
        }
        try {
            const res = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Login failed');
            }

            await SecureStore.setItemAsync('userToken', data.accessToken);
            Alert.alert('Success', 'Logged in successfully');
            router.replace('/Home');
            console.log("Entered HOME");

        } catch (err) {
            Alert.alert('Error', err.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

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

            <TouchableOpacity
                style={styles.forgot}
                onPress={() => router.push('/ForgotPassword')}
            >
                <Text>Forgot password?</Text>
            </TouchableOpacity>

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
                style={[styles.loginBtn, { backgroundColor: valid ? '#538dfe' : '#5E5C58' }]}
                onPress={handleLogin}
            >
                <Text style={{ color: '#fff' }}>LOGIN</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.signupLink}
                onPress={() => router.push('/Register')}
            >
                <Text style={styles.signupText}>
                    If you have no account <Text style={{ color: '#538dfe', fontWeight: 'bold', textDecorationLine: 'underline' }}>Sign up</Text>
                </Text>
            </TouchableOpacity>

            <Text style={styles.terms}>By continuing, you agree to our Terms of Service and {'\n'}Privacy Policy.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    field: { marginBottom: 10 },
    label: { marginBottom: 7, marginLeft: 4, color: '#7b7b7b', fontSize: 15, fontWeight: '500' },
    input: {
        borderWidth: 1,
        borderColor: '#d6e6f294',
        padding: 12,
        borderRadius: 6,
        marginBottom: 20,
        backgroundColor: '#F7FBFC',
    },
    container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f5f8fa' },
    title: { fontSize: 22, fontWeight: '500', marginBottom: 22, textAlign: 'center', color: '#87a1c5', marginTop: 60 },
    forgot: { alignSelf: 'flex-end', marginVertical: 8, marginBottom: 25 },
    orContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 12,
        marginBottom: 16,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#ccc',
    },
    orText: {
        marginHorizontal: 12,
        color: '#666',
        fontWeight: 'bold',
        fontSize: 14,
    },
    googleBtn: {
        borderWidth: 1,
        backgroundColor: '#fff',
        borderColor: '#dce2e6e9',
        padding: 12,
        alignItems: 'center',
        borderRadius: 6,
        marginVertical: 0,
        marginBottom: 100,
    },
    googleIcon: { width: 20, height: 20, marginRight: 10 },
    googleText: { fontSize: 16, color: '#444' },
    loginBtn: { padding: 14, borderRadius: 20, alignItems: 'center', marginTop: 40 },
    signupLink: { alignItems: 'center', marginTop: 18, marginBottom: 0 },
    signupText: { color: '#555', fontSize: 14, letterSpacing: 0.2 },
    terms: { textAlign: 'center', marginTop: 12, marginBottom: 1, color: '#888', fontSize: 12 },
});
