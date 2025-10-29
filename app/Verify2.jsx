import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BASE_URL } from '../config.js';


export default function Verify() {
    const [code, setCode] = useState(['', '', '', '']);
    const [focusedIdx, setFocusedIdx] = useState(-1);
    const [timer, setTimer] = useState(59);
    const inputs = [useRef(), useRef(), useRef(), useRef()];
    const valid = code.every(x => x.length === 1);
    const router = useRouter();

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer(t => t - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handleChange = (text, idx) => {
        if (text.length > 1) text = text[text.length - 1];
        const newCode = [...code];
        newCode[idx] = text;
        setCode(newCode);

        if (text && idx < 3) {
            inputs[idx + 1].current.focus();
        }
        if (!text && idx > 0) {
            inputs[idx - 1].current.focus();
        }
    };

    const handleResend = async () => {
        if (timer === 0) setTimer(59);
        try {
            const response = await fetch(`${BASE_URL}/auth/resend-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim().toLowerCase() }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to resend OTP');
            }

            alert(data.message); // Show success message to user
        } catch (error) {
            alert(error.message);
        }
    };

    const { name, email, password } = useLocalSearchParams(); // get params from Register screen
const handleVerify = async () => {
    const otp = code.join(''); // combine 4 digits into a string

    try {
        const res = await fetch(`${BASE_URL}/auth/password-reset/verify-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp }),
            
        });
        const data = await res.json();
        console.log(data)

        if (res.ok) {
            Alert.alert("Success", "OTP verified");
            router.push({
            pathname: '/ResetPassword',
            params: { sessionToken: data.resetSessionToken },
  });
        } else {
            Alert.alert("Error", data.message || "Failed to verify OTP");
        }
    } catch (err) {
        Alert.alert("Error", err.message);
    }
};
    


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Verify Account</Text>
            <Text style={styles.desc}>
                ResetCode has been sent to {email}.{"\n"}
                Enter the code to verify your account
            </Text>
            <View style={styles.codeRow}>
                {code.map((digit, idx) => {
                    const active = focusedIdx === idx || digit.length === 1;
                    return (
                        <TextInput
                            key={idx}
                            ref={inputs[idx]}
                            style={[
                                styles.codeInput,
                                { borderColor: active ? '#769FCD' : '#D6E6F2' }
                            ]}
                            value={digit}
                            onChangeText={text => handleChange(text, idx)}
                            onFocus={() => setFocusedIdx(idx)}
                            onBlur={() => setFocusedIdx(-1)}
                            keyboardType="number-pad"
                            maxLength={1}
                            returnKeyType="next"
                        />
                    );
                })}
            </View>
            <View style={styles.resendRow}>
                <Text style={styles.resendText}>Didn’t receive a code? </Text>
                <TouchableOpacity
                    disabled={timer > 0}
                    onPress={handleResend}
                >
                    <Text style={[
                        styles.resendLink,
                        { color: timer > 0 ? '#7a7a74ff' : '#769FCD' }
                    ]}>
                        Resend Code
                    </Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.timer}>Resend code in 00:{timer < 10 ? `0${timer}` : timer}</Text>
            <TouchableOpacity
                style={[styles.verifyBtn, { backgroundColor: valid ? '#769FCD' : '#5E5C58' }]}
                disabled={!valid}
                onPress={handleVerify}
            >
                <Text style={{ color: '#fff' }}>VERIFY ACCOUNT</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#F7FBFC' },
    title: { fontSize: 22, fontWeight: '500', marginTop: 30, textAlign: 'center', color: '#87a1c5' },
    desc: { textAlign: 'center', color: '#90908e', marginBottom: 5, fontSize: 17, marginTop: 20 },
    codeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 123, marginTop: 20 },
    codeInput: {
        width: 71, height: 67, borderRadius: 12, borderWidth: 1,
        textAlign: 'center', fontSize: 45, backgroundColor: '#fbfdff'
    },
    resendRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 7 },
    resendText: { fontSize: 15, color: '#161614ff' },
    resendLink: { fontSize: 15, textDecorationLine: 'underline' },
    timer: { textAlign: 'center', color: '#161614ff', fontSize: 14, marginBottom: 150 },
    verifyBtn: { padding: 16, borderRadius: 20, alignItems: 'center' }
});
