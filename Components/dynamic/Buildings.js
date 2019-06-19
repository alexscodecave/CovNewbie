import React from 'react';
import {Text,View,StyleSheet,Dimensions,PermissionsAndroid,Geolocation,TouchableOpacity,ActivityIndicator} from 'react-native';
import Carousel,{Pagination} from 'react-native-snap-carousel';
import MapView,{Marker, Polyline} from 'react-native-maps';
import Permissions from 'react-native-permissions';
import Axios from 'axios';
import secretkey from '../../assets/API/important';
import polyline from '@mapbox/polyline';
import Icon from 'react-native-vector-icons/FontAwesome';
import Hamburger from '../static/hamburger';


class Buildings extends React.Component{

    static navigationOptions = {
        drawerLabel:()=>null
    }

    constructor(props){
        super(props);

        this.state = {
            buildings:['William Morris',
                        'Engineering & Computing Building',
                        'Ellen Terry',
                        'George Eliot',
                        'Graham Sutherland',
                        'Frederick Lanchester Library',
                        'Jaguar',
                        'The Hub',
                        'Maurice Foss',
                        'James Starley',
                        'Priory Building'],
            activeSlide:0,
            currentBuildingLat:52.406468, //
            currentBuildingLng:-1.502902, //
            currentTitle:'William Morris',
            locationPermission:'',
            userLocation:'',
            buildingCoordsArray:[],
            directionsLat:0,
            directionsLng:0,
            coords:[],
            userLatitude:0,
            userLongitude:0,
            walkingDistance:'',
            drivingDistance:'',
            transitDistance:'',
            matrixDistanceArray:[],
            loading:true
        }
    }

    componentDidMount(){
        
        navigator.geolocation.getCurrentPosition((position) => {
              this.setState({ 
                  userLatitude:position.coords.latitude,
                  userLongitude:position.coords.longitude
                });
                this.distanceMatrixRequest();
                this.directionsToBuilding();
                
              
            },
            (error) =>console.log("Error: " + error),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
          );

        // Permissions.check('location').then(response=>{
        //     this.setState({
        //         locationPermission:response
        //     })
        // });

        console.log(this.state.currentBuildingLat);
        console.log(this.state.currentBuildingLng);

        
        
    }

    distanceMatrixRequest = ()=>{
        
        var distanceValues = [];

        navigator.geolocation.getCurrentPosition(
            position => {
          
              this.setState({ 
                  userLatitude:position.coords.latitude,
                  userLongitude:position.coords.longitude
                });
        
            const {userLatitude,userLongitude,currentBuildingLat,currentBuildingLng} = this.state;
            console.log("distanceMatrixRequest: " + currentBuildingLat);
            console.log("distanceMatrixRequest: " + currentBuildingLng);


        let walkingURL = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&mode=walking&origins=${userLatitude},${userLongitude}&destinations=${currentBuildingLat},${currentBuildingLng}&key=${secretkey.secret}`;
        let drivingURL = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&mode=driving&origins=${this.state.userLatitude},${this.state.userLongitude}&destinations=${this.state.currentBuildingLat},${this.state.currentBuildingLng}&key=${secretkey.secret}`;
        let transitURL = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&mode=transit&origins=${this.state.userLatitude},${this.state.userLongitude}&destinations=${this.state.currentBuildingLat},${this.state.currentBuildingLng}&key=${secretkey.secret}`;

        const walkingPromise = Axios.get(walkingURL);
        const drivingPromise = Axios.get(drivingURL);
        const transitPromise = Axios.get(transitURL);

        Axios.all([walkingPromise,drivingPromise,transitPromise]).then(response=>{
            var walkingResponse = response[0].data.rows[0]["elements"][0]["duration"]["text"];
            var drivingResponse = response[1].data.rows[0]["elements"][0]["duration"]["text"];
            var transitResponse = response[2].data.rows[0]["elements"][0]["duration"]["text"];


            distanceValues.push(walkingResponse,drivingResponse,transitResponse);
            this.setState({
                walkingDistance:walkingResponse,
                drivingDistance:drivingResponse,
                transitDistance:transitResponse,
                matrixDistanceArray:distanceValues
            });
            
        });
              
            },
            error => Alert.alert(error.message),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
          );

    }

    

    directionsToBuilding = () =>{


        const {currentBuildingLat,currentBuildingLng,userLatitude,userLongitude} = this.state;

        console.log("directionsToBuilding: " + currentBuildingLat);
        console.log("directionsToBuilding: " + currentBuildingLng);



        Axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${userLatitude},${userLongitude}&destination=${currentBuildingLat},${currentBuildingLng}&key=${secretkey.secret}`)
        .then(response=>{
            var latitudeRetrieved = response.data.routes[0]['bounds']["northeast"]["lat"];
            var longitudeRetrieved = response.data.routes[0]['bounds']["northeast"]["lng"];

            var retrievedBuildingArray = [];
            var myObject = {};

            var points = polyline.decode(response.data.routes[0]["overview_polyline"]["points"]);

            

            let coords = points.map((point)=>(
                {
                    latitude:point[0],
                    longitude:point[1]
                }
            ));

            myObject["latitude"] = latitudeRetrieved;
            myObject["longitude"] = longitudeRetrieved;
            retrievedBuildingArray.push(myObject)
            

            this.setState({
                directionsLat:latitudeRetrieved,
                directionsLng:longitudeRetrieved,
                buildingCoordsArray:retrievedBuildingArray,
                coords:coords,
                loading:false
            })


        })
        .catch(error=>{
            console.log("Error: " + error);
        })
    }

    requestLocationPermissions = async()=>{
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.FINE_LOCATION,{
                title:'Cool location permission',
                message:"MY message",
                buttonNeutral:"Ask me later",
                buttonNegative:"Cancel",
                buttonPositive:"Ok"
            }
        );
    }
    _renderItemCarousel ({item, index}) {
        var distance = ""
        switch(index){
            case 0:
                distance = "Walking";
                break;
            case 1:
                distance = "Driving";
                break;
            case 2:
                distance = "Transit";
                break;
            default:
                break;
        }

        return (
            <View>
                <Text style={styles.customFont}>{distance}</Text>
                <Text style={styles.customFont}>{item}</Text>
                
            </View>
        );
    }


