import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View,Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer} from '@react-navigation/native';
import {SplashScreen} from "./Screens/SplashScreen";
import {LoginScreen} from "./Screens/LoginScreen";
import {DashboardScreen} from "./Screens/DashboardScreen";
import {AppNavigation} from "./Screens/AppNavigation";
import {fromLeft} from 'react-navigation-transitions';
import {ForgetPassword} from '../Student/Screens/ForgetPassword.js';

const Stack = createStackNavigator();



export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator  initialRouteName="Splash">
        <Stack.Screen 
        options={{headerShown: false}}
        name="Splash" 
        component={SplashScreen} />
        <Stack.Screen 
        name="Login" 
        options={{headerShown: false}}
        component={LoginScreen} />
        <Stack.Screen 
        name="AppNav" 
        options={{headerShown: false}}
        component={AppNavigation} />
        <Stack.Screen 
        name="forgetPassword" 
        options={{headerShown: false}}
        component={ForgetPassword} />
      </Stack.Navigator>
      
  </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  Head:{
    textAlign:'center',
    fontSize:25,
    fontWeight:'bold',
    color:'#1F9DE7'
  },
});

