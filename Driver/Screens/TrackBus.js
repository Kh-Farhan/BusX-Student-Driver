import React, { useState, useEffect,useContext,useRef} from "react";
import { StyleSheet, Text,Image, View,Button,TouchableOpacity,Switch,ActivityIndicator,Dimensions,Modal} from 'react-native';
import{DriverContext} from "../ContextApi";
import * as Location from 'expo-location'
import MapViewDirections from 'react-native-maps-directions';
import MapViewNavigation,{ NavigationModes, TravelModeBox, TravelIcons, Geocoder, TravelModes, DirectionsListView, ManeuverView, DurationDistanceView } from 'react-native-maps-navigation';
import MapView,{Marker,Polyline} from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
const {width, height} = Dimensions.get('window');
import getDirections from 'react-native-google-maps-directions';
import {localhost as LOCAL_HOST} from "../localhost";





export function TrackBus({ navigation }) {
const data=useContext(DriverContext);
const [driver,setDriver]=useState(data.driver);
const [bus,setBus]=useState(data.bus);
const[stops,setStops]=useState();
const[route,setRoute]=useState(null);
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
const [waypoints,setWaypoints]=useState([])
const mapRef =useRef(null);
const navRef=useRef(null);
useEffect(()=>{
  Location.requestBackgroundPermissionsAsync();
  Location.installWebGeolocationPolyfill()
    navigation.setOptions({ headerRight:()=>( 
        <TouchableOpacity onPress={()=>navigation.goBack()}  >        
    <Ionicons style={{marginRight:10,marginTop:5}}name="arrow-back" size={28} color="black" />
    </TouchableOpacity>) });
    setInitial({latitude:33.68914800157013 , longitude:73.11465232214398,latitudeDelta:LATITUDE_DELTA,longitudeDelta:LONGITUDE_DELTA});
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
      console.log("HERE Routes Recieved!");
      console.log(response.result);
      setRoute(response.result);
      setInitial({latitude:response.result.stops[0].lat , longitude:response.result.stops[0].lng,latitudeDelta:LATITUDE_DELTA,longitudeDelta:LONGITUDE_DELTA});
              let coord=[];
              let waypoint=[];
              response.result.stops.forEach((element,index) => {
                coord=[...coord,{latitude:element.lat,longitude:element.lng}];
                if(index!==0 && index!==response.result.stops.length-1){
                  waypoint=[...waypoint,{latitude:element.lat,longitude:element.lng}];
                }
              });
              if(waypoint===undefined){
                setWaypoints(null);
              }else{
                setWaypoints(waypoint);
              }
              
              setCoordinates(coord);
              
    }

  });

},[]);
useEffect(() => {
  if(coordinates.length!==0){
    openMaps();
    navigation.navigate("Dashboard");
  }

}, [coordinates]);
const openMaps=()=>{
  if(coordinates!==undefined && waypoints!==undefined ){
    console.log("waypoint: "+waypoints);
    const data = {
      destination:coordinates[coordinates.length-1],
     params: [
       {
         key: "travelmode",
         value: "driving"        // may be "walking", "bicycling" or "transit" as well
       }
     ],
     waypoints: waypoints
   }
   console.log(data);
   getDirections(data)
  }
}
const view=(<View>
  
  <View style={{alignItems:"center",justifyContent:"center"}}>
  <Text style={{marginTop:"30%",
      color:"#293038",
      fontSize:20}}>Redirecting...</Text>
  <Image  style={{marginTop:"10%"}} source={require('../assets/loader.gif')} /></View>
    </View>)
    return (
        <View style={styles.container}>
            {route!==null &&initial!=undefined &&coordinates!==undefined && coordinates.length===route.stops.length?view:<View style={{alignItems:"center",justifyContent:"center"}}><Text style={{marginTop:"30%",
      color:"#293038",
      fontSize:20}}>Setting Up Route ...</Text><Image style={{marginTop:"10%"}} source={require('../assets/loader.gif')} /></View>}
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