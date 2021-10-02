import React, { useState, useEffect,useContext} from "react";
import { StyleSheet, Text,Image, View,Button,FlatList,TouchableOpacity,Modal,Pressable,ActivityIndicator} from 'react-native';
import{StudentContext} from "../ContextApi";
import { AntDesign } from '@expo/vector-icons';
import {localhost as LOCAL_HOST} from "../localhost";

import Detail from "react-native-modal";
export function Route({ navigation,route }) {
const Sdata=useContext(StudentContext);
const[data,setData]=useState();
const[currentRoute,setCurrentRoute]=useState(" ");
const[routes,setRoutes]=useState({});
const [modalVisible, setModalVisible] = useState(false);
const [modalText, setModalText] = useState();
const [detailVisible, setDetailVisible] = useState(false);
const [detailText, setDetailText] = useState([0,1]);
const [loader, setLoader] = useState(false);
useEffect(()=>{
    const getData=async ()=>{
        await fetch(`http://${LOCAL_HOST}:5000/student/getData/${Sdata._id}`, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            }
          })
          .then(response => response.json())  
          .catch(error=> console.error("Error: ",error))
          .then(response=>{
              if(response.message){
                  console.log(response.message);
              }
              if(response.data){
                if(response.data.route!==null){
               setData(response.data)
               setCurrentRoute(response.data.route.routeName);
                }else{
                  setData(response.data);
                  setCurrentRoute("Not Selected yet");
                }
              }
              
          });
    };
    getData();
     
    fetch(`http://${LOCAL_HOST}:5000/student/viewRoute`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())  
  .catch(error=> console.error("Error: ",error))
  .then(response=>{
      if(response.message){
      }
      if(response.routes){
        console.log(response.routes);
        setRoutes(response.routes);
      }
      
  });
},[])
const displayDetails=(addresses)=>{

  setDetailText(addresses);
  setDetailVisible(true);
};
const onChange=async(obj)=>{
  console.log(obj);
    setLoader(true);
    await fetch(`http://${LOCAL_HOST}:5000/student/changeRoute`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body:JSON.stringify(obj)
  })
  .then(response => response.json())  
  .catch(error=> console.error("Error: ",error))
  .then(response=>{
      if(response.Errormessage){
        setLoader(false);
        setModalText(response.Successmessage);
        setModalVisible(true);
    }
      if(response.Successmessage){
        setLoader(false);
        setModalText(response.Successmessage);
        setModalVisible(true);
        setCurrentRoute(obj.name);
      }
      
  })
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
      <Detail 
      isVisible={detailVisible}
      backdropOpacity={0}
      onBackdropPress={() => setDetailVisible(false)}
      onSwipeComplete={() => setDetailVisible(false)}
      swipeDirection={["left","right","up","down"]}
      >
      <View style={styles.details}>
          <Text style={styles.detailsH} >Start</Text>
          <Text style={styles.detailsT} >{detailText[0]}</Text>
          <Text style={styles.detailsH} >Destination</Text>
          <Text style={styles.detailsT} >{detailText[1]}</Text>
          <TouchableOpacity  style={styles.SDButton} onPress={()=>{
            setDetailVisible(false);}}>
           <Text style={styles.ButtonText} >OK</Text>
          </TouchableOpacity>
      </View>
      </Detail>
    
     <View style={styles.list}>
     <Text style={styles.current}> {currentRoute===" "?<View><ActivityIndicator  size="small" color="white" /></View>:`Current Route: ${currentRoute}`}</Text>
    {<FlatList style={{backgroundColor:"white",borderBottomLeftRadius:30,borderBottomRightRadius:30,}}
          keyExtractor={(item, index) => 'key'+index}
          data={routes}
          renderItem={({ item }) => (
            <View style={styles.routeContainer}>
          <TouchableOpacity 
         onPress={()=>{
            onChange({route:item._id,name:item.name,user:Sdata._id,current:data.bus,isRoute:Sdata.route});
         }} >
          <Text style={styles.routT}>Route {item.name}</Text>
          </TouchableOpacity>
          <AntDesign onPress={displayDetails.bind(this,item.addresses)} name="infocirlce" size={24} color="#293038" />
          </View>
        )}
      />}
      </View>
      <View style={{flexDirection:"row",justifyContent:"center"}}>
        <TouchableOpacity  style={styles.SButton}>
        <Text style={styles.ButtonText} onPress={()=>{navigation.navigate("Dashboard")}}>Cancel</Text>
        </TouchableOpacity>
        </View>
        </View>);


    return (
      <View style={loader?{flex: 1,backgroundColor:"white"}:{ flex: 1,backgroundColor:"#FfC329"}}>
       {routes!==undefined && loader===false ?view:<View style={{marginLeft:22,marginTop:"40%",backgroundColor:"white"}}><Image source={require('../assets/Earth.gif')} /></View>}
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
      detailsT:{
        textAlign: 'center',
        color:"white",
        marginVertical:10
      },
      detailsH:{
        textAlign: 'center',
        color:"#FfC329",
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