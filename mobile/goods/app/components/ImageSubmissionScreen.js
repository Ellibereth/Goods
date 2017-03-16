import React, {Component} from 'react';
import {
  StyleSheet, View, TextInput, Text, TouchableWithoutFeedback, TouchableOpacity, Image
} from 'react-native';
var ImagePicker = require('react-native-image-picker');
import PhotoGrid from 'react-native-photo-grid'

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

	handleImagePress(isDefualtImage, id){
		if (isDefualtImage) {
			this.handleImagePickerPress.bind(this)()
		}
		else {
			this.props.onRemovePhotoPress.bind(this)(id)
		}

	}
	// this handles on picker press
	handleImagePickerPress(){
		console.log("image picker pressed")
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
	renderHeader() {
		return(
		  <Text>I'm on top!</Text>
		);
	  }

	renderItem(item, itemSize) {
		return(
			<TouchableOpacity
				key = { item.id }
				style = {{ width: 100, height: 100, borderWidth : 2 }}
				onPress = {() => {this.handleImagePress.bind(this)(item['isDefault'], item['id'])}}>
				<View style = {{flex : 1, alignItems: "center", justifyContent: "center"}} key = {item.id}>
					{item['isDefault'] ? 
						<Image style = {{height: 95, width : 95}} source = {require('../static/images/default.png')}/>
					:
						<Image style = {{height: 95, width : 95}} source = {{uri: item['source']['uri']}}/>
					}
				</View>
			</TouchableOpacity>
		)
	}

	render() {
		// here we get the image display from the state
		var images = this.props.images
		var filled_images = []
		for (var i = 0; i < 6; i++){
			if (i < images.length){
				var this_image = {'id' : i, 'isDefault' : false, 'source' : images[i].source}
			}
			else {
				var this_image = {'id' : i, 'isDefault' : true}
			}
			filled_images.push(default_image)
		}

		return (
			<View>
				<PhotoGrid
					data = { filled_images }
					itemsPerRow = { 3 }
					itemMargin = { 1 }
					renderHeader = { this.renderHeader }
					renderItem = { this.renderItem.bind(this) }
				  />
			</View>
			);
		}
}

const styles = StyleSheet.create({
	image_button : {
		height : 40,
		borderWidth : 0.5,
		borderRadius : 5,
		borderColor : "black"
	},
});