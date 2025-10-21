import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { BASE_URL } from '../config.js';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const router = useRouter();

    const handleSubmit = async () => {
        try {
            const res = await fetch(`${BASE_URL}/auth/password-reset/send-otp`, {
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
                pathname: '/Verify2',
                params: {  email },
            });
            console.log("VERIFY PARAMS:", email);

        } catch (err) {
            Alert.alert('Error', err.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.desc}>
                Enter your email address. We will send an {'\n'} OTP to retrieve your account
            </Text>
            <Text style={styles.label}>Email</Text>
            <TextInput
                placeholder="Enter your email"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />

            <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
                <Text style={styles.btnText}>Send Reset OTP</Text>
            </TouchableOpacity>
            <Text style={styles.desc}>
                By continuing, you agree to our Terms of Service and Privacy Policy.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 32, backgroundColor: '#f7fbfc' },
    title: { fontSize: 22, fontWeight: '600', textAlign: 'center', color: '#769FCD', marginBottom: 30 },
    label: { marginBottom: 7, marginLeft: 4, color: '#7b7b7b', fontSize: 15, fontWeight: '500' },
    input: {
        borderWidth: 1,
        borderColor: '#B7C6E3',
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
        backgroundColor: '#f7fbfc',
        marginBottom: 15
    },
    desc: { textAlign: 'center', color: '#888', marginBottom: 20, lineHeight: 20 },
    btn: { padding: 14, borderRadius: 20, alignItems: 'center', backgroundColor: '#769FCD', marginTop: 20, marginBottom: 15 },
    btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
