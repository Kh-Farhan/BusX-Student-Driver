
import React, { useState, useEffect,useContext,} from "react";
import { StyleSheet, Text,Image, View,Button,TouchableOpacity,Switch,ActivityIndicator,Dimensions,Modal} from 'react-native';
import{DriverContext} from "../ContextApi";
import MapView,{Marker,Polyline} from 'react-native-maps';
import * as Location from "expo-location";
import { Ionicons } from '@expo/vector-icons';
const {width, height} = Dimensions.get('window');
import {localhost as LOCAL_HOST} from "../localhost";
import { TextInput } from "react-native-gesture-handler";
import io from "socket.io-client";
export function RFID({ navigation,route }) {

const Sdata=useContext(DriverContext);
const[data,setData]=useState(Sdata);
const[modalVisible,setModalVisible]=useState(false);
const[modalText,setModalText]=useState("");
const[rfid,setRfid]=useState(null);
const socket = io(`http://${LOCAL_HOST}:4000/`,{transports: ['websocket']});
  socket.on('connect_error', err => console.log(err));
  socket.on('connect_failed', err => console.log(err));
  socket.on('disconnect', err => console.log(err));
  
useEffect(()=>{
    navigation.setOptions({ headerRight:()=>( 
        <TouchableOpacity onPress={()=>navigation.goBack()}  >        
    <Ionicons style={{marginRight:10,marginTop:5}}name="arrow-back" size={28} color="black" />
    </TouchableOpacity>) });
},[]);

// useEffect(()=>{
// if(rfid!==null){
//   if(rfid.toString().length===6){
    
//   }
// }

// },[rfid])
let interval=null;
const handleSubmit=(rfid)=>{
  console.log("Triggered!!")
  fetch(`http://${LOCAL_HOST}:5000/driver/scanRfid`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({rfid:rfid})
  })
  .then(response => response.json())  
  .catch(error=> console.error("Error: ",error))
  .then(response=>{ 
    setModalText(response.Success);
    setModalVisible(true);
  })
  
 
};

const view=(<View>
    <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{modalText}</Text>
            <TouchableOpacity  style={styles.SButton} onPress={()=>{
            setModalVisible(false);
            navigation.navigate("Dashboard")}}>
        <Text style={styles.ButtonText} >OK</Text>
        </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.inputFields}>
      <TextInput
          style={styles.TextInput}
          placeholder="RFID"
          placeholderTextColor="#293038" 
          value={rfid}
          onChangeText={(text)=>{
            handleSubmit(text);
           }}
        />
        </View>
      <Image  style={{marginTop:"10%",width:350,height:350,alignSelf:"center"}} source={require('../assets/scan.gif')} />
      <Text style={styles.RFIDtext}>Scan Now!</Text>
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
    marginTop: height-150, 
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
    modalView: {
        width:"90%",
        alignSelf:"center",
        marginTop: "100%",
        backgroundColor: "white",
        borderRadius: 20,
        borderWidth:1,
        borderColor:"#FfC329",
        padding: 35,
        alignItems: "center",
        shadowColor: "#FfC329",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      SButton:{
        alignItems: "center",
        marginTop:10,
        backgroundColor:"#293038",
        width:100,
        height:30,
        borderRadius:6,
        paddingTop:"1.5%",
      
      },
      ButtonText:{
        color: "#FfC329",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
      },
      modalText:{
        textAlign: 'center',
      color:"#293038",
      fontSize:20
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
      inputFields:{
        borderColor:"#FfC329",
        borderRadius:10,
        borderWidth:2,
        height: 40,
        width:300,
        margin: 12,
        paddingLeft:10,
         flexDirection: 'row',
        alignSelf: 'center',
      },
      TextInput:{
        marginLeft:10,
        width:300
      },
      RFIDtext:{
        textAlign: 'center',
        color:"#FfC329",
        fontSize:30,
        fontWeight:"bold",
        textShadowColor: '#293038', 
      textShadowOffset: { width: 0.5, height: 0.5 }, 
      textShadowRadius: 1,
      },
  });