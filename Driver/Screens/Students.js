import React, { useState, useEffect,useContext,} from "react";
import { StyleSheet, Text,Image, View,Button,TouchableOpacity,Switch,ActivityIndicator,Dimensions,Modal} from 'react-native';
import{DriverContext} from "../ContextApi";
import MapView,{Marker,Polyline} from 'react-native-maps';
import * as Location from "expo-location";
import { FontAwesome5,Entypo,Ionicons,MaterialCommunityIcons,MaterialIcons ,AntDesign,FontAwesome ,Zocial  } from '@expo/vector-icons';
const {width, height} = Dimensions.get('window');
import {localhost as LOCAL_HOST} from "../localhost";


export function Students({ navigation,route }) {
const data=useContext(DriverContext);
const [driver,setDriver]=useState(data.driver);
const [bus,setBus]=useState(data.bus);
const [details,setDetails]=useState(null);
const[modalVisible,setModalVisible]=useState(false);
const[modalText,setModalText]=useState("");
useEffect(()=>{
    navigation.setOptions({ headerRight:()=>( 
        <TouchableOpacity onPress={()=>navigation.goBack()}  >        
    <Ionicons style={{marginRight:10,marginTop:5}}name="arrow-back" size={28} color="black" />
    </TouchableOpacity>) });
    fetch(`http://${LOCAL_HOST}:5000/driver/getStudentDet/${bus._id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())  
    .catch(error=> console.error("Error: ",error))
    .then(response=>{
    });
},[]);

const view=(<View>
      <View style={styles.cardContainer}>
        <TouchableOpacity activeOpacity={0.9}>
          <View style={styles.cards}>
          <Text style={styles.cardNames}>Total Students</Text>
          <Text style={styles.number}>100</Text>
          <Ionicons name="people" size={28} color="#FfC329" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.9}>
          <View style={styles.cards}>
          <Text style={styles.cardNames}>Student Onboard</Text>
          <Text style={styles.number}>100</Text>
          <Ionicons name="bus" size={28} color="#FfC329" />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.cardContainer}>
        <TouchableOpacity activeOpacity={0.9}>
          <View style={styles.cards}>
          <Text style={styles.cardNames}>Absent Students</Text>
          <Text style={styles.number}>100</Text>
          <MaterialCommunityIcons name="account-cancel" size={30} color="#FfC329" />
          
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.9}>
          <View style={styles.cards}>
          <Text style={styles.cardNames}>Fee Defaulters</Text>
          <Text style={styles.number}>100</Text>
          <MaterialCommunityIcons name="bus-alert" size={28} color="#FfC329" />
          </View>
        </TouchableOpacity>
      </View>
      <Text style={styles.heading}>Students/Stop</Text>
      <View style={[styles.cardContainer,{marginTop:10}]}>
        <TouchableOpacity activeOpacity={0.9}>
          <View style={styles.cardList}>
          </View>
        </TouchableOpacity>
      </View>
    </View>)
    return (
        <View style={styles.container}>
            {view}
            </View>
      
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:"white"
    }, 
    Button:{
    position:'absolute', 
    marginTop: 10, 
    backgroundColor: '#fff',
    width: '70%',
    alignSelf:'center',
    borderRadius: 5,
    shadowColor: '#FfC329',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
    },
    cardContainer: {
      flexDirection:"row",
      justifyContent:"space-between",
      paddingHorizontal:20,
      marginTop:20,
    },
    cards:{
      borderWidth:1.5,
      backgroundColor:"white",
      borderColor:"#f7e2ab",
      padding:10,
      paddingLeft:20,
      width:150,
      height:130,
      borderRadius:20,
      elevation:6,
      shadowColor: "#f5c13b",
      shadowOffset: {
        width: 0,
        height: 7,
      },
      shadowOpacity: 0.43,
      shadowRadius: 9.51,
      elevation: 15,
    },
    cardList:{
      borderWidth:1.5,
      backgroundColor:"white",
      borderColor:"#f7e2ab",
      padding:10,
      width:320,
      height:315,
      borderRadius:20,
      elevation:6,
      justifyContent:"center",
      shadowColor: "#f5c13b",
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
    number:{
      fontSize:27,
      fontWeight:"bold",
      color:"#293038",
    },
    heading:{
      marginLeft:30,
      marginTop:15,
      fontSize:18,
      fontWeight:"bold",
      color:"#696E74"
      
    },
    image: {
        marginTop:"20%",
        width: 200,
        height: 200,
        shadowColor: "yellow",
      shadowOffset: { height: 2},
      shadowOpacity: 0.3,
      },
      ActivityIndicator:{
        flex: 1,
        justifyContent: "center",
        transform: [{ scaleX: 2.2 }, { scaleY: 2.2 }]
      },
      map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      },
      cardNames:{

        color:"#696E74",
        fontSize:14,
        marginTop:10
    },
  });