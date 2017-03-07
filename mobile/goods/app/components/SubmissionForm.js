'use-strict';
import React from 'react';
import {Component} from 'react'
import {Image, Modal, TextInput, Alert, TouchableOpacity, TouchableWithoutFeedback, Text, ActivityIndicator, NetInfo, AsyncStorage, Platform, AppState, AppRegistry, StyleSheet, TabBarIOS, View} from 'react-native';
var ImagePicker = require('react-native-image-picker');
const {CameraRoll,} = 'react'
const url = "https://whereisitmade.herokuapp.com"
const test_url = "http://0.0.0.0:5000"

import BarcodeModal from './BarcodeModal'

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
			image_source : "",
			image_data : "",
			barcode_modal_visible : false,
			barcode_upc: "",
			barcode_type: ""
		}
	}

	handleProductNameChange(product_name) {
		this.setState({product_name : product_name})
	}
	handleManufacturerNameChange(manufacturer_name) {
		this.setState({manufacturer_name : manufacturer_name})
	}
	handleContactInformationChange(contact_information) {
		this.setState({contact_information: contact_information})
	}
	handleUrlLinkChange(url_link) {
		this.setState({url_link : url_link})
	}
	handleLocationChange(location) {
		this.setState({location : location})
	}
	handleOriginChange(location) {
		this.setState({origin : origin})
	}
	handleAdditionalInfoChange(additional_info) {
		this.setState({additional_info : additional_info})
	}

	setBarcodeUpc(barcode_upc) {
		this.setState({barcode_upc : barcode_upc.data})

		// types are in form org.gs1.
		// we eliminate the first 8 
		var type = ""
		if (barcode_upc.type.length > 8) {
			type = barcode_upc.type.substring(8, barcode_upc.type.length)
		} 
		this.setState({barcode_type: type})
	
	}

	toggleBarcodeModal(){
		var new_visible = !this.state.barcode_modal_visible
		this.setState({barcode_modal_visible : new_visible})
	}

	submitProductInformation() {
		console.log("submit to api")
		fetch(url + "/userSubmitProductInformation", {method: "POST",
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
				image_data: this.state.image_data,
				barcode_upc: this.state.barcode_upc,
				barcode_type: this.state.barcode_type,
				origin: this.state.origin,
				additional_info : this.state.additional_info
			})
		})
		.then((response) => response.json())
		.then((responseData) => {
			this.refreshPage.bind(this)()
			Alert.alert("Thank you for your submission! Feel free to submit another!")
		})
		.done();
	}


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

		    this.setState({
		      image_source : source,
		      image_data: response.data
		    });
		  }
		});
	}

	refreshPage() {
		this.setState({product_name : "",
			manufacturer_name : "",
			contact_information : "",
			url_link: "",
			location: "",
			cameraRollModal: false,
			image_source : "",
			image_data : "",
			barcode_upc: "",
			barcode_type: "",
			origin: "",
			additional_info: ""
		})
	}


	render(){
		return (
				<View style = {styles.container}>
					<BarcodeModal visible = {this.state.barcode_modal_visible}
						setBarcodeUpc = {this.setBarcodeUpc.bind(this)}
						toggleBarcodeModal = {this.toggleBarcodeModal.bind(this)}
						/>

					<View style = {{flex : 0.025}}/>
					<View style = {{flex : 0.7, padding: 20}}>
							<View style = {{flex: 1}}>
								<Text style={styles.label}> PRODUCT NAME</Text>
								<TextInput value ={this.state.product_name} onChangeText = {this.handleProductNameChange.bind(this)}
												style = {styles.input}/>
								<View style = {{flex : 0.2}}/>
							</View>
							<View style = {{flex: 1}}>
								<Text style={styles.label}> MANUFACTURER NAME</Text>
								<TextInput value = {this.state.manufacturer_name} onChangeText = {this.handleManufacturerNameChange.bind(this)}
												style = {styles.input}/>
								<View style = {{flex : 0.2}}/>
							</View>
							<View style = {{flex: 1}}>
								<Text style={styles.label}> CONTACT INFOMRATION</Text>
								<TextInput value = {this.state.contact_information} onChangeText = {this.handleContactInformationChange.bind(this)}
												style = {styles.input}/>
								<View style = {{flex : 0.2}}/>
							</View>
							<View style = {{flex: 1}}>
								<Text style={styles.label}> URL LINK (OPTIONAL) </Text>
								<TextInput value = {this.state.url_link} onChangeText = {this.handleUrlLinkChange.bind(this)}
												style = {styles.input}/>
								<View style = {{flex : 0.2}}/>
							</View>
							<View style = {{flex: 1}}>
								<Text style={styles.label}> LOCATION</Text>
								<TextInput value = {this.state.location} onChangeText = {this.handleLocationChange.bind(this)}
												style = {styles.input}/>
								<View style = {{flex : 0.2}}/>
							</View>
							<View style = {{flex: 1}}>
								<Text style={styles.label}> ORIGIN</Text>
								<TextInput value ={this.state.origin} onChangeText = {this.handleOriginChange.bind(this)}
												style = {styles.input}/>
								<View style = {{flex : 0.2}}/>
							</View>
							<View style = {{flex: 1}}>
								<Text style={styles.label}> ADDITIONAL INFORMATION</Text>
								<TextInput value ={this.state.additional_info} onChangeText = {this.handleAdditionalInfoChange.bind(this)}
												style = {styles.input}/>
								<View style = {{flex : 0.2}}/>
							</View>

					</View>


					<View style = {{flex:0.1}}>
						<TouchableWithoutFeedback onPress = {this.handleImagePickerPress.bind(this)}>
							<View>
								<Text>
									Add a photo
								</Text>
							</View>
						</TouchableWithoutFeedback>
						{this.state.image_source != "" &&
							<View>
								<Image style = {{height: 30, width : 30}} source = {this.state.image_source} />
							</View>
						}
					</View>

					<View style = {{flex : 0.1}}>
						<TouchableOpacity onPress = {this.toggleBarcodeModal.bind(this)}>
							<View>
								<Text>
									Press to scan a barcode!
								</Text>
							</View>
						</TouchableOpacity>
						
						{this.state.barcode_upc &&
							<View>
								<Text>
									UPC :  {this.state.barcode_upc}
								</Text>
							</View>
						}
					</View>

					<View style = {{flex:0.1}}>
						<TouchableOpacity onPress = {this.submitProductInformation.bind(this)}>
							<View>
								<Text>
									Submit!
								</Text>
							</View>
						</TouchableOpacity>
					</View>
				</View>
			
			)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor : "#F5FCFF"
	},
	input : {flex : 1, width : 220, fontSize : 14, justifyContent : 'flex-start', paddingBottom: 0, 
	borderRadius : 5,
	borderWidth: 1,
	padding : 5
	},
	label : {flex : 0, fontSize : 12, fontWeight : 'bold', color : '#696969'},
	
});

