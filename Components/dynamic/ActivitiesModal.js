import React from 'react';
import {Text,View,StyleSheet,TouchableOpacity,Dimensions} from 'react-native';
import Modal from 'react-native-modal';
import Axios from 'axios';
import ticketMasterConsumer from '../../assets/API/important';
import {Card} from 'react-native-elements';

class ActivitiesModal extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            eventURL:'',
            eventType:'',
            eventMin:0,
            eventMax:0
        }
    }

    retrieveEventDetails = () =>{
        Axios.get(`https://app.ticketmaster.com/discovery/v2/events/${this.props.eventID}?apikey=${ticketMasterConsumer.ticketMasterConsumer}`)
        .then(response=>{
            console.log(response.data)
            // this.setState({
            //     eventURL:response.data.url,
            //     eventType:priceRangesType,
            //     eventMin: priceMin,
            //     eventMax:priceMax
            // });
            alert(this.props.eventID);

        })
        .catch(error=>{
            console.log("Error: " + error);
        })
    }

    componentDidMount(){
        this.retrieveEventDetails();
    }

    renderEventInformation = () =>{
        const {eventURL,eventType,eventMin,eventMax} = this.state;
        return(
            <Card>
                <Text>{eventURL}</Text>
                <Text>{eventType}</Text>
                <Text>{eventMin}</Text>
                <Text>{eventMax}</Text>
            </Card>
        )
    }

    render(){
        
        return(
            <View style={styles.container}>

                    <View style={{height:'80%',width:Dimensions.get('window').width,backgroundColor:'white'}}>
                    <Modal isVisible={this.props.modalIsVisible}>
                    <View style={{backgroundColor:'white',height:'80%',width:'95%',}}>
                        <Text style={styles.customFont}>Activities modal text</Text>
                        {this.renderEventInformation()}
                        </View>
                    </Modal>
                    </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    customFont:{
        fontFamily:'OpenSans-Light'
    }
})

export default ActivitiesModal;