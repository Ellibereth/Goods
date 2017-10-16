import React from 'react';
import {Component} from 'react'
import {TouchableOpacity,
		StyleSheet,
		View,
		Text,
		ScrollView,
		Modal,
		TouchableHighlight,
		Alert
} from 'react-native';
import {Actions} from 'react-native-router-flux'
import {handleAddAddress} from '../../../api/UserService'
import SimplePicker from 'react-native-simple-picker'
import Icon from 'react-native-vector-icons/FontAwesome'
import CheckoutTextInput from '../../Misc/CheckoutTextInput'
import ModalAddressForm from './ModalAddressForm'


export default class AddAddressModal extends Component {

	constructor(props) {
		super(props)
		this.state = {
			// hard coded for easier testing
			// change to all "" except country when done
			address: {
				address_name : "",
				description : "",
				address_state: "",
				address_city : "",
				address_country : "US",
				address_line1 : "",
				address_line2 : "",
				address_zip : "",
			}

		}
		this.onChangeAddress = this.onChangeAddress.bind(this)
		this.addAddress = this.addAddress.bind(this)
	}

	componentDidMount(){	
		
	}


	onChangeAddress(field, value){
		var obj = this.state.address
		obj[field] = value
		this.setState({address : obj})
	}

	async addAddress() {
		var new_index = (this.props.user.addresses.length || 0)
		var form_data = {
					jwt : this.props.jwt,
					address_name : this.state.address.address_name,
					description : this.state.address.description,
					address_state: this.state.address.address_state,
					address_city : this.state.address.address_city,
					address_country : this.state.address.address_country,
					address_line1 : this.state.address.address_line1,
					address_line2 : this.state.address.address_line2,
					address_zip : this.state.address.address_zip,
				}
		this.props.setLoading(true)
		this.props.setModal(false)
		let data = await handleAddAddress(form_data)
		if (data.success) {
			await this.props.loadUser(this.props.jwt)
			this.props.selectAddress(new_index)
			this.props.toggleEditAddress()		
			Alert.alert(
				'Success',
				"New address added",
				[	
					{text : 'Ok'}
				]
			)
		} 
		else {
			this.props.setLoading(false)
			Alert.alert(
				'Error',
				data.error.title,
				[	
					{text : 'Try Again', onPress: () => this.props.setModal(true)},
					{text : 'Never Mind'}
				]
			)
		}
	}
	
	render() {
		return (
				<View style = {styles.container}>
					<Modal
					  animationType="slide"
					  transparent={false}
					  visible={this.props.modal_visible}
					  // onRequestClose={() => {alert("Modal has been closed.")}}
					  >
						<ModalAddressForm 
							show_header = {true}
							onChangeAddress = {this.onChangeAddress}
							setModal = {this.props.setModal}
							onSubmit = {this.addAddress}
							address = {this.state.address}
						/>
						<View style = {styles.finish_button_container}>
							<TouchableOpacity style = {styles.cancel_button} 
								onPress = {() => this.props.setModal(false)}>
								<Text style = {styles.cancel_button_text}>Cancel</Text>
							</TouchableOpacity>
							<TouchableOpacity style = {styles.save_button} onPress = {this.props.onSubmit}>
								<Text style = {styles.save_button_text}>Save</Text>
							</TouchableOpacity>
						</View>
						
					</Modal>
					<TouchableHighlight 
						style = {styles.show_modal_button}
						onPress={() => {
					  this.props.setModal(true)
					}}>
						<Text style=  {styles.show_modal_button_text}>Add New Address</Text>
					</TouchableHighlight>

				</View>
			

		)
	}
}

const styles = StyleSheet.create({
	container : {
		flexDirection : 'column',
		justifyContent : 'center',
		alignItems : 'stretch'
	},
	scroll_container : {
		flex: 9,
	},
	checkout_container : {
		padding: 4,
		borderTopWidth: 1,
		borderColor : 'silver',

	},
	finish_button_container : {
		flexDirection : 'row',
	},
	save_button : {
		flex : 1,
		margin : 8,
		borderRadius : 6,
		borderWidth : 1,
		padding: 16,
		backgroundColor : 'red',
		borderColor : 'red'

	},
	save_button_text : {
		textAlign : 'center',
		color : 'white'
	},
	cancel_button : {
		flex : 1,
		margin : 8,
		borderRadius : 6,
		padding : 16,
		borderWidth : 1,
		borderColor : 'silver',
		backgroundColor : '#D5D5D5'
	}, 
	cancel_button_text : {
		textAlign : 'center',
		color : 'grey'
	},
	
	checkout_text : {
		textAlign : "center",
		color : 'white'
	},
	state_display : {
		flexDirection : 'row',
		justifyContent : 'center',
		margin : 8,
		borderColor : 'silver',
		borderWidth : 1,
		borderRadius : 4,
	},
	state_display_text : {
		padding : 8,
		backgroundColor : 'transparent'
	},
	picker_icon_container : {
		flex : 1,
		backgroundColor : '#D5D5D5',
		alignItems : 'center',
		justifyContent : 'center'
	},
	picker_icon : {
		color : 'white'
	},
	state_text_container : {
		flex: 9,
		paddingLeft: 15,
		paddingRight: 15,
		borderRadius: 5
	},
	show_modal_button : {
		paddingVertical: 12,
		borderRadius: 4,
		backgroundColor : '#D5D5D5',
		margin : 8,
	},
	show_modal_button_text : {
		color : '#333333',
		textAlign : 'center',
		fontSize : 16,
	},
	title :{
		textAlign : 'center',
		fontSize : 20,
		paddingVertical : 10

	}, 
	title_container : {
		flexDirection : 'row',
		margin : 6
	}
	
})


