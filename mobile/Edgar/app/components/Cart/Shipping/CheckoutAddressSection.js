
import React from 'react';
import {Component} from 'react'
import {ScrollView,StyleSheet, TouchableHighlight, Text, View, TextInput} from 'react-native';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import {Actions} from 'react-native-router-flux';
import AddAddressModal from './AddAddressModal'
import Collapsible from 'react-native-collapsible'
import Icon from 'react-native-vector-icons/FontAwesome'
import CheckoutAddressDisplay from './CheckoutAddressDisplay'

export default class CheckoutAddressSection extends Component {
	
	constructor(props) {
		super(props)
		this.state = {
			can_edit_address : false,
		}
	}

	

	toggleEditAddress(){
		this.setState({can_edit_address : !this.state.can_edit_address})
	}

	componentDidMount(){
		if (this.props.user.addresses.length == 0){
			this.props.setModal(true)
		}
	}

	
	render() {
		return (
				<View style = {styles.address_container}>
					<View style = {styles.title_container}>
					 	<Text style=  {styles.title_text}>
					 		Shipping Address
					 	</Text>
					</View>
					{
						this.state.can_edit_address ? 
						<View style = {styles.collapsible_container}>
							<ScrollView>
								{this.props.user.addresses.map((address, index) =>
									<CheckoutAddressDisplay 
									index = {index}
									key = {index}
									selectAddress = {this.props.selectAddress}
									address = {address}
									selected = {this.props.selected_address_index == index}
									/>
									)
								}
							</ScrollView>
							<AddAddressModal 
							selectAddress = {this.props.selectAddress}
							setUserInfo = {this.props.setUserInfo}
							modal_visible = {this.props.modal_visible}
							setModal = {this.props.setModal}
							jwt = {this.props.jwt} 
							toggleEditAddress = {this.toggleEditAddress.bind(this)}
							loadUserCheckout = {this.props.loadUserCheckout}/>

						</View>
						:
						<View style = {styles.collapsible_container}>
							<Text> Selected Address Display - No Editing</Text>
							{this.props.selected_address 
								?
									<View>
										<Text> {this.props.selected_address.name} </Text>
										<Text> {this.props.selected_address.address_line1} </Text>
										{this.props.selected_address.address_line2  ? <Text> {this.props.selected_address.address_line2} </Text> : <View/>}
										<Text> {this.props.selected_address.address_city}, {this.props.selected_address.address_state} {this.props.selected_address.address_zip} </Text>
									</View>
								:
									<Text> No Address Selected Yet </Text>
							}
						</View>
					}
					
					<View style = {styles.toggle_container}>
						<TouchableHighlight 
							style = {styles.toggle_button}
							onPress ={this.toggleEditAddress.bind(this)}>
							<Text style = {styles.toggle_text}>
								{this.state.can_edit_address ? "Save " : "Edit Address "}
								{this.state.can_edit_address ? 
									<Icon name = 'caret-up'/> :
									<Icon name = 'caret-down'/>
								}
							</Text>
						</TouchableHighlight>
					</View>
					
				</View>
			
			

		)
	}
}

// height will change later to variable with animated toggling
// for now fixed to get framework
const styles = StyleSheet.create({
	address_container : {
		flexDirection : 'column',
		height : 300,
		borderColor : "silver",
		borderWidth : 1,
		margin : 8,
		marginBottom : 0,
		paddingBottom : 0,
		
	},
	collapsible_container : {
		flex : 4,
	},
	
	toggle_container : {
		flex : 1,
		flexDirection : 'column'
	},
	toggle_button : {
		backgroundColor : 'silver',
		flex : 1,
		flexDirection : 'column',
		justifyContent : 'center'
	},
	toggle_text : {
		textAlign : "center",
		color : 'grey'
	},
	title_text : {
		fontSize : 20,
		fontWeight : 'bold',
	},
	title_container : {
		flex : 0.5,
		borderBottomWidth : 1,
		borderBottomColor : 'silver',
		marginLeft: 6,
		paddingLeft: 0,
		padding : 6,
		marginRight: 0,

	}

})



