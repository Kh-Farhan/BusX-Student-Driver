import React, { useState, useEffect,useContext } from 'react';

import{DriverContext} from "../ContextApi";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  Text,
  Linking,TouchableOpacity
} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
const Buffer = require('buffer/').Buffer
export const CustomDrawer = (props) => {
  const data=useContext(DriverContext);
    const [driver,setDriver]=useState(data.driver);
    const [bus,setBus]=useState(data.bus);
const[name,setName]=useState(driver.firstName+" "+driver.lastName);

  return (
    <SafeAreaView style={{flex: 1,backgroundColor:"white"}}>
      <View style={{backgroundColor:"#FfC329",paddingTop:40,paddingBottom:40,borderBottomRightRadius:30,borderBottomWidth:1,borderRightWidth:1}}>
      <TouchableOpacity style={{marginHorizontal:90,borderRadius:50}}>
      <Image
        source={{uri:`data:${driver.photoType};charset=utf8;base64,${Buffer.from(driver.photo).toString('ascii')}`}}
        style={styles.image}
      />
      </TouchableOpacity>
      <Text style={styles.head}>{name.toUpperCase()}</Text>
      </View>
       
      <DrawerContentScrollView {...props} style={{marginTop:-20}}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <TouchableOpacity onPress={props.signOut}>
      <View style={styles.logout}>
      <Entypo name="log-out" size={21} color="black" />
      <Text
        style={{
          fontSize: 15,
          textAlign: 'center',
          color: '#293038',marginLeft:5
        }}>
        SIGN OUT
      </Text>
      </View>
      </TouchableOpacity>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  iconStyle: {
    width: 15,
    height: 15,
    marginHorizontal: 5,
  },
  customItem: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image:{
    resizeMode: 'contain',
    width: 100,
    height: 100,
    borderRadius: 120,
    alignSelf: 'center',
  },
  logout:{
      flexDirection:"row",
      alignItems:"center",
      marginBottom:30,
      marginLeft:20,
      fontWeight: "bold"
  },
  line:{
      borderBottomColor: 'black',
      borderBottomWidth: 1,
      borderBottomColor:"#696E74",
      width:"80%",
      alignSelf:"center",
      opacity:0.3
  },
  head:{
      fontSize: 20,
      textAlign: 'center',
      color: '#293038',
      marginTop:10,

    }
  
  
});