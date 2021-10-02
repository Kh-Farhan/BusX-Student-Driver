import React, { useState, useEffect,useContext,} from "react";
import { StyleSheet, Text,Image, View,Button,TouchableOpacity,Switch,ActivityIndicator} from 'react-native';
import{StudentContext} from "../ContextApi";
import { Ionicons } from '@expo/vector-icons';
import {localhost as LOCAL_HOST} from "../localhost";
export function Attendence({ navigation,route }) {
const Sdata=useContext(StudentContext);
const[data,setData]=useState(Sdata);
const[attendence,setAttendence]=useState();
const[isEnabled,setisEnabled]=useState(true);
useEffect(()=>{
    navigation.setOptions({ headerRight:()=>( 
        <TouchableOpacity onPress={()=>navigation.goBack()}  >        
    <Ionicons style={{marginRight:10,marginTop:5}}name="arrow-back" size={28} color="black" />
    </TouchableOpacity>) });
        
        fetch(`http://${LOCAL_HOST}:5000/student/setAttendence`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body:JSON.stringify({id:data._id,attendence:attendence})
          })
          .then(response => response.json())  
          .catch(error=> console.error("ErrorHere: ",error))
          .then(response=>{
              if(response.message){
                  console.log("afa");
              }
              if(response.attendence){
                  setAttendence(response.attendence);
              }
          });
},[isEnabled]);


const toggleSwitch = () => {setAttendence(attendence==="present"?"absent":"present");
setisEnabled(previousState=>!previousState)
};
const view=(<View>
<Image style={styles.image} source={require('../assets/LogoTransparent.png')}/>
 <Text style={{
textAlign: 'center',
color:attendence!=="present"?"#FfC329":"#293038",
fontSize:30
}}>{attendence==="present"?"ON BOARD!!!":"NOT GOING :("}</Text>
 <Switch
  style={{transform: [{ scaleX: 1.4 }, { scaleY: 1.3 }],alignSelf:"center" }}
  thumbColor={attendence==="present" ? "#f5dd4b" : "#293038"}
  ios_backgroundColor="#3e3e3e"
  onValueChange={toggleSwitch}
  value={isEnabled}
/></View>
);
    return (
        <View style={[styles.container,{backgroundColor:attendence==="present" ? "#90ee90":attendence==="absent" ?"#c55656":"#FfC329"}]}>
            {attendence!==undefined?view:<View style={styles.ActivityIndicator}><ActivityIndicator  size="large" color="black"/></View>}
            </View>
      
    );
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      backgroundColor:"#FfC329"
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
      }
    
  });