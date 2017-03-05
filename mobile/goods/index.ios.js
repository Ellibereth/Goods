/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Index from './app/Index'

export default class goods extends Component {
  render() {
    return (
      <View style={styles.container}>
          <View style = {styles.top_padding}/>
          <Index/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  top_padding : {
    paddingTop : 20
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});

AppRegistry.registerComponent('goods', () => goods);
