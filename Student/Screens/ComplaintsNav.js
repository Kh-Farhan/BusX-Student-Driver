import React, { useState, useEffect ,useContext} from "react";
import { StyleSheet, Text, View,Button,FlatList ,ActivityIndicator,Form,TextInput,TouchableOpacity,Image,Modal} from 'react-native';
import { MaterialIcons,MaterialCommunityIcons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer,DrawerActions,NavigationActions } from '@react-navigation/native';
import{StudentContext} from "../ContextApi";
import {localhost as LOCAL_HOST} from "../localhost";
import base64 from 'react-native-base64';


const Stack = createStackNavigator();
export function ComplaintsNav({ navigation,route }) {
  const student=useContext(StudentContext);
  const[data,setData]=useState(student);
  const base64Image = base64.decode((student.photo));
  
  
      return (
        <Stack.Navigator  
        screenOptions={{ 
          headerTitleAlign:"center",
          headerLeft:()=>( 
            <TouchableOpacity style={{borderWidth:1,borderColor:"#696E74",marginLeft:10,borderRadius:30,elevation:6,marginTop:-5}}onPress={() => navigation.openDrawer()}  >
            <Image style={{width: 100, height: 50}} source={{uri:`data:${student.photoType};charset=utf8;base64,${base64Image}`}} 
            style={{height:50,width:50,borderWidth:1,borderRadius:30}}/>
          
        </TouchableOpacity>)
         }}
        initialRouteName="Complaints">
          <Stack.Screen  options={{   
        headerStyle: {
          backgroundColor: '#FfC329',elevation:0
        }
        }} name="Complaints" component={Complaints} />
        </Stack.Navigator>
      );
      
    }


 function Complaints({ navigation,route }) {
const Sdata=useContext(StudentContext);
const[data,setData]=useState(Sdata);
const [subject,setSubject]=useState("");
const [desc,setDesc]=useState("");
const [modalVisible, setModalVisible] = useState(false);
const [modalText, setModalText] = useState();
const[loading,setLoading]=useState(false);

const handleSubmit=()=>{
  setLoading(true);
  console.log(subject,desc);
  fetch(`http://${LOCAL_HOST}:5000/student/complain`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({subject:subject,description:desc})
  })
  .then(response => response.json())  
  .catch(error=> console.error("Error: ",error))
  .then(response=>{
      if(response.message){
        setLoading(false);
        setModalVisible(true);
        setModalText(response.message)
      }
      if(response.Success){
        setLoading(false);
        setModalVisible(true);
        setModalText(response.Success)
      }
      
  })
}

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
            setSubject("");
            setDesc("");}}>
        <Text style={styles.ButtonText} >OK</Text>
        </TouchableOpacity>
          </View>
        </View>
      </Modal>
       <View style={styles.form}>
        <View style={styles.inputFields}>
          <TextInput
          style={styles.TextInput}
          placeholder="Subject"
          placeholderTextColor="#293038" 
          value={subject}
          onChangeText={(text)=>{setSubject(text)
            }}
        />
        </View>
        <View style={[styles.inputFields,{height:200}]}>         
         <TextInput
          style={[styles.TextInput,{textAlignVertical: 'top',marginTop:10}]}
          secureTextEntry
          placeholder="Description"
          placeholderTextColor="#293038" 
          value={desc}
          multiline={true}
          numberOfLines={5}
          onChangeText={(text)=>{setDesc(text)
          }}
        />
        </View>
      <TouchableOpacity type="submit" style={styles.SButton}>
      {loading?<View><ActivityIndicator  size="small" color="#FfC329"/></View>:<Text style={styles.ButtonText} onPress={handleSubmit}>Done</Text>}
      </TouchableOpacity>
      </View>
      </View>
    );
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      paddingTop:"20%"
    }, 
    text:{
      textAlign: 'center',
      color:"black",
      fontSize:30
    },
    form:{
      marginTop:"1%",
      justifyContent:"center",
      backgroundColor: "#FfC329",
      paddingBottom:20,
    borderRadius:10,
    elevation: 20,
    opacity:0.9
    },
    Heading:{
      textAlign: 'center',
      fontWeight:"bold",
      color:"#293038",
      fontSize:24,
      fontFamily: 'Roboto'
     },
     modalView: {
      width:"95%",
      alignSelf:"center",
      marginTop: "80%",
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
    inputFields:{
      borderColor:"#293038",
      borderRadius:10,
      borderWidth:1,
      height: 40,
      width:300,
      margin: 12,
      paddingLeft:10,
      flexDirection: 'row',
      justifyContent:"center",
      
    },
    TextInput:{
      marginLeft:10,
      width:300,
      
    },
    SButton:{
      alignItems: "center",
      marginTop:30,
      backgroundColor:"#293038",
      width:100,
      height:30,
      borderRadius:6,
      paddingTop:"1.5%",
      alignSelf:"center"
    
    },
    ButtonText:{
      color: "#FfC329",
      fontWeight: "bold",
      alignSelf: "center",
      textTransform: "uppercase"
    },
    
  });