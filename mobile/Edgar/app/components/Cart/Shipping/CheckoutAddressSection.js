
import React from 'react';
import {Component} from 'react'
import {
	ScrollView,
	StyleSheet,
	TouchableHighlight,
	Text,
	View,
	TextInput,
	Alert
} from 'react-native';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import {Actions} from 'react-native-router-flux';
import AddAddressModal from './AddAddressModal'
import Icon from 'react-native-vector-icons/FontAwesome'
import CheckoutAddressDisplay from './CheckoutAddressDisplay'
import * as Animatable from 'react-native-animatable'
import {toTitleCase} from '../../../util/Format'

export default class CheckoutAddressSection extends Component {
	
	constructor(props) {
		super(props)
		this.state = {
			can_edit_address : false,
		}
	}

	toggleEditAddress(){
		var can_edit_address = this.state.can_edit_address
		if (can_edit_address) {
			if (this.props.selected_address_index == null) {
				Alert.alert(
					'Error',
					'You must select or add an address first',
					[
						{text: 'OK', onPress: () => console.log('OK Pressed')},
				  	],
				  { cancelable: false }
				)
			}	
			else {
				this.setState({can_edit_address : !can_edit_address})	
			}
		}
		else {
			this.setState({can_edit_address : !can_edit_address})
		}
	}

	componentDidMount(){
		if (this.props.selected_address_index == null){
			this.setState({can_edit_address : true})
		}
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
						<View style = {[{flex : 1} ,styles.collapsible_container]}>
						  	{this.props.user.addresses.length > 0 &&
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
							}
							{ this.state.can_edit_address &&
							<AddAddressModal 
							setLoading = {this.props.setLoading}
							selectAddress = {this.props.selectAddress}
							setUserInfo = {this.props.setUserInfo}
							modal_visible = {this.props.modal_visible}
							setModal = {this.props.setModal}
							jwt = {this.props.jwt} 
							user = {this.props.user}
							toggleEditAddress = {this.toggleEditAddress.bind(this)}
							loadUser = {this.props.loadUser}/>
							}

						</View>
						:
						<View 
						style = {[{flex : 1}, styles.collapsible_container]}>
							{this.props.selected_address 
								&&
									<View style = {{flexDirection : 'row'}}>
										<View style = {{flex : 4}}> 
											<Text> {toTitleCase(this.props.selected_address.name)} </Text>
											<Text> {toTitleCase(this.props.selected_address.address_line1)} </Text>
											{this.props.selected_address.address_line2  ? <Text> {toTitleCase(this.props.selected_address.address_line2)} </Text> : <View/>}
											<Text> {toTitleCase(this.props.selected_address.address_city)}, {this.props.selected_address.address_state} {this.props.selected_address.address_zip} </Text>
										</View>
										<View style = {{flex: 1,  alignItems : "center", justifyContent : "center"}}>
											<Icon name = "circle"/>
										</View>	
									
									</View>
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
									<Icon name = 'chevron-up'/> :
									<Icon name = 'chevron-down'/>
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
		minHeight : 120,
		borderColor : "silver",
		borderWidth : 1,
		marginHorizontal : 8,
		marginTop : 0,
		paddingBottom : 0,
		marginBottom : 10,
			
	},
	collapsible_container : {
		padding : 4,
	},
	
	toggle_container : {
		flexDirection : 'column',
		height: 40,
	},
	toggle_button : {
		backgroundColor : '#D5D5D5',
		flexDirection : 'column',
		justifyContent : 'center'
	},
	toggle_text : {
		textAlign : "center",
		color : '#4d4d4d',
	},
	title_text : {
		fontSize : 16,
		fontWeight : 'bold',
	},
	title_container : {
		borderBottomWidth : 1,
		borderBottomColor : 'silver',
		marginLeft: 8,
		paddingLeft: 0,
		paddingRight : 8,
		marginRight: 0,
		paddingVertical : 12,
	}

})



