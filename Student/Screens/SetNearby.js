import React, { useState, useEffect,useContext,useRef,createRef} from "react";
import { StyleSheet, Text,Image, View,Button,TouchableOpacity,Switch,ActivityIndicator,Dimensions,Modal} from 'react-native';
import{StudentContext} from "../ContextApi";
import MapView,{Marker} from 'react-native-maps';
import * as Location from "expo-location";
import {localhost as LOCAL_HOST} from "../localhost";
import { Ionicons,Entypo,MaterialIcons   } from '@expo/vector-icons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
const {width, height} = Dimensions.get('window');
export function SetNearby({ navigation,route }) {
const Sdata=useContext(StudentContext);
const[data,setData]=useState(Sdata);
const[initial,setInitial]=useState();
const[marker,setMarker]=useState({latitude:33.72198782284096,longitude:73.08291045785127})
const {width, height} = Dimensions.get('window')
const SCREEN_HEIGHT = height
const SCREEN_WIDTH = width
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const [modalVisible, setModalVisible] = useState(false);
const [modalText, setModalText] = useState();
const mapView =useRef(null);
const searchRef =useRef(null);
const [locName,setlocName]=useState(" ");
const [theme,setTheme]=useState([]);

useEffect(()=>{
    navigation.setOptions({ headerRight:()=>( 
        <TouchableOpacity onPress={()=>navigation.goBack()}  >        
    <Ionicons style={{marginRight:10,marginTop:5}}name="arrow-back" size={28} color="black" />
    </TouchableOpacity>) });
    setInitial({latitude:marker.latitude, longitude:marker.longitude,latitudeDelta:LATITUDE_DELTA,longitudeDelta:LONGITUDE_DELTA});
    
},[]);
useEffect(()=>{
  if(mapView.current!==null){
  mapView.current.animateToRegion({ // Takes a region object as parameter
    longitude:marker.longitude,
    latitude: marker.latitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
},1000);
}
},[marker])
const clearIn=()=>{
  if(searchRef.current!==null){
    searchRef.current.setAddressText("")
  }
}
const SetNearby=()=>{
  console.log(marker);
    fetch(`http://${LOCAL_HOST}:5000/student/setNearby`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body:JSON.stringify({id:data._id,coordinates:marker,institute:Sdata.institute
            })
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
};
const changeTheme=()=>{
  if(theme.length===0){
    setTheme(mapStyle);
  }
  else{
    setTheme([]);
  }
};
const mapStyle=[
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#242f3e"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#746855"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#242f3e"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#263c3f"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#6b9a76"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#38414e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#212a37"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9ca5b3"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#746855"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#1f2835"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#f3d19c"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#2f3948"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#17263c"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#515c6d"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#17263c"
      }
    ]
  }
];
const view=(<View >
  <GooglePlacesAutocomplete
    ref={searchRef}
     placeholder='Search'
    renderRightButton={()=><TouchableOpacity onPress={clearIn} style={styles.clearButton}><MaterialIcons name="delete" size={34} color="#FfC329" /></TouchableOpacity>}
     onPress={(data, details = null) => {
      fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${data.place_id}&fields=geometry,name&key=AIzaSyAJqGtli38VmOucpZPA1teyivLeYmojhMQ`, {
        method: 'GET'
      })
      .then(response => response.json())  
      .catch(error=> console.error("ErrorHere: ",error))
      .then(response=>{
          setlocName(response.result.name);
          const coordinates=response.result.geometry.location;
          const mark={latitude:coordinates.lat,longitude:coordinates.lng};
          setMarker(mark);

      });
     }}
     query={{
       key:'AIzaSyAJqGtli38VmOucpZPA1teyivLeYmojhMQ',
       language: 'en',
       components: 'country:pk',
     }}
     styles={{
      container:{
        marginLeft:10,
        marginTop:1,
        width:"95%",
        zIndex: 2,
        position:"absolute",
       },
       textInputContainer: {
        flexDirection: 'row',
        top:10,
        
      },
      textInput: {
        backgroundColor: '#FFFFFF',
        height: 44,
        borderColor:"#FfC329",
        borderWidth:1,
        color:"#293038",
        elevation:5
      },
       listView:{
         marginTop:10,
         borderColor:"black",
        backgroundColor:"#FfC329",
        elevation:5
       },
       row:{
        borderBottomColor:"#FfC329",
        borderBottomWidth:1
       }
     }}
   />
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
    ref={mapView}
    customMapStyle={theme}
    moveOnMarkerPress
    initialRegion={initial}
    ><Marker
    tracksViewChanges={false}
    draggable
    coordinate={marker}
    title={locName}
    description="Notify Me when Bus is Here!!!"
    onDragEnd={e => {
      setMarker({latitude:e.nativeEvent.coordinate.latitude,longitude:e.nativeEvent.coordinate.longitude});
    }}
  />
  </MapView>
    <View style={styles.Button}>
    <Button title="Set Nearby " onPress={SetNearby}></Button>
  </View>
  <View style={[styles.theme,theme.length===0?{backgroundColor:"#FfC329",}:{backgroundColor:"black",}]} >
  {theme.length===0?<Ionicons style={{textShadowColor: '#FfC329', textShadowOffset: { width: 0.5, height: 0.5 }, textShadowRadius: 1,}} onPress={changeTheme} name="moon" size={34} color="black" />:<Ionicons style={{textShadowColor: '#000', textShadowOffset: { width: 0.5, height: 0.5 }, textShadowRadius: 1,}} onPress={changeTheme} name="sunny" size={34} color="#FfC329" />}
  {theme.length===0?<Text style={{color:"black",textShadowColor: '#FfC329', textShadowOffset: { width: 0.5, height: 0.5 }, textShadowRadius: 1,}}>Dark</Text>:<Text style={{color:"#FfC329",textShadowColor: '#000', textShadowOffset: { width: 0.5, height: 0.5 }, textShadowRadius: 1,}}>Light</Text>}
  
  </View>
   

    </View>)
    return (
        <View  style={styles.container}>
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
    theme:{
      position:'absolute', 
      marginTop: height-280, 
      alignSelf:'flex-end',
      marginRight:"5%",
      elevation:10,
      padding:5,
      borderRadius:10,
      alignItems:"center",
      justifyContent:"space-between"
      },
    search:{
      position:'absolute', 
      marginTop:70, 
      backgroundColor: '#fff',
      width: '70%',
      alignSelf:'center',
      borderRadius: 5,
      
      
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
        height: Dimensions.get('window').height-1,
        zIndex: 0
      },
    clearButton:{
      marginTop:4,
      marginLeft:5
    }
  });