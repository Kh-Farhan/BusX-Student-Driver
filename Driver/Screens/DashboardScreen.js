
{/*
  const base64Image = student.photo.toString(); 
  <Image style={{width: 100, height: 50}} source={{uri:`data:image/jpeg;charset=utf8;base64,${base64Image}`}}/>
    */}
    
import React, {ActivityIndicator, useState, useEffect,useContext} from "react";
import { StyleSheet,ScrollView, Text,Image, View,Button,componentWillMount,TouchableOpacity} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome5,Entypo,Ionicons,MaterialCommunityIcons,MaterialIcons ,AntDesign,FontAwesome ,Zocial  } from '@expo/vector-icons';
import { DriverContext } from "../ContextApi";
import SwipeButton from 'rn-swipe-button';
import {localhost as LOCAL_HOST} from "../localhost";
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as TaskManager from 'expo-task-manager';
const TASK_FETCH_LOCATION = 'BackgroundLocationFetch'; 
let busID="";
let nearBy={};
import {socket} from "../socket.js";
export function DashboardScreen({ navigation,route }) {
  const data=useContext(DriverContext);
    const [driver,setDriver]=useState(data.driver);
    const [bus,setBus]=useState(data.bus);
    const [swiped,setSwiped]=useState(false);
    const [int,setInt]=useState(null);
    const [prevLocation,setPrevLocation]=useState();
    busID=bus._id;

  const handleSubmit=async()=>{
    let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
    let backPerm = await Location.requestBackgroundPermissionsAsync();
    console.log(backPerm);
    setSwiped(true);
    socket.on('connect_error', err => console.log(err));
    socket.on('connect_failed', err => console.log(err));
    socket.on('disconnect', err => console.log(err));
    console.log("Pressed!");
    let index=0;
    {/*setPrevLocation(Location.watchPositionAsync({accuracy: Location.Accuracy.Balanced, timeInterval: 300, distanceInterval: 0 },(location)=>{
      console.log(location.coords.latitude+","+location.coords.longitude);
      const loc={bus:bus._id,lat:location.coords.latitude,lng:location.coords.longitude,status:"start"}
      socket.emit("initial_data",loc);
    }));*/}
    Location.startLocationUpdatesAsync((TASK_FETCH_LOCATION), {
      accuracy: Location.Accuracy.Highest,
      distanceInterval: 5 , // minimum change (in meters) betweens updates
      deferredUpdatesInterval: 300, // minimum interval (in milliseconds) between updates
      // foregroundService is how you get the task to be updated as often as would be if the app was open
      foregroundService: {
        notificationTitle: 'Using your location',
        notificationBody: 'To turn off, go back to the app and switch something off.',
      },
    });

  
  };
  const handleCancel=()=>{
    setSwiped(false);
    const loc={bus:bus._id,status:"end"}
    socket.emit("initial_data",loc);
    console.log("Not Sharing !0");
    console.log(prevLocation);
    //prevLocation._W.remove();

    Location.stopLocationUpdatesAsync(TASK_FETCH_LOCATION);
    
  };


    
  
    const Nav=(to)=>{
      navigation.navigate(to);
    };
  
    
    const Dashboard= (<View>
    <View style={styles.topContainer}>
      <Text style={styles.welcomeM1}>Welcome to <Text style={{color:"#233D6E",fontWeight:"bold"}}>BUS<Text style={{color:"white"}} >X</Text></Text> </Text>
      <Text style={styles.welcomeM2}>{(driver.firstName+" "+driver.lastName).toUpperCase()} </Text>
      <View style={styles.topMidContainer}>
      <Text style={styles.midText}>{("Bus no "+bus.busNumber).toUpperCase()} </Text>
      <Text style={[styles.midText,{fontSize:18}]}>{(bus.registrationNumber).toUpperCase()} </Text>
      </View>
      
    </View>
    <View style={styles.bottomContainer}>
      <View style={styles.cardContainer}>
        <TouchableOpacity activeOpacity={0.9} onPress={Nav.bind(this,"Directions")}>
          <View style={styles.cards}>
          <Entypo style={styles.icons} name="location" size={28} color="#293038" />
          <Text style={styles.cardNames}>Directions</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.9} onPress={Nav.bind(this,"Scan RFID")}>
          <View style={styles.cards}>
          <FontAwesome style={styles.icons} name="id-badge" size={28} color="#293038" />
          <Text style={styles.cardNames}>Scan RFID</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.cardContainer}>
      <TouchableOpacity activeOpacity={0.9} onPress={Nav.bind(this,"Scan QR")}>
          <View style={styles.cards}>
          <AntDesign style={styles.icons} name="qrcode" size={28} color="#293038" />
          <Text style={styles.cardNames}>Scan QR</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.9} onPress={Nav.bind(this,"Stops")}>
          <View style={styles.cards}>
          <MaterialCommunityIcons style={styles.icons} name="bus-stop" size={28} color="#293038"/>
          <Text style={styles.cardNames}>Stops</Text>
          </View>
        </TouchableOpacity>
        </View>
        <View style={styles.cardContainer}>
      <TouchableOpacity activeOpacity={0.9} onPress={Nav.bind(this,"Student Details")}>
          <View style={styles.cards}>
          <MaterialCommunityIcons style={styles.icons} name="account-details" size={28} color="#293038" />
          <Text style={styles.cardNames}>Student Details</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.9} onPress={Nav.bind(this,"Guest")}>
          <View style={styles.cards} >
          <Zocial style={styles.icons} name="guest" size={27} color="#293038" />
          <Text style={styles.cardNames}>Register Guest</Text>
          </View>
        </TouchableOpacity>
        </View>
        {!swiped?
        <SwipeButton
            onSwipeSuccess={handleSubmit}
            railBackgroundColor="#FfC329"
            railStyles={{
              backgroundColor: 'transparent',
              borderColor: 'transparent',
            }}
            containerStyles={{borderWidth:0,elevation:10}}
            thumbIconBorderColor="#696E74"
            resetAfterSuccessAnimDelay={-15}
            shouldResetAfterSuccess={true}
            thumbIconBackgroundColor="#293038"
            title="Slide to Share Location"
            
          />:
          <SwipeButton
          enableReverseSwipe
          onSwipeSuccess={handleCancel}
          railBackgroundColor="#293038"
          resetAfterSuccessAnimDelay={-15}
          shouldResetAfterSuccess={true}
          railStyles={{
            backgroundColor: 'transparent',
            borderColor: 'transparent',
          }}
          thumbIconBorderColor="#696E74"
          thumbIconBackgroundColor="#FfC329"
          title="Slide to Cancel Sharing"
          titleColor="#FfC329"
        /> }
       
        
        
        
        
        
    </View>
    </View>);
    
    
    return (
      <View style={styles.container}>
       {driver!==undefined?Dashboard:<ActivityIndicator size="large" color="#104691" />}
      </View>
    );
  }

  TaskManager.defineTask(TASK_FETCH_LOCATION, async ({ data: { locations }, error }) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log("HEre")
    const [location] = locations;
    console.log(busID+": "+location.coords.latitude+","+location.coords.longitude);
      const loc={bus:busID,lat:location.coords.latitude,lng:location.coords.longitude,status:"start"}
      socket.emit("initial_data",loc);
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:"white",
      
    },
    SButton:{
      alignItems: "center",
      marginTop:10,
      backgroundColor:"#293038",
      width:100,
      height:50,
      borderRadius:6,
      paddingTop:"1.5%",
    
    },
    ButtonText:{
      color: "#FfC329",
      fontWeight: "bold",
      alignSelf: "center",
      textTransform: "uppercase"
    },
    topContainer: {
      backgroundColor:"#FfC329",
      height:"35%",
      borderBottomLeftRadius:30,
      borderColor:"#696E74",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 7,
      },
      shadowOpacity: 0.43,
      shadowRadius: 9.51,
    },
    titleText: {
      fontSize: 17,
      fontWeight: 'normal',
      textAlign: 'center',
      color: '#293038'
  },
    topMidContainer: {
      alignSelf:"center",
      marginTop:10,
      width:"90%",
      backgroundColor:"#293038",
      borderTopRightRadius:30,
      borderBottomLeftRadius:30,
      padding:10,
      borderColor:"#696E74",
      borderWidth:2,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 7,
      },
      shadowOpacity: 0.43,
      shadowRadius: 9.51,
      elevation: 20,
    },
    bottomContainer: {
      shadowRadius: 9.51,
      height:"65%"
      

    }, 
    cardContainer: {
      flexDirection:"row",
      justifyContent:"space-between",
      padding:10,
      paddingHorizontal:40,
      marginBottom:50,
      marginTop:-50,
      
      
    },
    cardContainerL: {
      flexDirection:"row",
      justifyContent:"center",
      padding:10,
      paddingHorizontal:50,
      marginBottom:100,
      marginTop:-50
    },
    cards:{
      borderWidth:1.5,
      backgroundColor:"white",
      borderColor:"#FfC329",
      width:120,
      height:100,
      borderRadius:20,
      elevation:6,
      justifyContent:"center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 7,
      },
      shadowOpacity: 0.43,
      shadowRadius: 9.51,
      elevation: 15,
    },
    text:{
      textAlign: 'center',
      color:"black",
      fontSize:30
    },
    midText:{
      textAlign: 'center',
      color:"#FfC329",
      fontSize:20,
      textShadowColor: '#696E74', 
      textShadowOffset: { width: 0.5, height: 0.5 }, 
      textShadowRadius: 1,
    },
    welcomeM1:{
      textAlign: 'center',
      color:"#293038",
      fontSize:22,
      textShadowColor: '#DCDCDC', 
      textShadowOffset: { width: 0.5, height: 0.5 }, 
      textShadowRadius: 1,
    },
    welcomeM2:{
      textAlign: 'center',
      color:"#293038",
      fontSize:30,
      textShadowColor: '#DCDCDC', 
      textShadowOffset: { width: 0.5, height: 0.5 }, 
      textShadowRadius: 1,
    },
    image: {
      width: 100,
      height: 100,

    },
    cardNames:{
        textAlign: 'center',
        color:"#293038",
        fontSize:16,
        marginTop:10
    },
    
    
  });