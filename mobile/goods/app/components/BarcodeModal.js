import React, {Component} from 'react'

import {
  Image, Text, Modal, View, Platform, Alert, TouchableOpacity, Stylesheet
} from 'react-native';

import BarcodeScanner from 'react-native-barcodescanner';
import UniversalBarcodeScanner from './UniversalBarcodeScanner'


export default class BarcodeModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      torchMode: 'off',
      cameraType: 'back',
      barcode_scanned: false
    };
  }

  onOkPress () {
    this.props.toggleBarcodeModal()
    this.setState({barcode_scanned: false})
  }

  onBarCodeRead(code) {
    if (!this.state.barcode_scanned){
      this.setState({barcode_scanned : true})
      console.log('Barcode: ' + code);
      this.props.setBarcodeUpc(code)
      Alert.alert(
        'Barcode Scanned',
        code.data,
        [
          {text: 'Press Ok To Return', onPress: this.onOkPress.bind(this)
          }
        ],
        { cancelable: false }
      )
    }
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
          <UniversalBarcodeScanner onBarCodeRead = {this.onBarCodeRead.bind(this)}/>
{/*          {Platform.OS == 'android' &&
          <BarcodeScanner
            onBarCodeRead={this.barcodeReceived.bind(this)}
            style={{ width : 200, height: 200}}
            torchMode={this.state.torchMode}
            cameraType={this.state.cameraType}
            />
          }   */}
          <TouchableOpacity onPress = {this.props.toggleBarcodeModal}>
            <View style = {{height: 40 }}>
              <Text> 
                Return {this.props.visible}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}
