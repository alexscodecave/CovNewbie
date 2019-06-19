
import React from 'react';

import {Text,View,StyleSheet,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { withNavigation } from 'react-navigation';

const Hamburger = (props) =>{

    return(
        <TouchableOpacity onPress={()=>props.navigation.openDrawer()}>
        <Icon name="bars" style={{fontSize:30}}  />

        </TouchableOpacity>
        
    )

}

export default withNavigation(Hamburger);