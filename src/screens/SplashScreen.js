// AnimatedSplash.js
import React, { useEffect, useRef } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Easing,
  StatusBar,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode'; // Updated import syntax

const { width } = Dimensions.get('window');
const ANIMATION_DURATION = 800; // total splash time

export default function AnimatedSplash({ navigation }) {
  const scale = useRef(new Animated.Value(0.5)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1) play splash animation in parallel
    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(scale,   { toValue: 1.2, duration: 400, easing: Easing.out(Easing.exp), useNativeDriver: true }),
      Animated.spring(scale,   { toValue: 1, friction: 4, tension: 80, useNativeDriver: true }),
      // leave ~300ms so total ≈1200ms
      Animated.delay(ANIMATION_DURATION),
    ]).start();

    // 2) load & validate JWT
    (async () => {
      let target = 'SignIn';
      let mobile = null;

      try {
        const token = await AsyncStorage.getItem('jwt');
        console.log('Loaded JWT:', token);

        if (token) {
          try {
            const decoded = jwtDecode(token);
            console.log('Decoded payload:', decoded);

            // Check if token has expiry and validate it
            if (decoded.exp) {
              // convert exp (in seconds) into milliseconds
              const expMs = Number(decoded.exp) * 1000;
              console.log('Expiry timestamp (ms):', expMs, '=>', new Date(expMs));

              if (expMs > Date.now()) {
                target = 'Main';
                console.log('Token still valid. Navigating to Home with mobile:', mobile);
              } else {
                console.log('Token expired at', new Date(expMs));
                // Optionally remove expired token
                await AsyncStorage.removeItem('jwt');
              }
            } else {
              // Token doesn't have expiry, assume it's valid
              console.log('Token has no expiry, assuming valid');
              target = 'Main';
              mobile = decoded.mobile;
            }
          } catch (decodeError) {
            console.error('Error decoding JWT:', decodeError);
            // If token is malformed, remove it
            await AsyncStorage.removeItem('jwt');
          }
        } else {
          console.log('No token found in AsyncStorage');
        }
      } catch (e) {
        console.error('Error loading JWT from AsyncStorage:', e);
      }

      // 3) after splash, navigate
      setTimeout(() => {
        if (target === 'Main') {
          navigation.replace('Main',{ mobile });
        } else {
          navigation.replace('SignIn');
        }
      }, ANIMATION_DURATION);
    })();
  }, [navigation, opacity, scale]);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Animated.Image
        source={require('../assets/image/splash-logo.png')}
        style={[styles.logo, { opacity, transform: [{ scale }] }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
  },
  logo: {
    width: width * 0.7,
    aspectRatio: 1,
    height: undefined
  },
});