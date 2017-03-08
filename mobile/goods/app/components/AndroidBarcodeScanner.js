import React, {Component} from 'react';
import {
  View,
} from 'react-native';

import BarcodeScanner from 'react-native-barcodescanner';

export default class AndroidBarcodeScanner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      torchMode: 'off',
      cameraType: 'back',
    };
  }
  // barcode received listener
  barcodeReceived(e) {
    console.log('Barcode: ' + e.data);
    console.log('Type: ' + e.type);
    this.props.onBarCodeRead(e.data, e.type)
  }
  render() {
    return (
       <View style = {{flex : 1, paddingTop: 20, alignItems : "center"}}>
          <BarcodeScanner
                onBarCodeRead={this.barcodeReceived.bind(this)}
                style={{ width : 200, height: 200}}
                torchMode={this.state.torchMode}
                cameraType={this.state.cameraType}
                />
        </View>
    );
  }
}