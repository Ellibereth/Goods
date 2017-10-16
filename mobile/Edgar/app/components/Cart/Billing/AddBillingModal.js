import React from 'react';
import {Component} from 'react'
import {TouchableOpacity,
		StyleSheet,
		View,
		Text,
		ScrollView,
		Modal,
		TouchableHighlight,
		Alert,
} from 'react-native';
import {Actions} from 'react-native-router-flux'
import {handleAddBilling} from '../../../api/UserService'
import SimplePicker from 'react-native-simple-picker'
import Icon from 'react-native-vector-icons/FontAwesome'
import CheckoutTextInput from '../../Misc/CheckoutTextInput'
import ModalAddressForm from '../Shipping/ModalAddressForm'
import ModalCreditCardForm from './ModalCreditCardForm'


export default class AddBillingModal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			// hard coded for easier testing
			// change to all "" except country when done
			address : {
				address_name : "",
				description : "",
				address_state: "",
				address_city : "",
				address_country : "US",
				address_line1 : "",
				address_line2 : "",
				address_zip : "",	
			},
			card : {
				number : "",
				cvc : "",
				exp_month : "",
				exp_year : "",
				name: ""

			}
			
		}
		this.onChangeCard = this.onChangeCard.bind(this)
		this.onChangeAddress = this.onChangeAddress.bind(this)
	}

	onChangeCard(field, value){
		var obj = this.state.card
		obj[field] = value
		this.setState(obj)
	}



	onChangeAddress(field, value){
		var obj = this.state.address
		obj[field] = value
		this.setState({address : obj})
	}


	async addBilling() {
		var new_index = (this.props.user.cards.length || 0)
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
				number : this.state.card.number,
				cvc : this.state.card.cvc,
				exp_month : this.state.card.exp_month,
				exp_year : this.state.card.exp_year,
				name: this.state.card.name
			}
		this.props.setLoading(true)
		this.props.setModal(false)
		let data = await handleAddBilling(form_data)
		console.log(data)
		if (data.success) {
			await this.props.loadUser(this.props.jwt)
			this.props.selectCard(new_index);
			this.props.toggleEditBilling()
			this.props.setLoading(false)
			// add alert 
		} 

		else {
			this.props.setLoading(false)
			// need an alert on error
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

	onCreditCardChange(data){
		var values = data.values
		this.setState({
			number : values.number,
			expiry: values.expiry,
			cvc : values.cvc
		})
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
							<View style={{marginTop: 22}}>
								<View style=  {styles.title_container}>
									<View style = {{flex : 1}}/>
									<View style = {{flex : 4}}>
										<Text style = {styles.title}> 
											Add Payment Method
										</Text>
									</View>
									<View style = {{flex : 1, flexDirection : "row", 
										justifyContent : 'flex-end', alignItems : 'center'}}>
										<Icon name = {"close"}
										style = {{padding : 6}}
										size = {16}
										onPress = {() => this.props.setModal(false)}
										/>
									</View>
								</View>
								<ScrollView>
										<ModalCreditCardForm
											card = {this.state.card}
											onChangeCard = {this.onChangeCard}
										 />


										<View>
											<View style = {{paddingBottom : 10, paddingTop: 10}}>
												<View style = {styles.heading_container}>
													<Text style = {styles.heading_text}>
														Billing address
													</Text>
												</View>
											</View>
											<ModalAddressForm
												show_header = {false}

												onChangeAddress = {this.onChangeAddress}
												setModal = {this.props.setModal}
												onSubmit = {this.addAddress}
												address = {this.state.address}
											/>
										</View>



										<View style = {styles.finish_button_container}>
											<TouchableOpacity style = {styles.cancel_button} 
												onPress = {() => this.props.setModal(false)}>
												<Text style = {styles.cancel_button_text}>Cancel</Text>
											</TouchableOpacity>
											<TouchableOpacity style = {styles.save_button} onPress = {this.addBilling.bind(this)}>
												<Text style = {styles.save_button_text}>Save</Text>
											</TouchableOpacity>
										</View>
										<View style= {{paddingBottom : 50}}/>
								</ScrollView>
							</View>
						</Modal>
						<TouchableHighlight 
							style = {styles.show_modal_button}
							onPress={() => {
						  this.props.setModal(true)
						}}>
							<Text style=  {styles.show_modal_button_text}>Add New Payment Method</Text>
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
	heading_container : {
		paddingVertical : 8,
		marginHorizontal : 12,
		borderBottomWidth : 1,
		borderBottomColor : '#D5D5D5',
	},
	heading_text : {
		fontSize : 18,
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
		borderColor : '#D5D5D5',
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
  		margin : 6,
  		marginBottom : 0,
  		paddingBottom : 10,
  		borderBottomWidth : 1,
  		borderBottomColor : "#D5D5D5"
  	}
	
})


