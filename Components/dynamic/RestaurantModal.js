import React from 'react';
import {Text,View,StyleSheet,TouchableOpacity,Dimensions} from 'react-native';
import Modal from 'react-native-modal';
import MapView,{Polyline, Marker} from 'react-native-maps';
import Axios from 'axios';
import polyline from '@mapbox/polyline';
import secretkey from '../../assets/API/important';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Carousel from 'react-native-snap-carousel';
import Moment from 'moment';

class RestaurantModal extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            userLatitude: parseFloat(this.props.userLatitude),
            userLongitude:parseFloat(this.props.userLongitude),
            restaurantLatitude:parseFloat(this.props.restaurantLatitude),
            restaurantLongitude:parseFloat(this.props.restaurantLongitude),
            placeID:this.props.placeID,
            coords:[],
            formattedPhoneNumber:0,
            openingHours:'',
            reviews:'',
            phoneNumber:'',
            carouselData:[]
        }

    }

    componentDidMount(){
        this.retrieveLocalRestaurantsDetails();
        this.determineDirections();

        
        console.log("this.state.placeID: " + this.state.placeID)
    }

    renderCarouselItem = ({item,index}) =>{
        var renderReviewTime = Moment(item.time).format('DD/MM/YYYY HH:mm');
        console.log(item);
        return(
            <View style={{justifyContent:'center',flexDirection:'column'}}>
                <Text style={{fontStyle:'italic',textAlign:'center'}}>Reviews</Text>
                <Text style={{textAlign:'center'}}>{item[index].author_name}</Text>
                <Text style={[styles.customFont,{fontStyle:'italic',width:'100%'}]}>{item[index].text}</Text>
                <Text style={[styles.customFont,{textAlign:'center'}]}>{renderReviewTime}</Text>
            </View>
        )
    }

    determineDirections = () =>{
        const {userLatitude,userLongitude,placeID} = this.state;


        console.log(userLatitude)
        console.log(userLongitude)
        console.log(placeID)

        Axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${userLatitude},${userLongitude}&destination=place_id:${placeID}&key=${secretkey.secret}`)
        .then(response=>{
            console.log(response.data)

            var points = polyline.decode(response.data.routes[0]["overview_polyline"]["points"])

            let restaurantCoords = points.map((point)=>(
                {
                    latitude:point[0],
                    longitude:point[1]
                }
            ))
            this.setState({
                coords:restaurantCoords
            })

            console.log("RestaurantModal points: " + points)
        })
        .catch(error=>{
            var errorStatusCode = (error.response.status);
            switch(errorStatusCode){
                case 400:
                    console.log("Bad request");
                    break;
                case 401:
                    console.log("Unauthorized");
                    break;
                default:
                    break;
            }
            
        })
    }

    retrieveLocalRestaurantsDetails = () =>{
        Axios.get(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${this.state.placeID}&fields=name,rating,reviews,formatted_phone_number&key=${secretkey.secret}`)
        .then(response=>{
            var formattedPhoneNumber = response.data.result["formatted_phone_number"];

            var fieldValues = [];

            for(var key in response.data.result){
                console.log(response.data.result[key]);
                fieldValues.push(response.data.result[key]);
            }

            console.log(fieldValues)

            var reviews = response.data.result["reviews"];
            console.log(reviews[0].author_name);
            var reviewArray = [];
            reviewArray.push(reviews);

            this.setState({
                phoneNumber:fieldValues[0],
                carouselData:reviewArray
            });

            console.log(this.state.phoneNumber)
        })
        .catch(error=>{
            console.log("Error: retrieveLocalRestaurantsDetails:" + error);
        })
    }

        render(){
            const {userLatitude,userLongitude,phoneNumber} = this.state;
            return(
                <View style={styles.container}>
                    <View style={{height:400,width:Dimensions.get('window').width,flex:2,}}>
                    <MapView
                        style={{height:200,width:Dimensions.get('window').width}}
                        initialRegion={{
                        latitude: userLatitude,
                        longitude: userLongitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    >
                    <Marker
                        coordinate={{
                            latitude:this.state.userLatitude,
                            longitude:this.state.userLongitude
                        }}
                    />

                    <Marker
                        coordinate={{
                            latitude:this.state.restaurantLatitude,
                            longitude:this.state.restaurantLongitude
                        }}
                        // icon={<Icon name="utensils" size={30}/>}
                    />
                    <Polyline
                        coordinates={this.state.coords}
                        strokeWidth={1}
                        strokeColor="red"
                        />
                    </MapView>
                    <Text style={[styles.customFont,{textAlign:'center'}]}>Contact information</Text>
                        <Text style={[styles.customFont,{width:Dimensions.get('window').width,textAlign:'left'}]}>{phoneNumber}</Text>
                    </View>
                    <View style={{flex:1,flexDirection:'row'}}>
                        <Carousel
                            ref={(c)=>{this._carousel = c;}}
                            data={this.state.carouselData}
                            renderItem={this.renderCarouselItem}
                            sliderWidth={300}
                            itemWidth={180}
                            sliderHeight={150}
                            itemHeight={100}
                        />
                    </View>
                    
                    <View style={{width:Dimensions.get('window').width}}>
                    <TouchableOpacity onPress={this.props.closeModal}>
                        <Text style={[styles.customFont,{textAlign:'center',backgroundColor:'#22313f',color:'white',padding:8}]}>Close</Text>
                    </TouchableOpacity>
                    </View>
                    
                </View>
            )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 6,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      width:Dimensions.get('window').width,
      marginTop:20
    },
    customFont:{
        fontFamily:'OpenSans-Light'
    }
  });

export default RestaurantModal;