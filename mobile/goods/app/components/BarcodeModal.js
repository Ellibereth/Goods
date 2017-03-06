import React, {Component} from 'react'

import {
  Image, Text, Modal, View, Platform, Alert, TouchableOpacity
} from 'react-native';

import BarcodeScanner from 'react-native-barcodescanner';


export default class BarcodeModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      torchMode: 'off',
      cameraType: 'back',
    };
  }

  barcodeReceived(e) {
    console.log('Barcode: ' + e.data);
    console.log('Type: ' + e.type);
    this.props.setBarcodeUps(e.data)
    this.props.toggleBarcodeModal()
  }

  onRequestClose(){
    Alert.alert("Modal Closed")
  }

  render() {
    return (
      <Modal visible = {this.props.visible} style = {{backgroundColor : "skyblue"}}
            onRequestClose = {this.onRequestClose.bind(this)}
      >

        <View style = {{flex : 1, paddingTop: 20, alignItems : "center"}}>
          {Platform.OS == 'android' &&
          <BarcodeScanner
            onBarCodeRead={this.barcodeReceived.bind(this)}
            style={{ width : 200, height: 200}}
            torchMode={this.state.torchMode}
            cameraType={this.state.cameraType}
            />
          }
          <TouchableOpacity onPress = {this.props.toggleBarcodeModal}>
            <View>
              <Text> 
                Return
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}
