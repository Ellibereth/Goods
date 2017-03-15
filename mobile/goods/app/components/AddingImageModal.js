import React, {Component} from 'react';
import {
  StyleSheet, View, TextInput, Text, Modal, TouchableOpacity, Alert
} from 'react-native';
import ImageSubmissionScreen from './ImageSubmissionScreen'
export default class AddingImageModal extends Component {
	constructor(props) {
	super(props);
	this.state = {};
	}

	onRequestClose(){
		Alert.alert("Modal Closed")
	}
	render() {
		return (
				<Modal visible = {this.props.visible} style = {{backgroundColor : "skyblue"}}
				onRequestClose = {this.onRequestClose.bind(this)}
				animationType={"slide"}>
					<View style = {{flex : 1, paddingTop: 20, alignItems : "center"}}>
						<View style = {{flex: 4}}>
							<ImageSubmissionScreen images = {this.props.images} 
								onRemovePhotoPress = {this.props.onRemovePhotoPress}
								updateImages = {this.props.updateImages}/>
						</View>
						<View style = {{flex: 1}}>
							<TouchableOpacity onPress = {this.props.toggleImageModal}>
								<View style = {{height: 40 }}>
									<Text> 
										Return 
									</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
			)
		}
}

