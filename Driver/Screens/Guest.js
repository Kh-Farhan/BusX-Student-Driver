import React, { useState, useEffect,useContext,} from "react";
import { StyleSheet, Text,TextInput,Image, View,Button,TouchableOpacity,Switch,ActivityIndicator,Dimensions,Modal} from 'react-native';
import{DriverContext} from "../ContextApi";
import MapView,{Marker,Polyline} from 'react-native-maps';
import * as Location from "expo-location";
import { Ionicons,MaterialIcons,MaterialCommunityIcons,AntDesign,Feather   } from '@expo/vector-icons';
const {width, height} = Dimensions.get('window');
import {localhost as LOCAL_HOST} from "../localhost";

export function Guest({ navigation,route }) {
const Sdata=useContext(DriverContext);
const[data,setData]=useState(Sdata);
const[name,setName]=useState("");
const[regNo,setRegno]=useState("");
const[destination,setDestination]=useState("");
const[contact,setContact]=useState("");
const [error,setError]=useState("");
const[loading,setLoading]=useState(false);
const[modalVisible,setModalVisible]=useState(false);
const[modalText,setModalText]=useState("");
useEffect(()=>{
    navigation.setOptions({ headerRight:()=>( 
        <TouchableOpacity onPress={()=>navigation.goBack()}  >        
    <Ionicons style={{marginRight:10,marginTop:5}}name="arrow-back" size={28} color="black" />
    </TouchableOpacity>) });
},[]);

const handleSubmit=()=>{
  setLoading(true);
  console.log(LOCAL_HOST);
  fetch(`http://${LOCAL_HOST}:5000/driver/addGuest`, {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({name:name,regNo:regNo,contact:contact,destination:destination,institute:data.institute})
})
.then(response => response.json())  
.catch(error=> console.error("Error: ",error))
.then(response=>{
    if(response.message){
      setLoading(false);
      setError(response.message);
    }
    else if(response.Success){
      setError(null);
      setName("");
      setRegno("");
      setContact("");
      setDestination("");
      setLoading(false);
      setModalText(response.Success);
      setModalVisible(true);
    }
    
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
      <View style={styles.form}>
        <View style={styles.inputFields}>
        <Ionicons name="person" size={24} color="black" />
          <TextInput
          style={styles.TextInput}
          placeholder="Name"
          placeholderTextColor="#293038" 
          value={name}
          onChangeText={(text)=>{setName(text)
            setError(null)}}
        />
        </View>
        <View style={styles.inputFields}>
        <AntDesign name="idcard" size={24} color="black" />         
         <TextInput
          style={styles.TextInput}
          placeholder="Registration Number"
          placeholderTextColor="#293038" 
          value={regNo}
          onChangeText={(text)=>{setRegno(text)
          setError(null)}}
        />
        </View>
        <View style={styles.inputFields}>
        <Feather name="phone" size={24} color="black" />         
         <TextInput
          style={styles.TextInput}
          placeholder="Contact"
          placeholderTextColor="#293038" 
          value={contact}
          onChangeText={(text)=>{setContact(text)
          setError(null)}}
        />
        </View>
        <View style={styles.inputFields}>
        <Feather name="map-pin" size={24} color="black" />
       
         <TextInput
          style={styles.TextInput}
          placeholder="Destination"
          placeholderTextColor="#293038" 
          value={destination}
          onChangeText={(text)=>{setDestination(text)
          setError(null)}}
        />
        </View>
      <TouchableOpacity type="submit" style={styles.SButton}>
      {loading?<View><ActivityIndicator  size="small" color="#FfC329"/></View>:<Text style={styles.ButtonText} onPress={handleSubmit}>Add Guest</Text>}
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
      backgroundColor: "white",
      alignItems: "center",
      paddingTop:"10%"
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
      form:{
        marginTop:"20%",
        justifyContent:"center",
        backgroundColor: "#FfC329",
        paddingBottom:20,
      borderRadius:10,
      elevation: 20,
      opacity:0.9
      },
      inputFields:{
        borderBottomColor:"#293038",
        borderRadius:10,
        borderBottomWidth:1,
        height: 40,
        width:300,
        margin: 12,
        paddingLeft:10,
         flexDirection: 'row',
        alignItems: 'center',
      },
      TextInput:{
        marginLeft:10,
        width:300
      },
      SButton:{
        alignItems: "center",
        marginTop:30,
        backgroundColor:"#293038",
        width:100,
        height:30,
        borderRadius:6,
        paddingTop:"1.5%",
        alignSelf:"center"
      
      },
      ButtonText:{
        color: "#FfC329",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
      },
      fPass:{
        color:"#293038",
        textAlign:'right',
        fontSize:13,
        fontWeight:"bold",
        marginRight:13    
      },
    
  });