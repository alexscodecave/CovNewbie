/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,Dimensions,TouchableOpacity} from 'react-native';
import {Card} from 'react-native-elements';
import {createDrawerNavigator,createAppContainer} from 'react-navigation';
import Activities from './Components/dynamic/Activities';
import Restaurants from './Components/dynamic/Restaurants';
import Timetable from './Components/dynamic/Timetable';
import Buildings from './Components/dynamic/Buildings';
import Hamburger from './Components/static/hamburger';
import ContactPage from './Components/dynamic/ContactPage';
import Icon from 'react-native-vector-icons/FontAwesome';
type Props = {};
class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Fresh</Text>
        
        <View style={{flexDirection:'row',justifyContent:'flex-start',width:Dimensions.get('window').width}}>
        <View style={{width:Dimensions.get('window').width,paddingLeft:5}}>
        <Hamburger/>
        </View>
        </View>
        

        <TouchableOpacity onPress={()=>this.props.navigation.navigate('Buildings')}>
        <Card image={require('./assets/images/engineering.jpg')} imageStyle={{width:Dimensions.get('window').width}} containerStyle={{width:Dimensions.get('window').width,alignItems:'center',height:200}}>
          <Text style={{fontFamily:'OpenSans-Light',textAlign:'center'}}>Locate your university buildings</Text>
        </Card>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>this.props.navigation.navigate('Timetable')}>
        <Card image={require('./assets/images/timetable.jpg')} imageStyle={{width:Dimensions.get('window').width}} containerStyle={{width:Dimensions.get('window').width,height:200}}>
          <Text style={{fontFamily:'OpenSans-Light',textAlign:'center'}}>View your timetable</Text>
        </Card>
        </TouchableOpacity>
        {/* <Card image={require('./assets/images/activity.jpg')} imageStyle={{width:Dimensions.get('window').width}} containerStyle={{width:Dimensions.get('window').width,alignItems:'center',height:200}}>
          <Text style={{fontFamily:'OpenSans-Light',textAlign:'center'}}>View activities near you</Text>
        </Card> */}
        <TouchableOpacity onPress={()=>this.props.navigation.navigate('Restaurants')}>
        <Card image={require('./assets/images/nandos.jpg')} imageStyle={{width:Dimensions.get('window').width}} containerStyle={{width:Dimensions.get('window').width,alignItems:'center',height:200}}>
          <Text style={{fontFamily:'OpenSans-Light',textAlign:'center'}}>View places to eat near you</Text>
        </Card>
        </TouchableOpacity>
      </View>
    );
  }
}

const drawerNavigator = createDrawerNavigator({
  Home:App,
  Activities:Activities,
  Timetable:Timetable,
  Restaurants:Restaurants,
  Buildings:Buildings,
  ContactPage:ContactPage,
},{
  contentOptions:{
    labelStyle:{
      fontFamily:'OpenSans-Light',
      fontWeight:'normal'
    },
  },
  drawerWidth:200
})

const myAppContainer = createAppContainer(drawerNavigator)

export default myAppContainer;

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
});
