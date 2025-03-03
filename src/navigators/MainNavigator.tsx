import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import TabNavigator from './TabNavigator';
import DrawerNavigator from './DrawerNavigator';
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen';

const MainNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Main" component={DrawerNavigator} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />

    </Stack.Navigator>
  );
};

export default MainNavigator;
