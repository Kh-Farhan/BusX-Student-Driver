import React, { useState, useEffect ,useContext} from "react";
import base64 from 'react-native-base64';
import { StyleSheet, Text, View,Button,FlatList ,ActivityIndicator,Form,TextInput,TouchableOpacity,Image,Modal} from 'react-native';
import { MaterialIcons,MaterialCommunityIcons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer,DrawerActions,NavigationActions } from '@react-navigation/native';
import{StudentContext} from "../ContextApi";
import changePassword from './changePassword'
import {localhost as LOCAL_HOST} from "../localhost";
const Stack = createStackNavigator();
//Navigator COmponent
export function AccountSetting({ navigation,route }) {
const student=useContext(StudentContext);
const[data,setData]=useState(student);
const [subject,setSubject]=useState("");
const [desc,setDesc]=useState("");
const [modalVisible, setModalVisible] = useState(false);
const [modalText, setModalText] = useState();
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
      initialRouteName="Account Setting">
        <Stack.Screen  options={{   
      headerStyle: {
        backgroundColor: '#FfC329',elevation:0
      }
      }} name="Change Password" component={changePassword} />
      <Stack.Screen  options={{   
      headerStyle: {
        backgroundColor: '#FfC329',elevation:0
      }
      }} name="Account Setting" component={Settings} />
      </Stack.Navigator>
    );
    
  }


    const Settings=({navigation,route})=>{
      const [email,setEmail]=useState("");
      const[message,setMessage]=useState("");
  
      //handler
      const handlePress=()=>{
        
      }
      return(
          <View  style={styles.container}>
          <TouchableOpacity 
          style={styles.optionContainer}
         onPress={()=>{
          navigation.navigate("Change Password");
         }} >
          <Text style={styles.option} >Change Password</Text>
          </TouchableOpacity>
          </View>
  
      )
      
      };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      paddingTop:"1%"
    }, 
    optionContainer:{
      flexDirection:"row",
      alignItems: "center",
      backgroundColor:"white",
    justifyContent: "space-between",
    borderBottomWidth:1,
    borderBottomColor:"#FfC329",
    padding:"4%",
    marginVertical:"1%",
    marginHorizontal:"1%",
    width:"98%",
    borderRadius:10,
    elevation:6
  },
  option:{
    color:"#293038",
    fontSize:16,
    fontWeight:"bold"
},
    
  });