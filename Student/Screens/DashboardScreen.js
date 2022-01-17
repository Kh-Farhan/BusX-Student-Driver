
{/*
  const base64Image = student.photo.toString(); 
  <Image style={{width: 100, height: 50}} source={{uri:`data:image/jpeg;charset=utf8;base64,${base64Image}`}}/>
    */}
    
import React, {ActivityIndicator, useState, useEffect,useContext} from "react";
import { StyleSheet,ScrollView, Text,Image, View,Button,componentWillMount,TouchableOpacity} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {StudentContext} from '../ContextApi';
import { FontAwesome5,Entypo,Ionicons,MaterialCommunityIcons,MaterialIcons ,AntDesign    } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import {socket} from "../socket.js";
import * as Notifications from 'expo-notifications';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export function DashboardScreen({ navigation,route }) {
  const data=useContext(StudentContext);
    const [student,setStudent]=useState(data);
    
  

    useEffect(()=>{
      registerForPushNotificationsAsync();
    },[])
    const registerForPushNotificationsAsync=async()=> {
      let token;
        const status = await Notifications.getPermissionsAsync();
        let finalStatus =status;
        console.log(finalStatus);
        if (status.status !== 'granted') {
          const status = await Notifications.requestPermissionsAsync();
          console.log("AfterAsking!"+JSON.stringify(status))
          finalStatus = status;
        }
        if (finalStatus.status !== 'granted') {
          alert('Failed to get push token for push notification!');
          return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        const obj={
          Sid:student._id,
          Ntoken:token
        }
        socket.emit("AddNotificationToken",obj);
        
        console.log(token);
    }







    const Nav=(to)=>{
      if(to==="Route" && student.route===null){
        navigation.navigate(to,{data:route.params.rout});
      }else{
        navigation.navigate(to);
      }
      
    };
  
    
    const Dashboard= (<View>
    <View style={styles.topContainer}>
      <Text style={styles.welcomeM1}>Welcome to <Text style={{color:"#233D6E",fontWeight:"bold"}}>BUS<Text style={{color:"white"}} >X</Text></Text> </Text>
      <Text style={styles.welcomeM2}>{(student.firstName+" "+student.lastName).toUpperCase()} </Text>
    </View>
    <View style={styles.bottomContainer}>
      <View style={styles.cardContainer}>
        <TouchableOpacity activeOpacity={0.9} onPress={Nav.bind(this,"Route")}>
          <View style={styles.cards}>
          <FontAwesome5 style={styles.icons} name="route" size={28} color="#293038" />
          <Text style={styles.cardNames}>Change Route</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.9} onPress={Nav.bind(this,"Track")}>
          <View style={styles.cards}>
          <Entypo style={styles.icons} name="location" size={28} color="#293038" />
          <Text style={styles.cardNames}>Track Bus</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.cardContainer}>
      <TouchableOpacity activeOpacity={0.9} onPress={Nav.bind(this,"SetNearby")}>
          <View style={styles.cards}>
          <Ionicons style={styles.icons} name="notifications" size={28} color="#293038" />
          <Text style={styles.cardNames}>Set Nearby </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.9} onPress={Nav.bind(this,"Attendence")} >
          <View style={styles.cards}>
          <MaterialCommunityIcons style={styles.icons} name="file-document-edit" size={28} color="#293038" />
          <Text style={styles.cardNames}>Attendence</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.cardContainer}>
      <TouchableOpacity activeOpacity={0.9} onPress={Nav.bind(this,"Stops")}>
          <View style={styles.cards}>
          <MaterialCommunityIcons style={styles.icons} name="bus-stop" size={28} color="#293038" />
          <Text style={styles.cardNames}>Set Stop</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.9} onPress={Nav.bind(this,"FeeStatus")}>
          <View style={styles.cards}>
          <MaterialIcons style={styles.icons} name="payment" size={28} color="#293038" />
          <Text style={styles.cardNames}>Fee Status</Text>
          </View>
        </TouchableOpacity>
      </View>
      
    </View>
    </View>);
    
    
    return (
      <View style={styles.container}>
       {student!==undefined?Dashboard:<ActivityIndicator size="large" color="#104691" />}
      </View>
    );
  }
  const styles = StyleSheet.create({
    container: {
      backgroundColor:"white"
    },
    topContainer: {
      height:windowHeight/5,
      backgroundColor:"#FfC329",
      borderBottomLeftRadius:30,
      borderBottomRightRadius:30,
      borderColor:"#696E74",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 7,
      },
      shadowOpacity: 0.43,
      shadowRadius: 9.51,
    },
    bottomContainer: {
      height:windowHeight-(windowHeight/5),
      backgroundColor:"white",
      shadowRadius: 9.51,


    }, 
    cardContainer: {
      flexDirection:"row",
      justifyContent:"space-between",
      padding:"2.5%",
      paddingHorizontal:"11%",
      marginBottom:"14%",
      marginTop:"-13%",
      
      
    },
    cardContainerL: {
      flexDirection:"row",
      justifyContent:"center",
      padding:"3%",
      paddingHorizontal:"11%",
      marginBottom:"28%",
      marginTop:"-13%"
    },
    cards:{
      borderWidth:1,
      backgroundColor:"white",
      borderColor:"#FfC329",
      padding:"3%",
      width:windowWidth/3,
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