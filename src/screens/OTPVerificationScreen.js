// OTPVerificationScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { validateOtp, generateOtp } from '../../src/features/auth/authSlice';

const { width } = Dimensions.get('window');
const inputWidth = (width - 48 - 18) / 4; // 24px padding + 6px * 3 gaps

export default function OTPVerificationScreen({ route, navigation }) {
  const { phone } = route.params;
  const dispatch = useDispatch();
  const { status: otpStatus, error } = useSelector(state => state.auth);

  const [code, setCode] = useState(['', '', '', '']);
  const inputs = useRef([null, null, null, null]);

  useEffect(() => {
    // auto-focus first field
    inputs.current[0]?.focus();
  }, []);

  const handleChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text.slice(-1);
    setCode(newCode);
    if (text && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otp = code.join('');
    try {
    //   await dispatch(validateOtp({ phone, otp })).unwrap();
      
     navigation.navigate('Main', { otp }); // or your main app screen
    } catch (err) {
      alert('Verification failed — ' + err);
    }
  };

  const handleResend = async () => {
    try {
      await dispatch(generateOtp({ phone })).unwrap();
      alert('Code resent to ' + phone);
    } catch (err) {
      alert('Resend failed — ' + err);
    }
  };

  const allFilled = code.every(d => d !== '');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.header}>Verify Phone </Text>
        <Text style={styles.subheader}>
          Code has been sent to {phone}
        </Text>

        <View style={styles.codeRow}>
          {code.map((digit, i) => (
            <TextInput
              key={i}
              ref={ref => inputs.current[i] = ref}
              value={digit}
              onChangeText={t => handleChange(t, i)}
              keyboardType="numeric"
              maxLength={1}
              style={styles.codeInput}
            />
          ))}
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        <View style={styles.resendRow}>
          <Text style={styles.resendText}>Didn't get OTP Code?</Text>
          <TouchableOpacity onPress={handleResend} disabled={otpStatus === 'loading'}>
            <Text style={styles.resendLink}> Resend Code</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.verifyBtn,
            (!allFilled || otpStatus === 'loading') && styles.btnDisabled
          ]}
          onPress={handleVerify}
          disabled={!allFilled || otpStatus === 'loading'}
        >
          <Text style={styles.verifyText}>
            {otpStatus === 'loading' ? 'Verifying…' : 'Verify'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subheader: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  codeInput: {
    width: inputWidth,
    height: 48,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    backgroundColor: '#FAFAFA',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 12,
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  resendText: { fontSize: 12, color: '#666' },
  resendLink: { fontSize: 12, color: '#3FB1C6' },
  verifyBtn: {
    height: 50,
    backgroundColor: '#3FB1C6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnDisabled: { backgroundColor: '#A1D8E2' },
  verifyText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
