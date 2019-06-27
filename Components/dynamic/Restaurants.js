import React from 'react';
import {Text,View,StyleSheet,TouchableOpacity,FlatList,PermissionsAndroid,Platform,Dimensions,Image,Animated} from 'react-native';
import Axios from 'axios';
import secretkey from '../../assets/API/important';
import {Card} from 'react-native-elements';
import {Rating,Icon} from 'react-native-elements';
import Modal from 'react-native-modal';
import MapView from 'react-native-maps';
import RestaurantModal from '../dynamic/RestaurantModal';
import Hamburger from '../static/hamburger';


class Restaurants extends React.Component{

    static navigationOptions = {
        drawerLabel:() => null
    }

    constructor(props){
        super(props);

        this.state = {
            data:[],
            flatlistEndReached:'',
            nextPageToken:'',
            priceLevelArray:[],
            isModalVisible:false,
            chosenPlaceID:'',
            userLatitude:0,
            userLongitude:0,
            restaurantLatitude:0,
            restaurantLongitude:0
        }
    }

    getLocation = async () =>{
        try{
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title:'App',
                    message:'Are you sure you want to share your location?'

                }
            )
            if(granted===PermissionsAndroid.RESULTS.GRANTED){
                alert("Access granted")
            }else{
                alert("Access denied")
            }
        }catch(error){
            console.log("Error: " + error);
        }
    }

    retrieveNextLocalRestaurants = () =>{
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
        const   currentLongitude  = JSON.stringify(position.coords.longitude);
       //getting the Longitude from the location json
         const   currentLatitude = JSON.stringify(position.coords.latitude);
       //getting the Latitude from the location json
       console.log("restaurant longitude: " + currentLongitude);
       console.log("restaurant longitude: " + currentLatitude);
       const{nextPageToken} = this.state;

       Axios(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${currentLatitude},${currentLongitude}&radius=1500&type=restaurant&pagetoken=${nextPageToken}&key=${secretkey.secret}`)
       .then(response=>{
           console.log(response.data);
           if(response.data!==undefined){
            this.setState({
                data:this.state.data.concat(response.data.results),
                showLoading:false
            })
           }
       })
       .catch(error=>{
           console.log("Error: " + error);
       })

            },
        (error) => alert(error.message),
        { 
            enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 
        }
        );
    }

    retrieveLocalRestaurants = () =>{
        navigator.geolocation.getCurrentPosition(
            (position) => {
        const   currentLongitude  = JSON.stringify(position.coords.longitude);
       //getting the Longitude from the location json
         const   currentLatitude = JSON.stringify(position.coords.latitude);
       //getting the Latitude from the location json
       Axios(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${currentLatitude},${currentLongitude}&radius=1500&type=restaurant&key=${secretkey.secret}`)
       .then(response=>{

        console.log(response.data.next_page_token)

           if(response.data!==undefined){
            this.setState({
                data:response.data.results,
                nextPageToken:response.data.next_page_token,
                userLatitude:currentLatitude,
                userLongitude:currentLongitude
            })
           }
           
           
       })
       .catch(error=>{
           console.log("Error: " + error);
       })

            },
        (error) => alert(error.message),
        { 
            enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 
        }
        );

       
    }

    componentDidMount(){
        this.retrieveLocalRestaurants();

        if(Platform.OS==='android'){
            this.getLocation();
        }

    
    }

    _keyExtractor = (item) => item.place_id;

    priceLevelFormat = (priceLevelDigit) =>{
        
        var iconArray = [];
        for(var loopIndex = 0;loopIndex<priceLevelDigit;loopIndex++){
            iconArray.push(
                <Icon size={30} key={"icon_"+loopIndex+"_"+Math.random()} name="pound" type="foundation"/>   
            )
        }
        return(
            iconArray
        )
        
    }

    showModal = (item) =>{
        console.log("item.place_id: " +item.place_id);
        this.setState({
            isModalVisible:true,
            chosenPlaceID:item.place_id,
            restaurantLatitude:item.geometry.location.lat,
            restaurantLongitude:item.geometry.location.lng
        });
    }

    showAnimationText = () =>{
        Animated.timing(
            this.state.showAnimated,{
                toValue:1,
                duration:3000
            }
        ).start();
    }

    closeModal = () =>{
        this.setState({
            isModalVisible:false
        });

        console.log("close modal clicked");
    }

    renderCustomCard = ({item}) =>{
        var isRestaurantOpen = ""
        var isRestaurantOpenStyle = "";
        console.log(item.opening_hours);
        if(item.opening_hours==undefined){ //error handling
            isRestaurantOpen = "No opening hours available"; 
        }else{
            isRestaurantOpen = item.opening_hours.open_now;
            isRestaurantOpenStyle  = item.opening_hours.open_now == true ? "green" : "red"
        }
        
        var photoReference = "";
        if(item.photos!==undefined){
            photoReference = item.photos[0].photo_reference;
        }
        var roundRating = Math.round(item.rating);
        {/**/}
        return(
            //image={{uri:`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${secretkey.secret}`}}
            <TouchableOpacity onPress={()=>this.showModal(item)}>
            <Card image={{uri:`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${secretkey.secret}`}}>
                <Text style={styles.customFont}>{item.name}</Text>
                <Text style={styles.customFont}>{item.vicinity}</Text>
                {/* <Text style={[styles.customFont,{color:isRestaurantOpenStyle}]}>{isRestaurantOpen==true?"Open now" : "Closed"}</Text> */}
                <View style={{flexDirection:'row'}}>{this.priceLevelFormat(item.price_level)}</View>
                <Rating imageSize={20} readonly  startingValue={roundRating} ratingCount={5}/>
            </Card>
            </TouchableOpacity>
        )
    }
    //onEndReached={()=>this.retrieveNextLocalRestaurants()}
    //onEndReachedThreshold={20}

    render(){
        const {userLatitude,userLongitude,chosenPlaceID,restaurantLatitude,restaurantLongitude,isModalVisible} = this.state;
        return(
            <View style={styles.container}>
                <View style={{flex:0.1,width:Dimensions.get('window').width,justifyContent:'center',paddingLeft:5,marginTop:15}}>
                <Hamburger/>
                </View>
                <View style={{flex:0.9}}>
                <FlatList
                    data={this.state.data}
                    renderItem={this.renderCustomCard}
                    keyExtractor={this._keyExtractor}
                    style={{width:Dimensions.get('window').width}}
                    onEndReached={()=>this.retrieveNextLocalRestaurants()}                    
                    onEndReachedThreshold={0.2}
                    />

                    <Modal isVisible={isModalVisible}>
                        <RestaurantModal
                            userLatitude={userLatitude}
                            userLongitude={userLongitude}
                            placeID={chosenPlaceID}
                            restaurantLatitude={restaurantLatitude}
                            restaurantLongitude={restaurantLongitude}
                            closeModal={this.closeModal}
                        />
                    </Modal>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
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
    }
  });

export default Restaurants;