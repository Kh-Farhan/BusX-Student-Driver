import React, { useState, useEffect,useContext,} from "react";
import { StyleSheet, Text,Image, View,Button,TouchableOpacity,Switch,ActivityIndicator,Dimensions,FlatList,Modal} from 'react-native';
import{DriverContext} from "../ContextApi";
import MapView,{Marker,Polyline} from 'react-native-maps';
import * as Location from "expo-location";
import { FontAwesome5,Entypo,Ionicons,MaterialCommunityIcons,MaterialIcons ,AntDesign,FontAwesome ,Zocial  } from '@expo/vector-icons';
const {width, height} = Dimensions.get('window');
import {localhost as LOCAL_HOST} from "../localhost";
import { FadeInFlatList } from '@ja-ka/react-native-fade-in-flatlist';


export function Students({ navigation,route }) {
const data=useContext(DriverContext);
const [driver,setDriver]=useState(data.driver);
const [bus,setBus]=useState(data.bus);
const [details,setDetails]=useState();
const [stops,setStops]=useState();
const[modalVisible,setModalVisible]=useState(false);
const[modalText,setModalText]=useState("");
useEffect(()=>{
    navigation.setOptions({ headerRight:()=>( 
        <TouchableOpacity onPress={()=>navigation.goBack()}  >        
    <Ionicons style={{marginRight:10,marginTop:5}}name="arrow-back" size={28} color="black" />
    </TouchableOpacity>) });
    fetch(`http://${LOCAL_HOST}:5000/driver/getStudentDet/${bus._id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())  
    .catch(error=> console.error("Error: ",error))
    .then(response=>{
      if(response.detail){
        setDetails(response.detail);
        let stops=response.detail.StopName;
        let updatedStops=[];
        stops.forEach(ele => {
         let el=ele.split(",");
         console.log(el[0])
         updatedStops=[...updatedStops,`${el[0]},${el[1]},${el[2]}`]
        });
        setStops(updatedStops);

      }
    });
},[]);

const view=(<View>
  <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View>
          <View style={styles.modalView}>
          <FadeInFlatList
          initialDelay={0}
          durationPerItem={500} 
              keyExtractor={(item, index) => `${item} ${index}`}
              data={details?details.feeDefaultersName:"wait"}
              renderItem={({ item,index }) => (
                <View style={styles.listContainer}>
              <Text style={styles.routT}>{data.length!==0?`${index+1}. ${item}`:"No Fee Defaulter!"}</Text>
              </View>
            )}
          />
          <TouchableOpacity  style={styles.SButton} onPress={()=>{
            setModalVisible(false);
           }}>
        <Text style={styles.ButtonText} >OK</Text>
        </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.cardContainer}>
        <TouchableOpacity activeOpacity={0.9}>
          <View style={styles.cards}>
          <Text style={styles.cardNames}>Total Students</Text>
         <Text style={styles.number}>{details?details.totalStudent:""}</Text>
          <Ionicons name="people" size={28} color="#FfC329" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.9}>
          <View style={styles.cards}>
          <Text style={styles.cardNames}>Student Onboard</Text>
          <Text style={styles.number}>{details?details.studentOnBoard:""}</Text>
          <Ionicons name="bus" size={28} color="#FfC329" />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.cardContainer}>
        <TouchableOpacity activeOpacity={0.9}>
          <View style={styles.cards}>
          <Text style={styles.cardNames}>Absent Students</Text>
          <Text style={styles.number}>{details?details.absentStudents:""}</Text>
          <MaterialCommunityIcons name="account-cancel" size={30} color="#FfC329" />
          
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{
          if(details){
            if(details.feeDefaulters===0){
              setModalVisible(false);
            }
            else{
              setModalVisible(true);
            }
          }
          
        }}activeOpacity={0.9}>
          <View style={styles.cards}>
          <Text style={styles.cardNames}>Fee Defaulters</Text>
          <Text style={styles.number}>{details?details.feeDefaulters:""}</Text>
          <MaterialCommunityIcons name="bus-alert" size={28} color="#FfC329" />
          </View>
        </TouchableOpacity>
      </View>
      <Text style={styles.heading}>Students/Stop</Text>
      <View style={[styles.cardContainer,{marginTop:10}]}>
          <View style={styles.cardList}>
          {<FadeInFlatList
            initialDelay={0}
            durationPerItem={500} 
            keyExtractor={(item, index) => `${item} ${index}`}
            data={details?details.studentPstop:"wait"}
            renderItem={({ item,index }) => (
              <View style={styles.listContainer}>
            <TouchableOpacity style={{flexDirection:"row"}}>
            <Text style={styles.count}>{item}</Text>
            <Text style={styles.stops}>{stops[index]}</Text>
            </TouchableOpacity>
            </View>
          )}
          />}
          </View>
      </View>
    </View>)
    return (
        <View style={styles.container}>
            {details&&stops?view:<View style={styles.ActivityIndicator}><ActivityIndicator  size="large" color="black"/></View>}
            </View>
      
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:"white"
    }, 
    ButtonText:{
      color: "#FfC329",
      fontWeight: "bold",
      alignSelf: "center",
      textTransform: "uppercase"
    },
    Button:{
    position:'absolute', 
    marginTop: 10, 
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
    cardContainer: {
      flexDirection:"row",
      justifyContent:"space-between",
      paddingHorizontal:20,
      marginTop:20,
    },
    routT:{
      textAlign: 'center',
      color:"white",
      fontWeight:"bold",
      marginVertical:10,
    },
    stops:{
     
      color:"#696E74",
      fontWeight:"bold",
      width:"70%"
    },
    count:{
     
      color:"black",
      fontWeight:"bold",
      fontSize:22,
      width:"19%"
    },
    cards:{
      borderWidth:1.5,
      backgroundColor:"white",
      borderColor:"#f7e2ab",
      padding:10,
      paddingLeft:20,
      width:150,
      height:130,
      borderRadius:20,
      elevation:6,
      shadowColor: "#f5c13b",
      shadowOffset: {
        width: 0,
        height: 7,
      },
      shadowOpacity: 0.43,
      shadowRadius: 9.51,
      elevation: 15,
    },
    modalView: {
      width:"90%",
      alignSelf:"center",
      marginTop: "100%",
      backgroundColor: "#293038",
        borderColor:"#FfC329",
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
    cardList:{
      borderWidth:1.5,
      backgroundColor:"white",
      borderColor:"#f7e2ab",
      padding:10,
      width:320,
      height:315,
      borderRadius:20,
      elevation:6,
      justifyContent:"center",
      shadowColor: "#f5c13b",
      shadowOffset: {
        width: 0,
        height: 7,
      },
      shadowOpacity: 0.43,
      shadowRadius: 9.51,
      elevation: 15,
    },
    text:{
      textAlign: 'center',
      color:"black",
      fontSize:30
    },
    number:{
      fontSize:27,
      fontWeight:"bold",
      color:"#293038",
    },
    heading:{
      marginLeft:30,
      marginTop:15,
      fontSize:18,
      fontWeight:"bold",
      color:"#696E74"
      
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
      listContainer:{
        alignItems: "center",
      borderBottomWidth:1,
      borderBottomColor:"#FfC329",
      padding:"2%",
      marginVertical:"1%",
      marginHorizontal:"1%",
      width:"98%",
      },
      
      cardNames:{

        color:"#696E74",
        fontSize:14,
        marginTop:10
    },
  });