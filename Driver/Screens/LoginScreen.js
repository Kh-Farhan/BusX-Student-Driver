import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View,Button,FlatList ,ActivityIndicator,Form,TextInput,TouchableOpacity,Image} from 'react-native';
import { MaterialIcons,MaterialCommunityIcons,AntDesign  } from '@expo/vector-icons';
import {localhost as LOCAL_HOST} from "../localhost";
export function LoginScreen({ navigation }) {
const [cnic,setCnic]=useState("");
const [password,setPassword]=useState("");
const [data,setData]=useState({});
const[error,setError]=useState(null);
const[loading,setLoading]=useState(false);



  const handleSubmit=()=>{
    setLoading(true);
    console.log(LOCAL_HOST);
    fetch(`http://${LOCAL_HOST}:5000/driver/login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({cnic:cnic,password:password})
  })
  .then(response => response.json())  
  .catch(error=> console.error("Error: ",error))
  .then(response=>{
    if(response.error){
      setError(null);
        setCnic("");
        setPassword("");
        setLoading(false);
      navigation.navigate("notAllowed");
    }
      if(response.message){
        setLoading(false);
        setError(response.message);
      }
      else if(response.token){
        setError(null);
        setCnic("");
        setPassword("");
        setLoading(false);
        const obj={
          driver:response.result,
          bus:response.Bus
        }
        navigation.navigate("AppNav",{data:obj});
      }
      
  })
  };
    return (
      <View style={styles.container}>
        <Image style={styles.image} source={require('../assets/LogoTransparent.png')}/>
        <Text style={styles.Heading}>DRIVER</Text>
        <View style={styles.form}>
        <View style={styles.inputFields}>
        <AntDesign name="idcard" size={24} color="black" />
          <TextInput
          style={styles.TextInput}
          placeholder="CNIC"
          placeholderTextColor="#293038" 
          value={cnic}
          onChangeText={(text)=>{setCnic(text)
            setError(null)}}
        />
        </View>
        <View style={styles.inputFields}>
        <MaterialCommunityIcons name="key" size={24} color="black" />         
         <TextInput
          style={styles.TextInput}
          secureTextEntry
          placeholder="PASSWORD"
          placeholderTextColor="#293038"
          value={password}
          onChangeText={(text)=>{setPassword(text)
          setError(null)}}
        />
        </View>
        {error==null?null:<Text style={styles.error} >{error}</Text>}
        
      <TouchableOpacity type="submit" style={styles.SButton}>
      {loading?<View><ActivityIndicator  size="small" color="#FfC329"/></View>:<Text style={styles.ButtonText} onPress={handleSubmit}>Sign In</Text>}
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