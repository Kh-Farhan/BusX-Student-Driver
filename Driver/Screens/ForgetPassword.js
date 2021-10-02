import React, { useState, useEffect ,useContext} from "react";
import { StyleSheet, Text, View,Button,FlatList ,ActivityIndicator,Form,TextInput,TouchableOpacity,Image,Modal} from 'react-native';
import { MaterialIcons,MaterialCommunityIcons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer,DrawerActions,NavigationActions } from '@react-navigation/native';
import{StudentContext} from "../ContextApi";
import {localhost as LOCAL_HOST} from "../localhost";const Stack = createStackNavigator();
//Navigator COmponent
export function ForgetPassword({ navigation,route }) {
const Sdata=useContext(StudentContext);
const[data,setData]=useState(Sdata);
const [subject,setSubject]=useState("");
const [desc,setDesc]=useState("");
const [modalVisible, setModalVisible] = useState(false);
const [modalText, setModalText] = useState();


    return (
      <Stack.Navigator  
      screenOptions={{ 
        headerTitleAlign:"center",
       }}
      initialRouteName="Enter Email">
        <Stack.Screen  options={{   
      headerStyle: {
        backgroundColor: '#FfC329',elevation:0
      }
      }} name="Enter Email" component={EmailScreen} />
      </Stack.Navigator>
    );
    
  }

//First Screen
  const EmailScreen=()=>{
    const [email,setEmail]=useState("");
    const[message,setMessage]=useState("");

    //handler
    const handlePress=()=>{
      fetch(`http://${LOCAL_HOST}:5000/student/sendEmail`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body:JSON.stringify({email:email})
      })
      .then(response => response.json())  
      .catch(error=> console.error("ErrorHere: ",error))
      .then(response=>{
          if(response.message){
              setMessage(response.message);
          }
          if(response.error){
             consol.log(response.error);
          }
      });
    }
        


    return(
        <View  style={styles.container}>
        <View style={styles.form}>
        
        <View style={[styles.inputFields]}>         
         <TextInput
          style={[styles.TextInput,{textAlignVertical: 'top',marginTop:10}]}
          placeholder="Enter email for verifictaion"
          placeholderTextColor="#293038" 
          value={email}
          onChangeText={(text)=>{setEmail(text)
          }}
        />
        </View>
        <TouchableOpacity type="submit" style={styles.SButton}>
      <Text style={styles.ButtonText} onPress={handlePress}>Send Verification Code</Text>
      </TouchableOpacity>
        </View>
        
      
      </View>
    )
    
    };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      paddingTop:"30%"
    }, 
    text:{
      textAlign: 'center',
      color:"black",
      fontSize:30
    },
    form:{
      marginTop:"10%",
      justifyContent:"center",
      backgroundColor: "#FfC329",
      paddingBottom:20,
    borderRadius:10,
    elevation: 20,
    opacity:0.9
    },
    Heading:{
      textAlign: 'center',
      fontWeight:"bold",
      color:"#293038",
      fontSize:24,
      fontFamily: 'Roboto'
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
    SButton:{
      alignItems: "center",
      alignSelf:"center",
      marginTop:10,
      backgroundColor:"#293038",
      width:200,
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
    inputFields:{
      borderColor:"#293038",
      borderRadius:10,
      borderWidth:1,
      height: 40,
      width:300,
      margin: 12,
      paddingLeft:10,
      flexDirection: 'row',
      justifyContent:"center",
      
    },
    TextInput:{
      marginLeft:10,
      width:300,
      
    },
    
  });