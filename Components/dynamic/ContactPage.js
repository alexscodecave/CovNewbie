import React from 'react';
import {Text,View,StyleSheet,TouchableOpacity,Linking,Platform,Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

class ContactPage extends React.Component{

    static navigationOptions = {
        title:'Contacts page'
    }

    constructor(props){
        super(props);

        this.state = {
            phoneNumber:'02477657688'
        }

    }

    determineOSCallMethod = () =>{
        const {phoneNumber} = this.state;
        var determinePhoneURL = "";

        Platform.OS==='ios'?determinePhoneURL = `tel://${phoneNumber}` : determinePhoneURL = `tel:${phoneNumber}`

        Linking.openURL(determinePhoneURL);
    }

    goToFacebookApp = () =>{
        var facebookURL = "https://www.facebook.com/coventryuniversity";

        Linking.canOpenURL(facebookURL).then((supported)=>{
            if(!supported){
                alert("App not supported")
            }else{
                return Linking.openURL(facebookURL)
            }
        }).catch(error=>{
            alert("Error opening link: " + error);
        })
    }

    

    goToSnapchatApp = () =>{
        var snapchatURL = "https://www.snapchat.com/add/coventry_uni";

        Linking.canOpenURL(snapchatURL).then((supported)=>{
            if(!supported){
                alert("App not supported")
            }else{
                return Linking.openURL(snapchatURL)
            }
        }).catch(error=>{
            alert("Error opening link: " + error);
        })
    }

    goToTwitterApp = () =>{
        var twitterURL = "https://twitter.com/covcampus";

        Linking.canOpenURL(twitterURL).then((supported)=>{
            if(!supported){
                alert("App not supported")
            }else{
                return Linking.openURL(twitterURL)
            }
        }).catch(error=>{
            alert("Error opening link: " + error);
        })
    }

    render(){
        
        return(
                <View style={styles.container}>
                 <View style={{flexDirection:'row',justifyContent:'flex-start',width:Dimensions.get('window').width}}>
                <View>
                    {/* <TouchableOpacity onPress={()=>this.props.navigation.openDrawer()}>
                    <Icon name="bars" style={{fontSize:30,fontWeight:100}}  />

                    </TouchableOpacity> */}
                </View>
                </View>

                    <View style={{width:Dimensions.get('window').width,justifyContent:'flex-start'}}>
                    <Text style={[styles.customFont,styles.alignTextLeft]}>Phone number</Text>
                    <TouchableOpacity onPress={()=>this.determineOSCallMethod()}>
                    <Text style={{fontSize:20,fontFamily:'OpenSans-Light'}}>024 7765 7688</Text>
                    </TouchableOpacity>

                    </View>
                    <View style={{borderBottomWidth:StyleSheet.hairlineWidth,borderBottomColor:'black',paddingTop:10,paddingBottom:10}}>

                    </View>
                    <Text style={[styles.customFont,styles.alignTextLeft]}>Social media</Text>
                    <View style={{justifyContent:'space-evenly',flexDirection:'row'}}>
                        <View>
                        <TouchableOpacity onPress={()=>Linking.canOpenURL("twitter://")}>
                            <Icon name="facebook-f" size={30} color={"#3b5998"}onPress={()=>this.goToFacebookApp()} />


                        </TouchableOpacity>
                        </View>

                        <View>
                        <TouchableOpacity>
                            <Icon name="snapchat-ghost" size={30} color={"#fffc00"} onPress={()=>this.goToSnapchatApp()}/>


                        </TouchableOpacity>
                        </View>
                        <View>

                         <TouchableOpacity>
                            <Icon name="twitter" size={30} color={"#1da1f2"} onPress={()=>this.goToTwitterApp()}/>
                        </TouchableOpacity>
                        </View>
                        <View>

                         <TouchableOpacity>
                            <Icon name="instagram" size={30}/>
                        </TouchableOpacity> 
                        </View>
                    </View>


                     <View style={{borderBottomWidth:StyleSheet.hairlineWidth,borderBottomColor:'black',paddingTop:10,paddingBottom:10}}>
                     </View>

                    <View>
                        <Text style={[styles.customFont,styles.alignTextLeft]}>Other</Text>
                        <TouchableOpacity onPress={()=>Linking.openURL("https://www.cusu.org/")}><Text style={[styles.customFont,styles.alignTextLeft]}>https://www.cusu.org/</Text></TouchableOpacity>
                    </View>


                </View>


            )
        }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      position:'absolute',
      top:50,
      backgroundColor: 'white',
      backgroundColor:'white'
    },
    welcome: {
      fontSize: 30,
      textAlign: 'center',
      fontFamily:'OpenSans-Light',
      position:'absolute',
      top:20,
      margin: 10,
    },
    instructions: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5,
    },
    customFont:{
        fontFamily:'OpenSans-Light'
    },
    alignTextLeft:{
        textAlign:'left',
        width:Dimensions.get('window').width,
        fontSize:25
    }
  });

export default ContactPage;