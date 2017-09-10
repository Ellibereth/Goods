
import React from 'react';
import {Component} from 'react'
import {TouchableOpacity,
		Picker,
		StyleSheet,
		View,
		Text,
		Button,
		ScrollView,
		Image,
		Alert,
		Modal,
		TouchableHighlight
} from 'react-native';
import {Actions} from 'react-native-router-flux'
import {connect} from 'react-redux'
import { ActionCreators } from  '../../actions'
import {bindActionCreators} from 'redux'
import {} from '../../api/ProductApi'

import Icon from 'react-native-vector-icons/FontAwesome'
import CartItemDisplay from './CartItemDisplay'
import CheckoutStepIndicator from './CheckoutStepIndicator'
import CheckoutAddressSection from './CheckoutAddressSection'

const img_src = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"

function mapDispatchToProps(dispatch) {
	return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
	return {
		user : state.user,
		jwt : state.jwt
	}
}


class CheckoutScreen extends Component {

	constructor(props) {
		super(props)
		this.state = {
			modalVisible : false,
			selected_address : null,
			selected_address_index : null,
			// selected_billing : {}
		}
		this.selectAddress = this.selectAddress.bind(this)
	}

	componentDidMount(){	
		var user = this.props.user
		var addresses = user.addresses
		if (addresses.length > 0){
			for (var i = 0; i < addresses.length; i++){
				if (addresses[i].id == user.default_address){
					this.selectAddress(i)
				}	
			}	
		}
	}

	setModalVisible(visible) {
		this.setState({modalVisible: visible});
	}

	checkout() {
		console.log("checkout pressed")
	}

	selectAddress(index){
		this.setState({
			selected_address : this.props.user.addresses[index], 
			selected_address_index : index
		})
	}
	

	

	render() {
		return (
				<View style = {styles.container}>
					
					<View style = {styles.step_indicator_container}>
						<CheckoutStepIndicator />
					</View>

					<View style = {styles.scroll_container}>
						<ScrollView>
							<CheckoutAddressSection
							selectAddress = {this.selectAddress}
							selected_address = {this.state.selected_address}
							selected_address_index = {this.state.selected_address_index}
							user = {this.props.user} 
							jwt = {this.props.jwt} 
							loadUser = {this.props.loadUser} />
						</ScrollView>
					</View>
					



					<View style= {styles.checkout_container}>
						<TouchableOpacity onPress = {this.checkout.bind(this)} style = {styles.checkout_button}>
							<Text style = {styles.checkout_text}>
								Place Your Order  <Icon name = "chevron-right" size = {12}/> 
							</Text>
						</TouchableOpacity>
					</View> 
				</View>
		)
	}
}

const styles = StyleSheet.create({
	container : {
		flexDirection : 'column',
		flex : 1
	},
	scroll_container : {
		flex: 8,
	},
	checkout_container : {
		padding: 4,
		borderTopWidth: 1,
		borderColor : 'silver',

	},
	checkout_button : {
		backgroundColor : 'silver',
		borderRadius : 6,
		padding: 12
	},
	checkout_text : {
		textAlign : "center",
		color : 'grey'
	},
	step_indicator_container : {
		flex : 1
	}
	
})

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutScreen);

