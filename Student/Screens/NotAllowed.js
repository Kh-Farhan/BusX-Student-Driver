import React, { useState, useEffect ,componentWillMount} from "react";
import { StyleSheet, Text,Image, View,Button,FlatList ,ActivityIndicator} from 'react-native';
export function NotAllowed({ navigation }) {


    
  
 

    return (
      <View style={styles.container}>
        <View style={styles.container1}>
              <Image style={styles.image}source={require('../assets/expired.gif')}/>
              <Text style={styles.Heading}>No access to BusX right row!</Text>
              <View style={{width:"40%",alignSelf:"center",marginTop:30}}>
              <Button title="Go Back " onPress={()=>{
                  navigation.navigate("Login");
              }}></Button>
              </View>
        </View>
      </View>
    );
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "rgb(0,175,204)",
      alignItems: "center",
      justifyContent: "center",
    }, 


    text:{
      textAlign: 'center',
      color:"white",
      fontSize:30
    },
    image: {
      width: 400,
      height: 400,

    },
    Heading:{
        textAlign: 'center',
        fontWeight:"bold",
        color:"white",
        fontSize:20,
        fontFamily: 'Roboto',
        marginTop:10
       },
    
    
  });