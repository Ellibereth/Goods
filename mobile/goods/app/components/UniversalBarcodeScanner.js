import React, {Component} from 'react'

import {
  Image, Text, Modal, View, Platform, Alert, TouchableOpacity, StyleSheet
} from 'react-native';

import BarcodeScanner from 'react-native-barcode-scanner-universal'


export default class BarcodeModal extends Component {

  onBarCodeRead(code){
      this.props.onBarCodeRead(code)
  }

  render () {
    let scanArea = null
    if (Platform.OS === 'ios') {
      scanArea = (
        <View style={styles.rectangleContainer}>
          <View style={styles.rectangle} />
        </View>
      )
    }

    return (
      <BarcodeScanner
        onBarCodeRead={this.onBarCodeRead.bind(this)}
        style={styles.camera}>
        {scanArea}
      </BarcodeScanner>
    )
  }
}

const styles = StyleSheet.create({
  camera: {
    flex: 1
  },
  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  rectangle: {
    height: 250,
    width: 250,
    borderWidth: 2,
    borderColor: '#00FF00',
    backgroundColor: 'transparent'
  }
})