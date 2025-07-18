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
const NUM_INPUTS = 6;
const GAP_SIZE = 6; // px between inputs
const HORIZONTAL_PADDING = 24 * 2; // left + right padding
const inputWidth = (width - HORIZONTAL_PADDING - GAP_SIZE * (NUM_INPUTS - 1)) / NUM_INPUTS;

export default function OTPVerificationScreen({ route, navigation }) {
  const { phone } = route.params;
  const dispatch = useDispatch();
  const { status: otpStatus, error } = useSelector(state => state.auth);

  // OTP stored as a single string, each digit in its place (eg. '123456')
  const [otp, setOtp] = useState('');
  const inputs = useRef([]);

  // Focus the first input on mount if not filled
  useEffect(() => {
    if (!otp) inputs.current[0]?.focus();
  }, []);

  // Handle digit change or paste
  const handleChange = (text, idx) => {
    let digits = text.replace(/\D/g, '');
    if (digits.length > 1) {
      // Pasted or autofilled (entire OTP)
      setOtp(digits.slice(0, NUM_INPUTS));
      setTimeout(() => {
        inputs.current[Math.min(digits.length, NUM_INPUTS) - 1]?.focus();
      }, 50);
    } else {
      // Single digit input
      let arr = otp.split('');
      arr[idx] = digits;
      const newOtp = arr.join('').slice(0, NUM_INPUTS);
      setOtp(newOtp);
      if (digits && idx < NUM_INPUTS - 1) {
        inputs.current[idx + 1]?.focus();
      }
    }
  };

  // Handle backspace and auto focus back
  const handleKeyPress = (e, idx) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[idx] && idx > 0) {
      let arr = otp.split('');
      arr[idx - 1] = '';
      setOtp(arr.join('').slice(0, NUM_INPUTS));
      inputs.current[idx - 1]?.focus();
    }
  };

  // Submit OTP
  const handleVerify = async () => {
    try {
      await dispatch(validateOtp({ phone, otp })).unwrap();
      navigation.navigate('Main'); // replace with your app's main screen
    } catch (err) {
      alert('Verification failed — ' + err);
    }
  };

  // Resend code
  const handleResend = async () => {
    try {
      await dispatch(generateOtp({ phone })).unwrap();
      alert('Code resent to ' + phone);
      setOtp('');
      setTimeout(() => {
        inputs.current[0]?.focus();
      }, 100);
    } catch (err) {
      alert('Resend failed — ' + err);
    }
  };

  const allFilled = otp.length === NUM_INPUTS;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.header}>Verify Phone</Text>
        <Text style={styles.subheader}>
          Code has been sent to {phone}
        </Text>

        <View style={styles.codeRow}>
          <TextInput
            value={otp}
            onChangeText={text => setOtp(text.replace(/\D/g, '').slice(0, NUM_INPUTS))}
            keyboardType="number-pad"
            maxLength={NUM_INPUTS}
            style={[styles.codeInput, otp.length === NUM_INPUTS ? styles.codeInputFilled : null, { width: width - HORIZONTAL_PADDING }]}
            selectTextOnFocus
            autoComplete="sms-otp"
            textContentType="oneTimeCode"
            importantForAutofill="yes"
            returnKeyType="done"
            placeholder={Array(NUM_INPUTS).fill('•').join('')}
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.resendRow}>
          <Text style={styles.resendText}>Didn't get OTP Code?</Text>
          <TouchableOpacity onPress={handleResend} disabled={otpStatus === 'loading'}>
            <Text style={styles.resendLink}> Resend Code</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.verifyBtn,
            (otp.length !== NUM_INPUTS || otpStatus === 'loading') && styles.btnDisabled
          ]}
          onPress={handleVerify}
          disabled={otp.length !== NUM_INPUTS || otpStatus === 'loading'}
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
  codeInputFilled: {
    borderColor: '#3FB1C6',
    backgroundColor: '#F0F9FB',
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
