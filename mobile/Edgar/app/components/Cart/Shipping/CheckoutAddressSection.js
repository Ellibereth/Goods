
import React from 'react';
import {Component} from 'react'
import {ScrollView,StyleSheet, TouchableHighlight, Text, View, TextInput} from 'react-native';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import {Actions} from 'react-native-router-flux';
import AddAddressModal from './AddAddressModal'
import Icon from 'react-native-vector-icons/FontAwesome'
import CheckoutAddressDisplay from './CheckoutAddressDisplay'
import * as Animatable from 'react-native-animatable';

export default class CheckoutAddressSection extends Component {
	
	constructor(props) {
		super(props)
		this.state = {
			can_edit_address : false,
		}
	}

	toggleEditAddress(){
		if (this.state.can_edit_address) {

		}
		else {

		}
		this.setState({can_edit_address : !this.state.can_edit_address})

	}

	componentDidMount(){
		
	}

	render() {

		return (
				<View style = {styles.address_container}>
					<View style = {[{flex : 1},styles.title_container]}>
					 	<Text style=  {styles.title_text}>
					 		Shipping Address
					 	</Text>
					</View>

					<Animatable.View 
					style = {{flex : 4}}>
						{this.state.can_edit_address ?
						<View 
						  style = {[{flex : 1} ,styles.collapsible_container]}>
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
							{ this.state.can_edit_address &&
							<AddAddressModal 
							selectAddress = {this.props.selectAddress}
							setUserInfo = {this.props.setUserInfo}
							modal_visible = {this.props.modal_visible}
							setModal = {this.props.setModal}
							jwt = {this.props.jwt} 
							user = {this.props.user}
							toggleEditAddress = {this.toggleEditAddress.bind(this)}
							loadUserCheckout = {this.props.loadUserCheckout}/>
							}

						</View>
						:
						<View 
						style = {[{flex : 1}, styles.collapsible_container]}>
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
					</Animatable.View>
					
					<View style = {[{flex : 1},styles.toggle_container]}>
						<TouchableHighlight 
							style = {[{flex : 1},styles.toggle_button]}
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
		minHeight : 160,
		borderColor : "silver",
		borderWidth : 1,
		margin : 8,
		marginBottom : 0,
		paddingBottom : 0,
		
	},
	collapsible_container : {
		
	},
	
	toggle_container : {
		flexDirection : 'column'
	},
	toggle_button : {
		backgroundColor : 'silver',
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
		borderBottomWidth : 1,
		borderBottomColor : 'silver',
		marginLeft: 6,
		paddingLeft: 0,
		padding : 6,
		marginRight: 0,
	}

})



