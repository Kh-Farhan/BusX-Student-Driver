
{/*
  const base64Image = student.photo.toString(); 
  <Image style={{width: 100, height: 50}} source={{uri:`data:image/jpeg;charset=utf8;base64,${base64Image}`}}/>
    */}
    
    import React, { useState, useEffect,useContext} from "react";
    import { StyleSheet,ScrollView, TextInput,Text,Image,ActivityIndicator, Modal,View,Button,componentWillMount,TouchableOpacity} from 'react-native';
    import { useFocusEffect } from '@react-navigation/native';
    import { FontAwesome5,Entypo,Ionicons,MaterialCommunityIcons,MaterialIcons ,AntDesign,FontAwesome ,Zocial  } from '@expo/vector-icons';
    import { DriverContext } from "../ContextApi";
    import { createStackNavigator } from '@react-navigation/stack';
    import { NavigationContainer,DrawerActions,NavigationActions } from '@react-navigation/native';
    import {localhost as LOCAL_HOST} from "../localhost";
    import {Linking} from 'react-native';
    import * as Location from 'expo-location';
    import * as Permissions from 'expo-permissions';
    import {socket} from "../socket.js";
    import * as ImagePicker from 'expo-image-picker';
    import RNImmediatePhoneCall from 'react-native-immediate-phone-call';

    const Buffer = require('buffer/').Buffer

    const Stack = createStackNavigator();

    export function EmergencyNav({ navigation,route }) {
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
            initialRouteName="Feedback">
              <Stack.Screen  options={{   
            headerStyle: {
              backgroundColor: '#FfC329',elevation:0
            }
            }} name="Emergency" component={EmergencyScreen} />
            </Stack.Navigator>
          );
          
        }
    
        

    function EmergencyScreen({ navigation,route }) {
      const data=useContext(DriverContext);
        const [driver,setDriver]=useState(data.driver);
        const [bus,setBus]=useState(data.bus);
        const [image1,setImage1]=useState("");
        const [image2,setImage2]=useState("");
        const [issue,setIssue]=useState("");
        const [description,setDescription]=useState("");
        const [loading,setLoading]=useState(false);
        const [done,setDone]=useState(false);
        const [modalVisible, setModalVisible] = useState(false);
        const [modalText, setModalText] = useState();
        const [contactVisible, setContactVisible] = useState(false);
        const [ContactText, setContactText] = useState();
        let time=0;
        useEffect(()=>{
          navigation.setOptions({ headerRight:()=>( 
            <TouchableOpacity onPress={()=>{
              setContactVisible(true);
            }}  >        
              <AntDesign style={{marginRight:10,marginTop:5}}name="contacts" size={28} color="black" />
            </TouchableOpacity>) });
            (async () => {
              if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== 'granted') {
                  alert('Sorry, we need camera  permissions to make this work!');
                }
              }
              
            })();
            
        });
        const SubmitReport=async()=>{
          setLoading(true);
          let { status } = await Location.requestForegroundPermissionsAsync();
              if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
              }
              let currLoc={};
          const curLoc=Location.watchPositionAsync({accuracy: Location.Accuracy.Balanced, timeInterval: 300, distanceInterval: 0 },(location)=>{
                console.log(location.coords.latitude+","+location.coords.longitude);
                currLoc={lat:location.coords.latitude,lng:location.coords.longitude};
                curLoc._W.remove();
              });
              setLoading(false);
        fetch(`http://${LOCAL_HOST}:5000/driver/reportEmergency`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({description:description,issue:issue,loc:currLoc,image1:image1,image2:image2,bus:bus._id})
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
        
        const pickImage = async () => {
          time=time+1;
          let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            aspect: [4, 3],
            quality: 0.2,
            base64:true
          });
      
          console.log(result);
          if (!result.cancelled) {
            if(time===1){
              setImage1(result.base64);
              pickImage();
            }
            if(time===2){
              setImage2(result.base64);
              setDone(true);
            }
          }
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
            setDescription("");
            setIssue("");
            setImage1("");
            setImage2("");
            setDone(false);
            time=0;
            console.log(time);
          }

            }>
        <Text style={styles.ButtonText} >OK</Text>
        </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={contactVisible}
      >
        <View>
          <View style={styles.modalView}>
          <View style={{marginTop:10,flexDirection:"row",justifyContent:"space-between" ,borderBottomColor:"#FfC329",borderBottomWidth:1}}>
          <Image style={styles.image} source={require('../assets/rescue.png')}/>
          <Text style={[styles.modalText,{fontWeight:"bold",fontFamily:"sans-serif-light"}]}>Rescue</Text>
          <Text onPress={()=>{Linking.openURL(`tel:${1122}`)}}style={[styles.modalText,{fontWeight:"bold",fontFamily:"sans-serif-light",color:"#0039a6"}]}>1122</Text>
          </View>
          <View style={{marginTop:10,flexDirection:"row",justifyContent:"space-between",borderBottomColor:"#FfC329",borderBottomWidth:1}}>
          <Image style={styles.image} source={require('../assets/fire.png')}/>
          <Text style={[styles.modalText,{fontWeight:"bold",fontFamily:"sans-serif-light"}]}>Fire</Text>
          <Text onPress={()=>{Linking.openURL(`tel:${16}`)}} style={[styles.modalText,{fontWeight:"bold",fontFamily:"sans-serif-light",color:"#0039a6"}]}>16</Text>
          </View>
          <View style={{marginTop:10,flexDirection:"row",justifyContent:"space-between",borderBottomColor:"#FfC329",borderBottomWidth:1}}>
          <Image style={styles.image} source={require('../assets/police.png')}/>
          <Text style={[styles.modalText,{fontWeight:"bold",fontFamily:"sans-serif-light"}]}>Police</Text>
          <Text onPress={()=>{Linking.openURL(`tel:${15}`)}} style={[styles.modalText,{fontWeight:"bold",fontFamily:"sans-serif-light",color:"#0039a6"}]}>15</Text>
          </View>
            <TouchableOpacity  style={styles.SButton} onPress={()=>{
            setContactVisible(false);
          }
            }>
        <Text style={styles.ButtonText} >Cancel</Text>
        </TouchableOpacity>
          </View>
        </View>
      </Modal>
           <View style={styles.form}>
        <View style={styles.inputFields}>
          <TextInput
          style={styles.TextInput}
          placeholder="Issue"
          placeholderTextColor="#293038" 
          value={issue}
          onChangeText={(text)=>{setIssue(text)
            }}
        />
        </View>
        <View style={[styles.inputFields,{height:200}]}>       
         <TextInput
          style={[styles.TextInput,{textAlignVertical: 'top',marginTop:-95}]}
          placeholder="Description"
          placeholderTextColor="#293038"
          value={description}
          multiline={true}
          numberOfLines={5}
          onChangeText={(text)=>{setDescription(text)
          }}
        />
        </View>
        <View style={{flexDirection:"row",justifyContent:"space-between",paddingHorizontal:50,marginTop:10}}>
          <TouchableOpacity onPress={pickImage} disabled={done} type="submit" style={[styles.SButton,{backgroundColor:"transparent",marginTop:-35}]}>
          <Entypo name="camera" size={40} color="black" style={{marginTop:0}}/>
          <Text>Take Photo</Text>
          </TouchableOpacity> 
          <View style={{flexDirection:"row",justifyContent:"center",marginTop:0,}}>
            {image1!==""?<Image style={styles.imgs} source={{uri:`data:image/jpg;base64,${image1}`}}/>:<View style={{height:50}}></View>}
            {image2!==""?<Image style={styles.imgs} source={{uri:`data:image/jpg;base64,${image2}`}}/>:<View style={{height:50}}></View>}
          </View>
        </View>
      <TouchableOpacity type="submit" style={styles.SButton}>
      {loading===true?<View><ActivityIndicator  size="small" color="#FfC329"/></View>:<Text style={styles.ButtonText} onPress={SubmitReport}>Report</Text>}
      </TouchableOpacity>
      
      </View>
     
           
          </View>
        );
      }
    
   
      const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor:"white",
          alignItems: "center",
        },
        form:{
          marginTop:"20%",
          justifyContent:"center",
          backgroundColor: "#FfC329",
          paddingBottom:"5%",
        borderRadius:10,
        elevation: 20,
        opacity:0.9
        },
        imgs:{
          width: 50, 
          height: 50,
          marginLeft:10,
          borderRadius:10,
          borderColor:"#293038",
          borderWidth:1
      },
        inputFields:{
          borderColor:"#293038",
          borderRadius:10,
          borderWidth:1,
          height: 40,
          width:320,
          marginTop: 22,
          marginHorizontal:10,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal:10
        },
        TextInput:{
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
        image: {
          width: 40,
          height: 40,
          shadowColor: "yellow",
        shadowOffset: { height: 2},
        shadowOpacity: 0.3,
        marginTop:-4
        },
        fPass:{
          color:"#293038",
          textAlign:'right',
          fontSize:13,
          fontWeight:"bold",
          marginRight:13    
        },
        error:{
          color:"red",
          textAlign:'left',
          fontSize:12,
          fontWeight:"bold",
          marginLeft:20    
        },
        modalView: {
          width:"95%",
          alignSelf:"center",
          marginTop: "80%",
          backgroundColor: "white",
          borderRadius: 20,
          borderWidth:1,
          borderColor:"#FfC329",
          padding: 20,
          paddingHorizontal:20,
          alignItems: "stretch",
          shadowColor: "#FfC329",
          shadowOffset: {
            width: 0,
            height: 2
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5
        },
        modalText:{
          textAlign: 'center',
        color:"#293038",
        fontSize:20}

      });