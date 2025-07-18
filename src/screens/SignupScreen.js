import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  return (
    
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.inner}>

          {/* Header */}
          <Text style={styles.header}>Create Account</Text>
          <Text style={styles.subheader}>
            Fill your information below or register with your social account
          </Text>

          {/* Name */}
          <View style={styles.inputBlock}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Phone */}
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

          {/* Email */}
          <View style={styles.inputBlock}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="example@gmail.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Password */}
          <View style={styles.inputBlock}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, { flex: 1, marginRight: 8 }]}
                placeholder="********"
                secureTextEntry={secure}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setSecure(!secure)}>
                <Image
                  source={
                    secure
                      ? require('../assets/icon/eyeoff.png')
                      : require('../assets/icon/eyeon.png')
                  }
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign Up */}
          <TouchableOpacity style={styles.button} onPress={() => { /* your signup logic */ }}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          {/* Or separator */}
          <View style={styles.socialSeparator}>
            <View style={styles.line} />
            <Text style={styles.orText}>Or sign in with</Text>
            <View style={styles.line} />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  inner: { alignItems: 'stretch' },

  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
    textAlign: 'left',
  },
  subheader: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    textAlign: 'left',
  },

  inputBlock: { marginBottom: 16 },
  label: { fontSize: 14, color: '#555', marginBottom: 6 },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FAFAFA',
  },

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

  passwordRow: { flexDirection: 'row', alignItems: 'center' },

  termsRow: { flexDirection: 'row', marginBottom: 24 },
  termsText: { fontSize: 12, color: '#666' },
  termsLink: {
    fontSize: 12,
    color: '#3FB1C6',
    textDecorationLine: 'underline',
  },

  button: {
    height: 50,
    backgroundColor: '#3FB1C6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  socialSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  line: { flex: 1, height: 1, backgroundColor: '#CCC' },
  orText: {
    marginHorizontal: 12,
    fontSize: 12,
    color: '#666',
  },

  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  socialBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    // shadow for iOS
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    // elevation for Android
    elevation: 3,
  },

  footer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16 },
  footerText: { fontSize: 12, color: '#666' },
  signInLink: {
    fontSize: 12,
    color: '#3FB1C6',
    fontWeight: '600',
  },
   icon: {
    width: 24,
    height: 24,
    tintColor: '#666',   // optional, if you want to recolor a monochrome PNG/SVG
  },
});
