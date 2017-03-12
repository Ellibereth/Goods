'use-strict';
import React from 'react';
import {Component} from 'react'
import {Image, Modal, TextInput, Alert, TouchableOpacity, TouchableWithoutFeedback, Text, StyleSheet, View, ScrollView} from 'react-native';
var ImagePicker = require('react-native-image-picker');
const {CameraRoll,} = 'react'
const url = "https://whereisitmade.herokuapp.com"
const test_url = "http://0.0.0.0:5000"

import KeyboardSpacer from 'react-native-keyboard-spacer'
import BarcodeModal from './BarcodeModal'
import SubmissionFormField from './SubmissionFormField'
import Icon from 'react-native-vector-icons/FontAwesome'

//options for the image picker
var options = {
  title: 'Select an Image',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  }
};

// setCustomText(customTextProps);
// setCustomTextInput(customTextInputProps);
export default class SubmissionForm extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			product_name : "",
			manufacturer_name : "",
			contact_information : "",
			url_link: "",
			location: "",
			images : [],
			barcode_modal_visible : false,
			barcode_upc: "",
			barcode_type: "",
			origin : ""
		}
	}

	// functions that handle the state change of text input fields
	handleProductNameChange(product_name) {this.setState({product_name : product_name})}
	handleManufacturerNameChange(manufacturer_name) {this.setState({manufacturer_name : manufacturer_name})}
	handleContactInformationChange(contact_information) {this.setState({contact_information: contact_information})}
	handleUrlLinkChange(url_link) {this.setState({url_link : url_link}) }
	handleLocationChange(location) { this.setState({location : location}) }
	handleOriginChange(origin) { this.setState({origin : origin}) }
	handleAdditionalInfoChange(additional_info) { this.setState({additional_info : additional_info}) }

	// sets barcode information from the barcode scanner
	setBarcodeUpc(barcode_upc, barcode_type) {
		this.setState({barcode_upc : barcode_upc})
		// types are in form org.gs1.
		// we eliminate the first 8 
		var type = ""
		if (barcode_type.length > 8) {
			type = barcode_type.substring(8, barcode_type.length)
		} 
		this.setState({barcode_type: type})
	
	}

	// opens and closes the modal
	toggleBarcodeModal(){
		var new_visible = !this.state.barcode_modal_visible
		this.setState({barcode_modal_visible : new_visible})
	}

	// when the submit button is pressed, we submit all the form data to the server
	// then refreshes the page on success
	submitProductInformation() {
		var image_data = []
		for (var i = 0; i < this.state.images.length; i++){
			image_data.push(this.state.images[i].data)
		}
		fetch(test_url + "/addProductSubmission", {method: "POST",
		headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
			body:
			JSON.stringify(
			 {
				product_name : this.state.product_name,
				manufacturer_name : this.state.manufacturer_name,
				contact_information : this.state.contact_information,
				url_link: this.state.url_link,
				location: this.state.location,
				images: image_data,
				barcode_upc: this.state.barcode_upc,
				barcode_type: this.state.barcode_type,
				origin: this.state.origin,
				additional_info : this.state.additional_info,
			})
		})
		.then((response) => response.json())
		.then((responseData) => {
			this.refreshPage.bind(this)()
			Alert.alert("Thank you for your submission! Feel free to submit another!")
		})
		.done();
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
		    var images = this.state.images
		    var image = {
		    	source : source,
		    	data : response.data
		    }
		    images.push(image)
		    this.setState({image : image})
		  }
		});
	}

	onSubmitPress(){
		Alert.alert(
			  'Are you sure?',
			  'Click to confirm',
			  [
			    {text: 'Submit', onPress: () => this.submitProductInformation.bind(this)()},
			    {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
			  ],
			  { cancelable: false }
			  )
		
	}

	onRemovePhotoPress(i){
		Alert.alert(
			  'Are you sure?',
			  'Click to remove photo',
			  [
			    {text: 'Remove', onPress: () => this.removePhoto.bind(this)(i)},
			    {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
			  ],
			  { cancelable: false }
			  )
		
	}

	// when the form is submitted, we refresh the page, clearing all previously submitted data
	refreshPage() {
		this.setState({
			product_name : "",
			manufacturer_name : "",
			contact_information : "",
			url_link: "",
			location: "",
			cameraRollModal: false,
			images: [],
			barcode_upc: "",
			barcode_type: "",
			origin: "",
			additional_info: ""
		})
	}

	// this function removes a photo when it is clicked 
	removePhoto(i){
		console.log(i)
		var images = this.state.images.splice(i, 1)
		this.setState({images: images})
		Alert.alert("Image Removed")
	}

	render() {
		// here we get the image display from the state
		var image_display = []
		var images = this.state.images
		for (var i = 0; i < images.length; i++) {
			var image_item = (
							<View style = {{flex : 1}} key = {i}>
								<View style = {{height : 30}}>
									<TouchableOpacity onPress = {() => {this.onRemovePhotoPress.bind(this)(i)}}>
										<Icon name = "remove" size = {20}/>
									</TouchableOpacity>
								</View>
								<Image style = {{height: 40, width : 40}} source = {images[i].source}/>
							</View>
						)
			image_display.push(image_item)
		}
		console.log("submission form rendered")
		return (
				<ScrollView style = {styles.container}>
					<BarcodeModal visible = {this.state.barcode_modal_visible}
						setBarcodeUpc = {this.setBarcodeUpc.bind(this)}
						toggleBarcodeModal = {this.toggleBarcodeModal.bind(this)}
						/>
					<View style = {{padding: 20}}>
						<SubmissionFormField value = {this.state.product_name} onChange = {this.handleProductNameChange.bind(this)}
							label = "PRODUCT NAME"/>
						<SubmissionFormField value = {this.state.manufacturer_name} onChange = {this.handleManufacturerNameChange.bind(this)}
							label = "MANUFACTURER NAME"/>
						<SubmissionFormField value = {this.state.contact_information} onChange = {this.handleContactInformationChange.bind(this)}
							label = "CONTACT INFORMATION"/>
						<SubmissionFormField value = {this.state.url_link} onChange = {this.handleUrlLinkChange.bind(this)}
							label = "URL LINK"/>
						<SubmissionFormField value = {this.state.origin} onChange = {this.handleOriginChange.bind(this)}
							label = "ORIGIN"/>
						<SubmissionFormField value = {this.state.location} onChange = {this.handleLocationChange.bind(this)}
							label = "LOCATION"/>	
						<SubmissionFormField value = {this.state.additional_info} onChange = {this.handleAdditionalInfoChange.bind(this)}
							label = "ADDITIONAL INFORMATION"/>
					</View>
					<View style = {styles.image_button}>
						<TouchableWithoutFeedback onPress = {this.handleImagePickerPress.bind(this)} >
							<View>
								<Text>
									Add a photo
								</Text>
							</View>
						</TouchableWithoutFeedback>
						<View style = {{flexDirection: "column", justifyContent: "center"}}>
							{image_display}
						</View>
					</View>
					<View style = {{height : 10}}/>
					<View style = {styles.button}>
						<TouchableOpacity onPress = {this.toggleBarcodeModal.bind(this)} style = {styles.submit_button}>
							<View>
								{
								this.state.barcode_upc == "" ?
									<Text>
										Press to scan a barcode!
									</Text>	
								:
									<Text>
										Barcode Scanned!
									</Text>
								}
							</View>
						</TouchableOpacity>						
					</View>
					<View style = {{height : 10}}/>
					<View style = {styles.button}>
						<TouchableOpacity onPress = {this.onSubmitPress.bind(this)} style = {styles.submit_button}>
							<View>
								<Text>
									Submit!
								</Text>
							</View>
						</TouchableOpacity>
					</View>
					<View style = {{height : 30}}/>
					<KeyboardSpacer/>
				</ScrollView>
			)
	}
}

const styles = StyleSheet.create({
	submit_button : {
		alignSelf: "center"
	},
	image_button : {
		height : 100,
		borderWidth : 0.5,
		borderRadius : 5,
		borderColor : "black"
	},
	button : {
		height : 40,
		borderWidth : 0.5,
		borderRadius : 5,
		borderColor : "black"
	},
	container: {
		flex: 1,
		backgroundColor : "#F5FCFF",
		padding: 20,
		paddingTop : 16,
	},
	input : {flex : 1, width : 220, fontSize : 14, justifyContent : 'flex-start', paddingBottom: 0, 
	borderRadius : 5,
	borderWidth: 1,
	padding : 5
	},
	label : {flex : 0, fontSize : 12, fontWeight : 'bold', color : '#696969'},
	
});

