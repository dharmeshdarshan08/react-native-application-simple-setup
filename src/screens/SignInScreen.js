// SignInScreen.js
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

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.inner}>
          <Text style={styles.header}>Sign In</Text>
          <Text style={styles.subheader}>Hi, welcome back</Text>

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

          {/* Forget */}
          <TouchableOpacity style={styles.forgotBtn} onPress={() => {/* TODO */ }}>
            <Text style={styles.forgotText}>Forget Password?</Text>
          </TouchableOpacity>

          {/* Sign In */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => {/* your login logic */ }}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          {/* separator */}
          <View style={styles.socialSeparator}>
            <View style={styles.line} />
            <Text style={styles.orText}>Or sign in with</Text>
            <View style={styles.line} />
          </View>


          {/* footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
              <Text style={styles.signUpLink}>Sign Up</Text>
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

  header: { fontSize: 28, fontWeight: '700', color: '#333', marginBottom: 4 },
  subheader: { fontSize: 14, color: '#666', marginBottom: 24 },

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

  passwordRow: { flexDirection: 'row', alignItems: 'center' },

  forgotBtn: { alignSelf: 'flex-end', marginBottom: 24 },
  forgotText: { fontSize: 12, color: '#3FB1C6' },

  button: {
    height: 50,
    backgroundColor: '#3FB1C6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  socialSeparator: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  line: { flex: 1, height: 1, backgroundColor: '#CCC' },
  orText: { marginHorizontal: 12, fontSize: 12, color: '#666' },

  socialIcons: { flexDirection: 'row', justifyContent: 'center', marginBottom: 24 },
  socialBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  footer: { flexDirection: 'row', justifyContent: 'center' },
  footerText: { fontSize: 12, color: '#666' },
  signUpLink: { fontSize: 12, color: '#3FB1C6', fontWeight: '600' },
   icon: {
    width: 24,
    height: 24,
    tintColor: '#666',   // optional, if you want to recolor a monochrome PNG/SVG
  }
});
