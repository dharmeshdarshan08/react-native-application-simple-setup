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
// total gap width = GAP_SIZE * (NUM_INPUTS - 1)
const inputWidth = (width - HORIZONTAL_PADDING - GAP_SIZE * (NUM_INPUTS - 1)) / NUM_INPUTS;

export default function OTPVerificationScreen({ route, navigation }) {
  const { phone } = route.params;
  const dispatch = useDispatch();
  const { status: otpStatus, error } = useSelector(state => state.auth);

  const [code, setCode] = useState(Array(NUM_INPUTS).fill(''));
  const [fullOtp, setFullOtp] = useState(''); // Store complete OTP
  const inputs = useRef(Array(NUM_INPUTS).fill(null));

  useEffect(() => {
    // auto-focus first field
    inputs.current[0]?.focus();
  }, []);

  // Effect to handle OTP distribution when fullOtp changes
  useEffect(() => {
    if (fullOtp && fullOtp.length >= NUM_INPUTS) {
      const otpArray = fullOtp.slice(0, NUM_INPUTS).split('');
      const newCode = Array(NUM_INPUTS).fill('');
      
      // Fill the array with the OTP digits
      for (let i = 0; i < NUM_INPUTS; i++) {
        newCode[i] = otpArray[i] || '';
      }
      
      setCode(newCode);
      
      // Focus on the last input
      setTimeout(() => {
        inputs.current[NUM_INPUTS - 1]?.focus();
      }, 100);
    }
  }, [fullOtp]);

  const handleChange = (text, index) => {
    // Handle auto-fill case where complete OTP is pasted/filled
    if (text.length > 1) {
      const digits = text.replace(/\D/g, ''); // Remove non-digits
      if (digits.length >= NUM_INPUTS) {
        // Store the complete OTP
        setFullOtp(digits);
        return;
      }
    }

    // Handle single character input
    const newCode = [...code];
    const digit = text.replace(/\D/g, ''); // Only allow digits
    newCode[index] = digit.slice(-1); // Take last digit only
    setCode(newCode);
    
    // Update fullOtp with current state
    const currentOtp = newCode.join('');
    setFullOtp(currentOtp);
    
    // Move focus forward if a digit was entered
    if (digit && index < NUM_INPUTS - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Handle backspace to move focus backward
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otp = fullOtp || code.join('');
    try {
      await dispatch(validateOtp({ phone, otp })).unwrap();
      navigation.navigate('Main'); // or your main app screen
    } catch (err) {
      alert('Verification failed — ' + err);
    }
  };

  const handleResend = async () => {
    try {
      await dispatch(generateOtp({ phone })).unwrap();
      alert('Code resent to ' + phone);
      // Clear the current code and fullOtp
      setCode(Array(NUM_INPUTS).fill(''));
      setFullOtp('');
      setTimeout(() => {
        inputs.current[0]?.focus();
      }, 100);
    } catch (err) {
      alert('Resend failed — ' + err);
    }
  };

  const allFilled = code.every(d => d !== '') || fullOtp.length >= NUM_INPUTS;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.header}>Verify Phone</Text>
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
              onKeyPress={e => handleKeyPress(e, i)}
              keyboardType="numeric"
              maxLength={NUM_INPUTS}
              style={[
                styles.codeInput,
                digit ? styles.codeInputFilled : null
              ]}
              selectTextOnFocus
              autoComplete="sms-otp" // Android auto-fill
              textContentType="oneTimeCode" // iOS auto-fill
              importantForAutofill="yes" // Additional Android support
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