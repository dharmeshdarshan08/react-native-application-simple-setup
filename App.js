// App.js
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './src/screens/SplashScreen';
import SignupScreen from './src/screens/SignupScreen';
import SignInScreen from './src/screens/SignInScreen';
import OTPVerificationScreen from './src/screens/OTPVerificationScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import UploadScreen from './src/screens/UploadScreen';
import { Provider } from 'react-redux';
import { store } from './src/store/store';


const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="SignUp" component={SignupScreen} />
        <Stack.Screen name="SignIn"   component={SignInScreen} />  
        <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />  
        <Stack.Screen name="Home" component={HomeScreen} />  
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />  
        <Stack.Screen name="UploadScreen" component={UploadScreen} />  
      </Stack.Navigator>
    </NavigationContainer>
      </Provider>
  );
}
