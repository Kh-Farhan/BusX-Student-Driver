import React, { useState, useEffect,useContext} from "react";
import { StyleSheet, Text,Image, View,Button,FlatList,TouchableOpacity,Modal,Pressable,ActivityIndicator} from 'react-native';
import{StudentContext} from "../ContextApi";
import { AntDesign ,Ionicons ,MaterialCommunityIcons,MaterialIcons} from '@expo/vector-icons';
import {localhost as LOCAL_HOST} from "../localhost";
import Detail from "react-native-modal";
import { Dimensions } from 'react-native';
import * as Location from 'expo-location';

import * as Permissions from 'expo-permissions';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export function SelRoute({ navigation,route }) {
    const[loading,setLoading]=useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalText, setModalText] = useState();
    const data=useContext(StudentContext);
    const [student,setStudent]=useState(data);
    const [ustudent,setuStudent]=useState(data);

const selAutomatically=async()=>{
    //if(!loading){
        setLoading(true);
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log('Permission to access location was denied');
            return;
        }
        const prevLocation=Location.watchPositionAsync({accuracy: Location.Accuracy.Balanced, timeInterval: 300, distanceInterval: 0 },(location)=>{
            console.log(location.coords.latitude+","+location.coords.longitude);
            const loc={lat:location.coords.latitude,lon:location.coords.longitude,student:data._id};
            handleCancel(prevLocation);
            fetch(`http://${LOCAL_HOST}:5000/student/selroute/`, {
                method: 'POST',
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
                },
                body:JSON.stringify(loc)
            })
            .then(response => response.json())  
            .catch(error=> console.error("Error: ",error))
            .then(response=>{
                if(response.Success){
                  console.log(response.data.route.routeId)
                    setuStudent(response.data.route)
                    setLoading(false);
                    setModalText(response.Success);
                    setModalVisible(true);

                }
            });

        })
   // }

};
const handleCancel=(prevLocation)=>{
    console.log(prevLocation);
    prevLocation._W.remove();
   
    
  };

    return (
      <View style={styles.container}>
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
            navigation.navigate("Dashboard",{rout:ustudent})}}>
        <Text style={styles.ButtonText} >OK</Text>
        </TouchableOpacity>
          </View>
        </View>
      </Modal>
        <Text style={styles.hello}>Hello !</Text>
        <View
        style={{
            borderBottomColor: 'white',
            borderBottomWidth: 1,
            marginHorizontal:"10%",
            marginTop:10
        }}
        />
        <Text style={styles.H_2}>Set Route</Text>
        <View style={styles.cardContainer}>
            <TouchableOpacity activeOpacity={0.9} onPress={selAutomatically} >
                <View style={styles.cards}>
                    {loading?
                    <View><ActivityIndicator  size="large" color="#FfC329"/></View>
                    :
                    <View>
                        <MaterialIcons style={{alignSelf:"center"}}  name="my-location" size={38} color="#293038" />
                        <Text style={styles.cardNames}>Set Automatically</Text>
                    </View>}
                </View>
            </TouchableOpacity>
            
            <TouchableOpacity activeOpacity={0.9} onPress={()=>{

                    navigation.navigate("Route"); 
                
            }}>
                <View style={styles.cards}>
                <Ionicons  style={styles.icons} name="list" size={38} color="#293038" />
                <Text style={styles.cardNames}>Set Manually</Text>
                </View>
            </TouchableOpacity>
        </View>
      </View>
    );
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:"#FfC329"
    }, 
    text:{
      textAlign: 'center',
      color:"black",
      fontSize:30
    },
    routeContainer:{
        flexDirection:"row",
        alignItems: "center",
        backgroundColor:"white",
        justifyContent:"space-between",
      borderBottomWidth:1,
      borderBottomColor:"#FfC329",
      padding:"4%",
      marginVertical:"1%",
      marginHorizontal:"1%",
      width:"98%",
      borderRadius:10,
    },
    cardContainer: {
        flexDirection:"column",
        justifyContent:"space-between",
        padding:"2.5%",
        paddingHorizontal:"11%",
        marginBottom:"14%",
        marginTop:"1%",
        alignItems:"center",  
      },
      cards:{
          margin:"10%",
        borderWidth:1,
        backgroundColor:"white",
        borderColor:"#FfC329",
        padding:"3%",
        width:windowWidth/1.5,
        height:150,
        borderRadius:20,
        elevation:6,
        justifyContent:"center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 7,
        },
        shadowOpacity: 0.43,
        shadowRadius: 9.51,
        elevation: 15,
      },
      cardNames:{
        textAlign: 'center',
        color:"#293038",
        fontSize:16,
        marginTop:10
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
      details:{
        width:"95%",
        alignSelf:"center",
        borderRadius: 10,
        borderWidth:1,
        backgroundColor: "#293038",
        borderColor:"#FfC329",
        padding: 35,
        alignItems: "center",
     },
      modalText:{
        textAlign: 'center',
      color:"#293038",
      fontSize:20
      },
      hello:{
        textAlign: 'center',
        color:"white",
        marginTop:"20%",
        fontSize:50,
      },
      H_2:{
        textAlign: 'center',
        color:"white",
        marginTop:"2%",
        fontSize:30,
      },
    routT:{
        color:"#293038",
        fontSize:16,
        fontWeight:"bold"
    },
    current:{
      textAlign: 'center',
      backgroundColor:"#293038",
      borderTopLeftRadius:20,
      borderTopRightRadius:20,
      color:"white",
      marginTop:3,
      fontSize:20
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
      SDButton:{
        alignItems: "center",
        marginTop:10,
        backgroundColor:"#293038",
        width:100,
        height:30,
        borderWidth:1,
        borderColor:"#FfC329",
        borderRadius:6,
        paddingTop:"1.5%",
        elevation:5
      },
      ButtonText:{
        color: "#FfC329",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
      },
      list:{
          height:"93%",
          borderBottomLeftRadius:30,

      }
    
  });