{/*
  const base64Image = student.photo.toString(); 
  <Image style={{width: 100, height: 50}} source={{uri:`data:${student.photoType};charset=utf8;base64,${Buffer.from(student.photo).toString('ascii')}`}}/>
    */}
import React, { useState, useEffect,createContext,useContext} from "react";
import { StyleSheet, Text,Image, View,Button,TouchableOpacity} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import{DriverContext} from "../ContextApi";
import { NavigationContainer,DrawerActions,NavigationActions } from '@react-navigation/native';
import {DashboardScreen} from "./DashboardScreen";
import {EmergencyNav} from "./EmergencyNav";
import {LoginScreen} from "./LoginScreen";
import { createDrawerNavigator } from '@react-navigation/drawer';
import {AccountSetting} from './AcountSetting';
import { AsyncStorage } from 'react-native';
import {CustomDrawer} from '../assets/CustomDrawer';
import { AntDesign,MaterialIcons,Octicons,MaterialCommunityIcons   } from '@expo/vector-icons';
import { FuelNav } from "./FuelNav";
import {RFID} from './RFID';
import { TrackBus } from './TrackBus';
import {QR} from "./QR";
import {Stops} from "./Stops";
import {Students} from "./Students";
import {Guest} from "./Guest";


const Buffer = require('buffer/').Buffer
function DashboardNav({navigation,route}) {
  const data=useContext(DriverContext);
    const [driver,setDriver]=useState(data.driver);
    const [bus,setBus]=useState(data.bus);
    return (
        <Stack.Navigator  
        screenOptions={{ 
          headerTitleAlign:"center",
          headerLeft:()=>( 
            <TouchableOpacity style={{borderWidth:1,borderColor:"#696E74",marginLeft:10,borderRadius:30,elevation:6,marginTop:3}}onPress={() => navigation.openDrawer()}  >
           <Image style={{width: 100, height: 50}} source={{uri:`data:${driver.photoType};charset=utf8;base64,${Buffer.from(driver.photo).toString('ascii')}`}} 
            style={{height:50,width:50,borderWidth:1,borderRadius:30}}/>

        </TouchableOpacity>)
         }}
        initialRouteName={"Dashboard"}>
          <Stack.Screen  options={{   
        headerStyle: {
          backgroundColor: '#FfC329',elevation:0
        }
        }} name="Dashboard" component={DashboardScreen} />
        <Stack.Screen  options={{   
        headerStyle: {
          backgroundColor: '#FfC329',elevation:0
        },
        }} name="Scan RFID" component={RFID} />
        <Stack.Screen  options={{   
        headerStyle: {
          backgroundColor: '#FfC329',elevation:0
        },
        }} name="Directions" component={TrackBus} />
        <Stack.Screen  options={{   
        headerStyle: {
          backgroundColor: '#FfC329',elevation:0
        },
        }} name="Scan QR" component={QR} />
        <Stack.Screen  options={{   
        headerStyle: {
          backgroundColor: '#FfC329',elevation:0
        },
        }} name="Stops" component={Stops} />
        <Stack.Screen  options={{   
        headerStyle: {
          backgroundColor: '#FfC329',elevation:0
        },
        }} name="Student Details" component={Students} />
        <Stack.Screen  options={{   
        headerStyle: {
          backgroundColor: '#FfC329',elevation:0
        },
        }} name="Guest" component={Guest} />
        </Stack.Navigator>
   
    );
  }

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();


function AppNavigation({route,navigation}) {
    const [data,setData]=useState(route.params.data);
    const signOut=()=>{
      navigation.navigate("Login");
    };
  return (
      <DriverContext.Provider value={data}>
      <Drawer.Navigator  initialRouteName="DashboardNav"
      drawerContentOptions={{
        activeTintColor: '#FfC329',
        itemStyle: {marginVertical: 5},
        
      }}
      drawerContent={(props) => <CustomDrawer signOut={signOut}  {...props} />}>
        <Drawer.Screen 
        name="Dashboard"
        options={{
          drawerIcon: () => (
            <MaterialIcons name="dashboard" size={22} color={'#293038'} style={{marginRight:-25}} />
          ),

       }} 
        component={DashboardNav} />
        <Drawer.Screen 
        name="Acount Settings" 
        options={{
          drawerIcon: () => (
            <AntDesign name="setting" size={22} color={'#293038'} style={{marginRight:-25}} />
          ),
       }}
        component={AccountSetting} />
        <Drawer.Screen 
        name="Fuel" 
        options={{
          drawerIcon: () => (
            <MaterialCommunityIcons name="fuel" size={26} color='#293038' style={{marginRight:-25,marginLeft:-5}}/>
          ),
       }}
        component={FuelNav} />
        <Drawer.Screen 
        name="Emergency" 
        options={{
          drawerIcon: () => (
            <MaterialIcons name="bus-alert" size={22} color='#293038' style={{marginRight:-25}} />
          ),
       }}
        component={EmergencyNav} />
      </Drawer.Navigator>
      </DriverContext.Provider>
  );
}
export{AppNavigation,DriverContext};


