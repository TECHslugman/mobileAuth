import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BASE_URL } from '../config.js';
import { useLocalSearchParams } from 'expo-router';

export default function ResetPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const router = useRouter();


    const valid = newPassword && confirmPassword && newPassword === confirmPassword;
    const { sessionToken } = useLocalSearchParams();
    const handleContinue = async () => {
        if (!newPassword || newPassword.length < 8) {
            alert('Please enter at least 8 characters for new password');
            return;
        }
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const res = await fetch(`${BASE_URL}/auth/password-reset`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resetSessionToken: sessionToken, newPassword }),
            });
            const data = await res.json();

            if (res.ok) {
                alert('Password reset successful');
                router.push('/Login'); // navigate to login or home
            } else {
                alert(data.message);
            }
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create New Password</Text>
            <View style={styles.field}>
                <Text style={styles.label}>New Password</Text>
                <View style={{ position: 'relative' }}>
                    <TextInput
                        placeholder=""
                        style={styles.input}
                        secureTextEntry={!showNew}
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                    <TouchableOpacity
                        style={styles.icon}
                        onPress={() => setShowNew(!showNew)}
                    >
                        <Feather name={showNew ? 'eye' : 'eye-off'} size={22} color="#769FCD" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.field}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={{ position: 'relative' }}>
                    <TextInput
                        placeholder=""
                        style={styles.input}
                        secureTextEntry={!showConfirm}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity
                        style={styles.icon}
                        onPress={() => setShowConfirm(!showConfirm)}
                    >
                        <Feather name={showConfirm ? 'eye' : 'eye-off'} size={22} color="#769FCD" />
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity
                style={[styles.continueBtn, { backgroundColor: valid ? '#769FCD' : '#5E5C58' }]}
                onPress={handleContinue}
                disabled={!valid}
            >
                <Text style={styles.continueText}>CONTINUE</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', backgroundColor: '#f7fbfc', padding: 32 },
    title: { fontSize: 20, fontWeight: '700', color: '#769FCD', textAlign: 'center', marginBottom: 30 },
    field: { marginBottom: 30 },
    label: { fontWeight: '500', color: '#232323', marginBottom: 8, fontSize: 15 },
    input: {
        borderWidth: 1,
        borderColor: '#B7C6E3',
        borderRadius: 10,
        padding: 13,
        paddingRight: 44,
        backgroundColor: '#f7fbfc',
        fontSize: 18,
    },
    icon: { position: 'absolute', right: 12, top: 15 },
    continueBtn: {
        marginTop: 280,
        borderRadius: 22,
        paddingVertical: 18,
        alignItems: 'center',
    },
    continueText: { color: '#fff', fontSize: 17, letterSpacing: 1, fontWeight: '500' },
});
