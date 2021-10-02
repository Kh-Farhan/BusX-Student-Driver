import React, { useState, useEffect,useContext,} from "react";
import { StyleSheet, Text,Image, View,Button,TouchableOpacity,Switch,ActivityIndicator,Modal} from 'react-native';
import{DriverContext} from "../ContextApi";
import { Ionicons,FontAwesome,AntDesign   } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';



export function QR({ navigation,route }) {
const Sdata=useContext(DriverContext);
const[data,setData]=useState(Sdata);
const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
const [modalText, setModalText] = useState();

  useEffect(() => {
    navigation.setOptions({ headerRight:()=>( 
        <TouchableOpacity onPress={()=>navigation.goBack()}  >        
    <Ionicons style={{marginRight:10,marginTop:5}}name="arrow-back" size={28} color="black" />
    </TouchableOpacity>) });

    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setModalText(`QR code with type ${type} and data ${data} has been scanned!`);
    setModalVisible(true);
    setScanned(true);
  };

  if (hasPermission === null) {
  return (
    <View>
      <Text style={styles.statustext}>Requesting for camera permission</Text>
  <View><ActivityIndicator  size="large" color="#FfC329"/></View>
  </View>
  );
  }
  if (hasPermission === false) {
    return 
    (
      <View>
        <Text style={styles.statustext}>No access to camera</Text>
    <View><ActivityIndicator  size="large" color="#FfC329"/></View>
    </View>
    )
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
            navigation.navigate("Dashboard")}}>
        <Text style={styles.ButtonText} >OK</Text>
        </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={[StyleSheet.absoluteFill,{width:"90%",height:"60%",marginLeft:"5%",marginTop:20}]}
      />  
      <Text style={styles.text}>Capture the QR Code</Text> 
      <AntDesign name="qrcode" style ={{alignSelf:"center",marginTop:20}} size={74} color="black" />     
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
        color:"#293038",
        fontSize:30,
        marginTop:"135%"
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
    statustext:{
      marginTop:"30%",
      color:"#293038",
      fontSize:20,
      alignSelf:"center"
    },

    
  });