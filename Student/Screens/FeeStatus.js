import React, { useState, useEffect,useContext,} from "react";
import { StyleSheet, Text,Image, View,Button,TouchableOpacity,Switch,ActivityIndicator} from 'react-native';
import{StudentContext} from "../ContextApi";
import { Ionicons } from '@expo/vector-icons';
export function FeeStatus({ navigation,route }) {
const Sdata=useContext(StudentContext);
const[data,setData]=useState(Sdata);
const[status,setStatus]=useState(Sdata.feeStatus);

useEffect(()=>{
    navigation.setOptions({ headerRight:()=>( 
        <TouchableOpacity onPress={()=>navigation.goBack()}  >        
    <Ionicons style={{marginRight:10,marginTop:5}}name="arrow-back" size={28} color="black" />
    </TouchableOpacity>) });});
    
const view=(<View>
<Image style={styles.image} source={require('../assets/LogoTransparent.png')}/>
 <Text style={{
textAlign: 'center',
color:status!=="payed"?"#FfC329":"#293038",
fontSize:30
}}>{status==="payed"?"Fee Payed!":"Fee Not Payed:("}</Text>
</View>
);
    return (
        <View style={[styles.container,{backgroundColor:status==="payed" ? "#90ee90":status==="notPayed" ?"#c55656":"white"}]}>
            {status!==undefined?view:<View style={styles.ActivityIndicator}><ActivityIndicator  size="large" color="black"/></View>}
            </View>
      
    );
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
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