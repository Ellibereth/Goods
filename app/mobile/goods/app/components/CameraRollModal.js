import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  CameraRoll,
  Modal
} from 'react-native';
// import CameraRollPicker from 'react-native-camera-roll-picker';
var ImagePicker = require('react-native-image-picker');


export default class CameraRollModal extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      images: []
    }
  }

  render() {
    return (
      <Modal visible = {this.props.visible}
          animationType={"slide"}
          transparent={false}
          onRequestClose={() => {alert("Modal has been closed.")}}>
            
            <ImagePicker />
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  imageGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  image: {
    width: 100,
    height: 100,
    margin: 10,
  },
});