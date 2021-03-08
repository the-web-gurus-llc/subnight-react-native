import "react-native-gesture-handler";

import React, { Component } from 'react'
import { View, StatusBar } from "react-native";
import NavigationService from './../../Services/NavigationService'
import AppNavigator from './../../Navigators/AppNavigator'

import SafeAreaView from 'react-native-safe-area-view';

import styles from './RootScreenStyle'

export default class RootScreen extends Component {
  componentDidMount() {
    
  }
  render() {
    return (
      <>
        <StatusBar barStyle='light-content' style={{ backgroundColor: '#000' }} />
        <View style={styles.container}>
          <AppNavigator
            ref={(navigatorRef) => {
              NavigationService.setTopLevelNavigator(navigatorRef)
            }}
          />
        </View>
      </>

    )
  }
}