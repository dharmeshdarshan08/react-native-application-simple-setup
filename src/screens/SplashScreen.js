// AnimatedSplash.js
import React, { useEffect, useRef } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Easing,
  Image,
  StatusBar,
  Dimensions
} from 'react-native';
const { width } = Dimensions.get('window');

export default function AnimatedSplash({ navigation }) {
  // start at half-size
  const scale = useRef(new Animated.Value(0.5)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // fade in
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),

      // pop past full size
      Animated.timing(scale, {
        toValue: 1.2,
        duration: 400,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),

      // spring back to exactly full size
      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        tension: 80,
        useNativeDriver: true,
      }),

      // hold for a bit
      Animated.delay(800),
    ]).start(() => navigation.replace('SignIn'));
  }, [navigation, opacity, scale]);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Animated.Image
        source={require('../assets/image/splash-logo.png')}
        style={[
          styles.logo,
          {
            transform: [{ scale }],
            opacity,
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  logo: {
    width: width * 0.7,   // 60% of screen width
    height: undefined,
    aspectRatio: 1,
  },
});
