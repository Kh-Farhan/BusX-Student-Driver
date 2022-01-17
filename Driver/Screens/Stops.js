import React, { useState, useEffect,useContext,} from "react";
import { StyleSheet,FlatList, Text,Image, View,Button,TouchableOpacity,Switch,ActivityIndicator,Dimensions,Modal} from 'react-native';
import { FadeInFlatList } from '@ja-ka/react-native-fade-in-flatlist';
import{DriverContext} from "../ContextApi";
import MapView,{Marker,Polyline} from 'react-native-maps';
import * as Location from "expo-location";
import { Ionicons,Octicons  } from '@expo/vector-icons';
const {width, height} = Dimensions.get('window');
import {localhost as LOCAL_HOST} from "../localhost";
export function Stops({ navigation }) {
const data=useContext(DriverContext);
const [driver,setDriver]=useState(data.driver);
const [bus,setBus]=useState(data.bus);
const [stop,setStop]=useState(null);

useEffect(()=>{
    navigation.setOptions({ headerRight:()=>( 
        <TouchableOpacity onPress={()=>navigation.goBack()}  >        
    <Ionicons style={{marginRight:10,marginTop:5}}name="arrow-back" size={28} color="black" />
    </TouchableOpacity>) });
console.log(LOCAL_HOST);
fetch(`http://${LOCAL_HOST}:5000/driver/getRoute/${driver._id}`, {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
}) 

.then(response => response.json())  
.catch(error=> console.error("Error: ",error))
.then(response=>{
  if(response.result){
    setStop(response.result.addresses);
  }

});

},[]);

const view=(
      <View style={styles.list}>
    {<FadeInFlatList
          initialDelay={0}
          durationPerItem={500} 
          style={{backgroundColor:"white",borderBottomLeftRadius:30,borderBottomRightRadius:30}}
          keyExtractor={(item, index) => `${item} ${index}`}
          data={stop}
          renderItem={({ item,index }) => (
            <View style={styles.listContainer}>
            <Octicons name="primitive-dot" size={24} color="#FfC329" />
          <TouchableOpacity>
          <Text style={styles.routT}>{item}</Text>
          </TouchableOpacity>
          </View>
        )}
      />}
      </View>
    )
    return (
        <View style={styles.container}>
            {stop!==null?view:<View style={styles.ActivityIndicator}><ActivityIndicator  size="large" color="black"/></View>}
            </View>
      
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
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
      list:{
        height:"100%",
        borderBottomLeftRadius:30,
    },
    routT:{
      color:"#293038",
      fontWeight:"bold",
      marginLeft:10
  },
      listContainer:{
        flexDirection:"row",
        alignItems: "center",
        backgroundColor:"white",
      borderBottomWidth:1,
      borderBottomColor:"#FfC329",
      padding:"4%",
      marginVertical:"1%",
      marginHorizontal:"1%",
      width:"98%",
      borderRadius:10,
      }
    
  });