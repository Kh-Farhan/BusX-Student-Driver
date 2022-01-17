import React, { useState, useEffect ,componentWillMount} from "react";
import { StyleSheet, Text,Image, View,Button,FlatList ,ActivityIndicator} from 'react-native';
export function SplashScreen({ navigation }) {

  useEffect(()=>{
    const interval=setInterval(()=>{
      clearInterval(interval);
      navigation.navigate("Login");
    },1000);
    
  },[]);
  
 

    return (
      <View style={styles.container}>
        <View style={styles.container1}>
              <Image style={styles.image}source={require('../assets/LogoTransparent.png')}/>
        </View>
      </View>
    );
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FfC329",
      alignItems: "center",
      justifyContent: "center",
    }, 
    container1: {
      backgroundColor: "white",
      height:1000,
      alignItems: "center",
      justifyContent: "center",
      transform: [{ rotate: "45deg" }],    
      paddingHorizontal:"20%"
      
    },

    text:{
      textAlign: 'center',
      color:"white",
      fontSize:30
    },
    image: {
      width: 200,
      height: 200,
      transform: [{ rotate: "-45deg" }]

    }
    
  });