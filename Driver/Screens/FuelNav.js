import React, { useState, useEffect ,useContext} from "react";
import { StyleSheet,ScrollView, Text, View,Button,FlatList ,ActivityIndicator,Form,TextInput,TouchableOpacity,Image,Modal} from 'react-native';
import { MaterialIcons,MaterialCommunityIcons,Entypo  } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer,DrawerActions,NavigationActions } from '@react-navigation/native';
import{DriverContext} from "../ContextApi";
import {localhost as LOCAL_HOST} from "../localhost";
import { LogBox } from 'react-native';

const Buffer = require('buffer/').Buffer

const Stack = createStackNavigator();


export function FuelNav({ navigation,route }) {
  const data=useContext(DriverContext);
  const [driver,setDriver]=useState(data.driver);
  const [bus,setBus]=useState(data.bus);
  
  
      return (
        <Stack.Navigator  
        screenOptions={{ 
          headerTitleAlign:"center",
          headerLeft:()=>( 
            <TouchableOpacity style={{borderWidth:1,borderColor:"#696E74",marginLeft:10,borderRadius:30,elevation:6,marginTop:-5}}onPress={() => navigation.openDrawer()}  >
            <Image style={{width: 100, height: 50}} source={{uri:`data:${driver.photoType};charset=utf8;base64,${Buffer.from(driver.photo).toString('ascii')}`}} 
            style={{height:50,width:50,borderWidth:1,borderRadius:30}}/>
          
        </TouchableOpacity>)
         }}
        initialRouteName="Fuel">
          <Stack.Screen  options={{   
        headerStyle: {
          backgroundColor: '#FfC329',elevation:0
        }
        }} name="Fuel" component={Fuel} />
        </Stack.Navigator>
      );
      
    }


 function Fuel({ navigation,route }) {
const data=useContext(DriverContext);
const [driver,setDriver]=useState(data.driver);
const [bus,setBus]=useState(data.bus);
const [subject,setSubject]=useState("");
const [Fuel,SetFuel]=useState();
const [modalVisible, setModalVisible] = useState(false);
const [modalText, setModalText] = useState();
const[loading,setLoading]=useState(false);
const [historyVisible, setHistoryVisible] = useState(false);
const [historyText, setHistoryText] = useState([]);
useEffect(()=>{
  LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  navigation.setOptions({ headerRight:()=>( 
    <TouchableOpacity onPress={()=>{
      getHistory();
      setHistoryVisible();
    }}  >        
      <Entypo style={{marginRight:10,marginTop:5}} name="back-in-time" size={28} color="black" />
    </TouchableOpacity>) });
},[])


const handleSubmit=()=>{
  setLoading(true);
  console.log(Fuel);
  const date=new Date();
  fetch(`http://${LOCAL_HOST}:5000/driver/addFuel`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({Fuel:Fuel,date:date,bus:bus._id})
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

const getHistory=()=>{
  
  fetch(`http://${LOCAL_HOST}:5000/driver/getFuelHistory/${bus._id}`, {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
}) 

.then(response => response.json())  
.catch(error=> console.error("Error: ",error))
.then(response=>{
  if(response.History){
    setHistoryText(response.History);
    setLoading(false);

  }

});

}
const lowerButton=(
  <TouchableOpacity  style={styles.SButton} onPress={()=>{
    setHistoryVisible(false);
  }
    }>
<Text style={styles.ButtonText} >Cancel</Text>
</TouchableOpacity>
)

const historyView=(
  <ScrollView>
    <FlatList 
        style={{borderBottomLeftRadius:30,borderBottomRightRadius:30,}}
        keyExtractor={(item, index) => 'key'+index}
        data={historyText}
        ListFooterComponent={lowerButton}
        renderItem={({ item,index }) => (
          <View style={{flexDirection:"row",justifyContent:"space-between",width:"100%"}} >
          <Text style={styles.modalText1}>{index+1}</Text>
          <Text style={styles.modalText1}>{`${item.date.split("T")[0].split("-")[2]}/${item.date.split("T")[0].split("-")[1]}/${item.date.split("T")[0].split("-")[0]}`}</Text>
          <Text style={styles.modalText1}>{item.cost}</Text>
          </View>
        )}
    />
  </ScrollView>
)
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
              SetFuel();
            setModalVisible(false);}}>
        <Text style={styles.ButtonText} >OK</Text>
        </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={historyVisible}
      >
          <View style={styles.modalView}>
              {historyText.length===0?<View style={styles.ActivityIndicator}><ActivityIndicator  size="large" color="black"/></View>:historyView}
          </View>
      </Modal>
      <Image style={styles.image} source={require('../assets/fuel.gif')}/>
       <View style={styles.form}>
        <View style={[styles.inputFields]}>  
        <Text style={{fontSize:16,marginTop:8}}>Rs.</Text>       
         <TextInput
          style={[styles.TextInput]}
          placeholder="Cost"
          keyboardType="number-pad"
          placeholderTextColor="#293038" 
          value={Fuel}
          onChangeText={(text)=>{SetFuel(text)
          }}
        />
        </View>
      <TouchableOpacity type="submit" style={styles.SButton}>
      {loading?<View><ActivityIndicator  size="small" color="#FfC329"/></View>:<Text style={styles.ButtonText} onPress={handleSubmit}>Add Fuel</Text>}
      </TouchableOpacity>
      </View>
      </View>
    );
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      paddingTop:"20%",
      backgroundColor:"white"
    }, 
    text:{
      textAlign: 'center',
      color:"black",
      fontSize:30
    },
    form:{
      marginTop:"5%",
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
      marginTop: "40%",
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
    modalText1:{
      textAlign: 'right',
    color:"#293038",
    fontSize:16,
    fontWeight:"bold"
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
      justifyContent:"space-between",
      
    },
    TextInput:{
      marginLeft:10,
      width:300,
      fontSize:16
      
    },
    SButton:{
      alignItems: "center",
      marginTop:10,
      backgroundColor:"#293038",
      width:100,
      height:30,
      borderRadius:6,
      paddingTop:"1.5%",
      alignSelf:"center"
    
    },
    image: {
      marginTop:"5%",
      width: 250,
      height: 250,
      shadowColor: "yellow",
    shadowOffset: { height: 2},
    shadowOpacity: 0.3,
    },
    ButtonText:{
      color: "#FfC329",
      fontWeight: "bold",
      alignSelf: "center",
      textTransform: "uppercase"
    },
    
  });