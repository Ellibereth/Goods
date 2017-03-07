import React, {Component} from 'react'
import {
  Image, Text, Modal, View, Platform, Alert, TouchableOpacity, Stylesheet
} from 'react-native';

// import BarcodeScanner from 'react-native-barcodescanner';
import UniversalBarcodeScanner from './UniversalBarcodeScanner'
import AndroidBarcodeScanner from './AndroidBarcodeScanner'


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

  onBarCodeRead(code, type) {
    if (!this.state.barcode_scanned){
      this.setState({barcode_scanned : true})
      console.log('Barcode: ' + code);
      this.props.setBarcodeUpc(code, type)
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
            onRequestClose = {this.onRequestClose.bind(this)}>
        <View style = {{flex : 1, paddingTop: 20, alignItems : "center"}}>
          
          {Platform.OS == 'ios' && 
            <UniversalBarcodeScanner onBarCodeRead = {this.onBarCodeRead.bind(this)}/>
          }

          {Platform.OS == 'android' && 
            <AndroidBarcodeScanner onBarCodeRead = {this.onBarCodeRead.bind(this)}/>
          }

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
