import React, { useState, useEffect,useContext,} from "react";
import { StyleSheet, Text,Image, View,Button,TouchableOpacity,Switch,ActivityIndicator,Dimensions,Modal} from 'react-native';
import{StudentContext} from "../ContextApi";
import MapView,{Marker,Polyline} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from "expo-location";
import { Ionicons } from '@expo/vector-icons';
import {localhost as LOCAL_HOST} from "../localhost";

const {width, height} = Dimensions.get('window');


export function Stops({ navigation}) {
const Sdata=useContext(StudentContext);
const[data,setData]=useState(Sdata);
const[stops,setStops]=useState();
const[initial,setInitial]=useState();
const[marker,setMarker]=useState({latitude:33.71398971857024, longitude:73.08249838549538})
const {width, height} = Dimensions.get('window')
const SCREEN_HEIGHT = height
const SCREEN_WIDTH = width
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.1922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const [modalVisible, setModalVisible] = useState(false);
const [modalText, setModalText] = useState();
const [coordinates,setCoordinates]=useState([]);
const [route,setRoute]=useState(null);
const [university,setUniversity]=useState({latitude:33.6481673859539,longitude: 73.15791260744702})
useEffect(()=>{
    navigation.setOptions({ headerRight:()=>( 
        <TouchableOpacity onPress={()=>navigation.goBack()}  >        
    <Ionicons style={{marginRight:10,marginTop:5}}name="arrow-back" size={28} color="black" />
    </TouchableOpacity>) });
   
    fetch(`http://${LOCAL_HOST}:5000/student/getData/?user=${Sdata._id}&institute=${Sdata.institute}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())  
  .catch(error=> console.error("Error: ",error))
  .then(response=>{
      if(response.data){
        
        fetch(`http://${LOCAL_HOST}:5000/student/get1Route/${response.data.route.routeId}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then(response => response.json())  
        .catch(error=> console.error("Error: ",error))
        .then(response=>{
            if(response.route){
              
              setRoute(response.route);
              setInitial({latitude:response.route.stops[0].lat , longitude:response.route.stops[0].lng,latitudeDelta:LATITUDE_DELTA,longitudeDelta:LONGITUDE_DELTA});
              let coord=[];
              response.route.stops.forEach((element,index) => {
                coord=[...coord,{latitude:element.lat,longitude:element.lng}];
              });
              coord=[university,...coord];
              setCoordinates(coord);
            }
            
        });
      }
      
  });
    
},[]);

const addStop=()=>{
    if(stops!==undefined){
        fetch(`http://${LOCAL_HOST}:5000/student/setStop`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body:JSON.stringify({id:data._id,coordinates:stops})
          })
          .then(response => response.json())  
          .catch(error=> console.error("ErrorHere: ",error))
          .then(response=>{
              if(response.message){
                  console.log(response.message)
                setModalText(response.message);
                setModalVisible(true);
              }
              if(response.Success){
                console.log(response.Success)
                setModalText(response.Success);
                setModalVisible(true);
              }
          });
    }
    else{
        setModalText("Stop Not Selected!!!");
        setModalVisible(true);
    }
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

    <MapView style={styles.map}
    initialRegion={initial}
    >
    {coordinates.map((item,index)=>(
        <Marker
        key={index}
        coordinate={{ latitude: item.latitude, longitude: item.longitude }}
        onPress={e=>setStops(e.nativeEvent.coordinate)}
        title="Set This as my Stop"
        pinColor="pink"
        />
    ))}
    <MapViewDirections
      origin={coordinates[0]}
      destination={coordinates[coordinates.length-1]}
      apikey={'AIzaSyAJqGtli38VmOucpZPA1teyivLeYmojhMQ'}
      strokeColor="#FfC329" 
      strokeWidth={7}
      optimizeWaypoints={true}
      waypoints={coordinates}
    />
    
    
    </MapView>
    <View style={styles.Button}>
    <Button title="Set Stop " onPress={addStop}></Button>
    </View>
    </View>)
    return (
        <View style={styles.container}>
            {initial!==undefined&&marker!==undefined?view:<View style={styles.ActivityIndicator}><ActivityIndicator  size="large" color="black"/></View>}
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
    
  });