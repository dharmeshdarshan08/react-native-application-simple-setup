import React, { useState, useEffect } from 'react';
import {
  SafeAreaView, ScrollView, View, Text,
  TextInput, TouchableOpacity, StyleSheet
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { generateOtp } from '../features/auth/authSlice';

export default function PhoneSignupScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const dispatch = useDispatch();
  const { status, error } = useSelector(state => state.auth);

  const handleSendCode = async () => {
    try {
      
      await dispatch(generateOtp({ phone })).unwrap();
      // on success, navigate
      navigation.navigate('OTPVerification', { phone });
    } catch (err) {
      // show API error
      alert('Failed to send code: ' + err);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Sign Up</Text>
        <Text style={styles.subheader}>
          Enter your phone number and we’ll send you a verification code
        </Text>

        <View style={styles.inputBlock}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.phoneRow}>
            <View style={styles.phoneCode}>
              <Text style={styles.phoneCodeText}>+91</Text>
            </View>
            <TextInput
              style={styles.phoneInput}
              placeholder="Enter Phone Number"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>
        </View>

        {error && (
          <Text style={styles.errorText}>
            {typeof error === 'string'
              ? error
              : error?.Message || error?.message || JSON.stringify(error)}
          </Text>
        )}

        <TouchableOpacity
          style={[
            styles.button,
            (!phone || status === 'loading') && styles.buttonDisabled
          ]}
          onPress={handleSendCode}
          disabled={!phone || status === 'loading'}
        >
          <Text style={styles.buttonText}>
            {status === 'loading' ? 'Sending…' : 'Send Code'}
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ... reuse your existing styles here ...


const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },

  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    textAlign: 'left',
  },
  subheader: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    textAlign: 'left',
  },

  inputBlock: { marginBottom: 24 },
  label: { fontSize: 14, color: '#555', marginBottom: 6 },
  phoneRow: { flexDirection: 'row', alignItems: 'center' },
  phoneCode: {
    width: 60,
    height: 48,
    borderWidth: 1,
    borderColor: '#CCC',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  phoneCodeText: { fontSize: 16, color: '#333' },
  phoneInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderColor: '#CCC',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FAFAFA',
  },

  button: {
    height: 50,
    backgroundColor: '#3FB1C6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  buttonDisabled: {
    backgroundColor: '#A1D8E2',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  footer: { flexDirection: 'row', justifyContent: 'center' },
  footerText: { fontSize: 12, color: '#666' },
  signInLink: { fontSize: 12, color: '#3FB1C6', fontWeight: '600' },
});
