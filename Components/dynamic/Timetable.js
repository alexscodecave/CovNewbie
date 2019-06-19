import React from 'react';


import {Text,View,StyleSheet,TouchableOpacity} from 'react-native';

class Timetable extends React.Component{

    static navigationOptions = {
        drawerLabel:()=>null
    }

    constructor(props){
        super(props);

        this.state = {

        }
    }


    render(){
        return(
            <View style={styles.container}>
                <View>
                    <Text style={{fontSize:30,fontFamily:'OpenSans-Light',textAlign:'center',position:'absolute',top:15}}>Timetable</Text>
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
  });

export default Timetable;