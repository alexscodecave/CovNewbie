import React from 'react';
import {Text,View,StyleSheet,TouchableOpacity,FlatList,Dimensions,ActivityIndicator} from 'react-native';
import Axios from 'axios';
import ticketMasterConsumer from '../../assets/API/important';
import {Card} from 'react-native-elements';
import ActivitiesModal from '../dynamic/ActivitiesModal';

class Activities extends React.Component{

    static navigationOptions = {
        title:'Activities near you'
    }

    constructor(props){
        super(props);

        this.state = {
            data:[],
            loading:true,
            showModal:false,
            chosenEventID:''
        }
    }

    retrieveTicketMasterInformation = () =>{
        //get current users location
        Axios.get(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=${ticketMasterConsumer.ticketMasterConsumer}`)
        .then(response=>{
            console.log(response.data._embedded.events[0]); //gets first event

            var tmEvents = response.data._embedded.events;
            console.log(tmEvents[0].id);
            var dataArray = [];
            dataArray.push(tmEvents);

            this.setState({
                data:tmEvents,
                loading:false
            });

            console.log(this.state.data);

        })
        .catch(error=>{
            console.log("Error retrieving ticket master: " + error);
        })
    }

    componentDidMount(){
        this.retrieveTicketMasterInformation();
    }

    showModal = (item) =>{ 
        console.log("showModalRan")
        console.log(item);
        this.setState({
            showModal:true,
            chosenEventID:item
        });
    }

    _keyExtractor = (item) => item.id;

    _renderItem = ({item})=>{
        var cardImage = item.images[0]["url"];
        var itemID = item.id;
        return(
            <TouchableOpacity onPress={()=>this.showModal(item)}>
        <Card image={{uri:cardImage}} imageStyle={{width:'100%'}}>
            
            <Text style={[styles.customFont,{color:'black',textAlign:'center'}]}>{item.name}</Text>
            
        </Card>
        </TouchableOpacity>
        )
    }


    render(){
        return(
            <View style={styles.container}>
                <Text>Activities page</Text>
                <ActivityIndicator animating={this.state.loading} style={{marginTop:20}} size="large"/>
                <FlatList
                    keyExtractor={this._keyExtractor}
                    key={(item,index)=>item[index].id}
                    style={{height:Dimensions.get('window').height,width:Dimensions.get('window').width}}
                    data={this.state.data}
                    renderItem={(item)=>this._renderItem(item)}

                />

                <ActivitiesModal 
                    modalIsVisible={this.state.showModal} 
                    eventID={this.state.chosenEventID}
                    />
                
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

export default Activities;