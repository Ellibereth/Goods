import React, {Component} from 'react';
import {
  StyleSheet, View, TextInput, Text, TouchableWithoutFeedback, TouchableOpacity, Image
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
var ImagePicker = require('react-native-image-picker');

//options for the image picker
var options = {
  title: 'Select an Image',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  }
};


export default class ImageSubmissionScreen extends Component {
	constructor(props) {
	super(props);
	this.state = {};
	}

	// this handles on picker press
	handleImagePickerPress(){
		/**
		 * The first arg is the options object for customization (it can also be null or omitted for default options),
		 * The second arg is the callback which sends object: response (more info below in README)
		 */
		ImagePicker.showImagePicker(options, (response) => {
			// console.log('Response = ', response);

			if (response.didCancel) {
				console.log('User cancelled image picker');
			}
			else if (response.error) {
				console.log('ImagePicker Error: ', response.error);
			}
			else if (response.customButton) {
				console.log('User tapped custom button: ', response.customButton);
			}
			else {
				// console.log(response.uri)
				let source = { uri: response.uri };
				// You can also display the image using data:
				// let source = { uri: 'data:image/jpeg;base64,' + response.data };
				var images = this.props.images
				var image = {
				  source : source,
				  data : response.data
			  }

			  
			  images.push(image)
			  this.props.updateImages(images)
			}
		});
	}

	render() {
		// here we get the image display from the state
		var image_display = []
		var images = this.props.images
		for (var i = 0; i < images.length; i++) {
			var image_item = (
				<View style = {{flex : 1}} key = {i}>
					<View style = {{height : 30}}>
						<TouchableOpacity onPress = {() => {this.props.onRemovePhotoPress(i)}}>
							<Icon name = "remove" size = {20}/>
			  			</TouchableOpacity>
					</View>
					<Image style = {{height: 40, width : 40}} source = {images[i].source}/>
			  	</View>
			)
			image_display.push(image_item)
		}
		return (
			<View>
				<View style = {styles.image_button}>
					<TouchableWithoutFeedback onPress = {this.handleImagePickerPress.bind(this)} >
						<View>
							<Text>
								Add a photo
							</Text>
						</View>
					</TouchableWithoutFeedback>
				</View>
				<View style = {{flexDirection: "column", justifyContent: "center"}}>
					<Text>
						Below are your images
					</Text>	
					{image_display}
				</View>
			</View>
			);
		}
}

const styles = StyleSheet.create({
	image_button : {
		height : 100,
		borderWidth : 0.5,
		borderRadius : 5,
		borderColor : "black"
	},
});