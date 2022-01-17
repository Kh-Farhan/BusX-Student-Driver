import React, { useState, useEffect,useContext } from "react";
import { StyleSheet, Text, View,Button,FlatList ,ActivityIndicator,Form,TextInput,TouchableOpacity,Image,Modal} from 'react-native';
import { MaterialIcons,MaterialCommunityIcons } from '@expo/vector-icons';
import {localhost as LOCAL_HOST} from "../localhost";

import {DriverContext} from '../ContextApi';

export default function changePassword({ navigation }) {
const [oldPass,setOldPass]=useState("");
const [password,setPassword]=useState("");
const [repassword,setrePassword]=useState("");
const[error,setError]=useState(null);
const[loading,setLoading]=useState(false);
const data=useContext(DriverContext);
const [driver,setDriver]=useState(data.driver);
const [bus,setBus]=useState(data.bus);
const [modalVisible, setModalVisible] = useState(false);
const [modalText, setModalText] = useState();

  const handleSubmit=()=>{
    setLoading(true);
    console.log(LOCAL_HOST);
    fetch(`http://${LOCAL_HOST}:5000/driver/changePass`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
      
    },
    body: JSON.stringify({id:driver._id,oldPass:oldPass,password:password,repassword:repassword})
  })
  .then(response => response.json())  
  .catch(error=> console.error("Error: ",error))
  .then(response=>{
      if(response.message){
        setLoading(false);
        setError(response.message);
      }
      if(response.Success){
        setModalText(response.Success);
        setModalVisible(true);
        setOldPass("");
        setPassword("");
        setrePassword("");
        setLoading(false);
      }
      
  })
  };
    return (
      <View style={styles.container}>
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
            navigation.navigate("Account Setting")
            }}>
        <Text style={styles.ButtonText} >OK</Text>
        </TouchableOpacity>
          </View>
        </View>
      </Modal>
        <View style={styles.form}>
        <View style={styles.inputFields}>
        <MaterialCommunityIcons name="key" size={24} color="black" /> 
          <TextInput
          style={styles.TextInput}
          placeholder="Old Password"
          placeholderTextColor="#293038" 
          value={oldPass}
          onChangeText={(text)=>{setOldPass(text)
            setError(null)}}
        />
        </View>
        <View style={styles.inputFields}>
        <MaterialCommunityIcons name="key" size={24} color="black" />         
         <TextInput
          style={styles.TextInput}
          secureTextEntry
          placeholder="New Password"
          placeholderTextColor="#293038" 
          value={password}
          onChangeText={(text)=>{setPassword(text)
          setError(null)}}
        />
        </View>
        <View style={styles.inputFields}>
        <MaterialCommunityIcons name="key" size={24} color="black" />  
        <TextInput
          style={styles.TextInput}
          secureTextEntry
          placeholder="Re Write New Password"
          placeholderTextColor="#293038" 
          value={repassword}
          onChangeText={(text)=>{setrePassword(text)
          setError(null)}}
        />
        </View>
        {error==null?null:<Text style={styles.error} >{error}</Text>}
      <TouchableOpacity type="submit" style={styles.SButton}>
      {loading?<View><ActivityIndicator  size="small" color="#FfC329"/></View>:<Text style={styles.ButtonText} onPress={handleSubmit}>Change Password</Text>}
      </TouchableOpacity>
      </View>
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
    Heading:{
      textAlign: 'center',
      fontWeight:"bold",
      color:"#293038",
      fontSize:20,
      fontFamily: 'Roboto'
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
      width:200,
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
    modalView: {
        width:"95%",
        alignSelf:"center",
        marginTop: "80%",
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
    image: {
      marginTop:"20%",
      width: 200,
      height: 200,
      shadowColor: "yellow",
    shadowOffset: { height: 2},
    shadowOpacity: 0.3,
    },
    fPass:{
      color:"#293038",
      textAlign:'right',
      fontSize:13,
      fontWeight:"bold",
      marginRight:13    
    },
    error:{
      color:"red",
      textAlign:'left',
      fontSize:12,
      fontWeight:"bold",
      marginLeft:20    
    }
    
  });