    _renderItem ({item}) {
        return (
            <View>
                <Text style={{fontSize:20,fontFamily:'OpenSans-Light'}}>{item}</Text>
            </View>
        );
    }

    determineLngLat = (item) =>{
        console.log(item)
        var lat = "";
        var lng = "";
        var title = "";       
        var parseItemToInt = parseInt(item);
        switch(parseItemToInt){
            case 0:
                //set variable equal to long and lat in this case
                //depending on the case statement
                lat =  52.406468;
                lng = -1.502902;
                title = "William Morris";
                console.log("in william morris: case 0");
                break;

            case 1:
                lat =  52.405918;
                lng =  -1.495950;
                title = "Engineering & Computing Building";
                break;

            case 2:
                lat = 52.406820;
                lng = -1.505230;
                title = "Ellen Terry";
                break;

            case 3:
                lat = 52.40531;
                lng = -1.50006;
                title = "George Eliot";
                break;

            case 4:
                lat = 52.408258;
                lng = -1.5032492;
                title = "Graham Sutherland";
                break;
            
            case 5:
                lat = 52.405946;
                lng = -1.5005558;
                title = "Frederick Lanchester Library";
                break;

            case 6:
                lat = 52.406468;
                lng = -1.5028871;
                title = "Jaguar";
                break;

            case 7:
                lat = 52.405314;
                lng = -1.5000631;
                title = "The Hub";
                break;
            case 8:
                lat = 52.408258;
                lng = -1.5032492;
                title = "Maurice Foss";
                break;

            case 9:
                lat = 52.405314;
                lng = -1.5000631;
                title = "James Starley";
                break;
            case 10:
                lat = 52.405314;
                lng = -1.5000631;
                title = "Priory Building";
                break;

            default:

                break;
        }

        var buildingArray = [];
        var buildingObject = {}
        buildingObject["latitude"] = lat;
        buildingObject["longitude"] = lng;
        buildingArray.push(buildingObject);
        

        this.setState({
            currentBuildingLat:lat,
            currentBuildingLng:lng,
            currentTitle:title,
            // buildingCoordsArray:buildingArray
            //need to update the polyline as well?
        },()=>{
            console.log("callback state: " + this.state.currentBuildingLat)
            console.log("callback state: " + this.state.currentBuildingLng);
        });

        //need to make function that makes 
        //request to google maps
        //and puts pointer on map
        //where the latitude and
        //longitude is
        this.directionsToBuilding();
        this.distanceMatrixRequest();
    }

    render(){

        return(
            <View style={styles.container}>
                <View style={{marginTop:30,justifyContent:'flex-start',width:Dimensions.get('window').width,paddingLeft:5}}>
                <View style={{width:Dimensions.get('window').width,marginTop:10}}>
                    <Hamburger/>
                </View>
            </View>
                
                <View style={{flex:1}}>
                    <Carousel
                    data={this.state.buildings}
                    layout={'default'}
                    layoutCardOffset={1}
                    ref={(c)=>{this._carousel = c}}
                    renderItem={this._renderItem}
                    sliderWidth={Dimensions.get('window').width}
                    itemWidth={250}
                    sliderHeight={200}
                    containerCustomStyle={{marginTop:80}}
                    onBeforeSnapToItem={(item)=>this.determineLngLat(item)}
                    />
                </View>
                <View>
                <ActivityIndicator size="large" animating={this.state.loading}/>
                </View>
                <View style={{flex:3}}>
                   <MapView
                   initialRegion={{
                    latitude: this.state.currentBuildingLat,
                    longitude: this.state.currentBuildingLng,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                        }}
                    maxZoomLevel={20}
                    style={{width:Dimensions.get('window').width,height:400}}
                    zoomEnabled
                        >
                        <Marker
                            
                            coordinate={{
                                latitude:this.state.currentBuildingLat,
                                longitude:this.state.currentBuildingLng
                            }}
                            
                            title={this.state.currentTitle}
                            />

                        <Marker

                            coordinate={{
                                latitude:this.state.userLatitude,
                                longitude:this.state.userLongitude
                            }}
                            ref={ref=>{this.mark = ref}}
                            title="You are here"

                        />

                        <Polyline
                            coordinates={this.state.coords}
		                    strokeWidth={2}
                            strokeColor="blue"
                            fillColor="rgba(255,0,0,0.5)"
                                
                        />

                    </MapView>

                </View>
                <View style={{flex:1}}>
                <Carousel
              ref={(c) => { this._carousel = c; }}
              data={this.state.matrixDistanceArray}
              renderItem={this._renderItemCarousel}
              layoutCardOffset={3}
              sliderWidth={300}
              itemWidth={200}
            />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 5,
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

export default Buildings;