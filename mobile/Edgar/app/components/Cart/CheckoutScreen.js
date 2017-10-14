
import React from 'react';
import {Component} from 'react'
import {TouchableOpacity,
		StyleSheet,
		View,
		Text,
		ScrollView,
		TouchableHighlight,
		Alert
} from 'react-native';
import {Actions} from 'react-native-router-flux'
import {connect} from 'react-redux'
import { ActionCreators } from  '../../actions'
import {bindActionCreators} from 'redux'
import {handleCheckoutCart} from '../../api/CartService'

import Icon from 'react-native-vector-icons/FontAwesome'
import CartItemDisplay from './CartItemDisplay'
import CheckoutStepIndicator from './CheckoutStepIndicator'
import CheckoutAddressSection from './Shipping/CheckoutAddressSection'
import CheckoutBillingSection from './Billing/CheckoutBillingSection'
import OrderSummarySection from './OrderSummarySection'
import LoadingSpinner from '../Misc/LoadingSpinner'

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
			addressModalVisible : false,
			billingModalVisible : false,
			selected_address : null,
			selected_address_index : null,
			selected_card : null,
			selected_card_index : null,
			shipping_price : null,
			sales_tax_price : null,
			is_loading : true
		}
		this.selectAddress = this.selectAddress.bind(this)
		this.selectCard = this.selectCard.bind(this)
		this.setLoading = this.setLoading.bind(this)
	}

	componentWillMount(){
		var user = this.props.user
		var addresses = user.addresses
		var cards = user.cards
		var addresss_set = false
		if (addresses.length > 0){
			for (var i = 0; i < addresses.length; i++){
				if (addresses[i].id == user.default_address){
					addresss_set = true
					this.selectAddress(i)
				}	
			}	
			if (!addresss_set){
				this.selectAddress(0)
			}
		}
		if (cards.length > 0){
			for (var i = 0; i < cards.length; i++){
				if (cards[i].id == user.default_card){
					this.selectCard(i)
				}	
			}	
			if (this.state.selected_card_index == null){
				this.selectCard(0)
			}
		}

		this.setLoading(false)
	}

	setLoading(is_loading){
		this.setState({is_loading : is_loading})
	}
	setAddressModalVisible(visible) {
		this.setState({addressModalVisible: visible});
	}

	setBillingModalVisible(visible){
		this.setState({billingModalVisible : visible})
	}

	async checkout() {
		if (this.state.selected_card == null) {
			Alert.alert(
				"You must select or enter a payment method first",
				"Try again",
				[
					{text : "Ok"}
				]
			)
			return
		}
		if (this.state.selected_address == null) {
			Alert.alert(
				"You must select or enter an address first",
				"Try again",
				[
					{text : "Ok"}
				]
			)
			return
		}
		var jwt = this.props.jwt
		var card_id = this.state.selected_card ? this.state.selected_card.id : null
		var address_id = this.state.selected_address ? this.state.selected_address.id : null
		this.setLoading(true)
		let data = await handleCheckoutCart(jwt, address_id, card_id)
		this.setLoading(false)
		if (data.success){
			Actions.order_confirmed()
		}		
		else {
			Alert.alert(
				data.error.title,
				data.error.text,
				[
					{text : "Ok"}
				]
			)
		}
	}

	selectAddress(index){
		if (index != this.state.selected_address_index){
			this.setLoading(true)
			this.props.loadUser(this.props.jwt, this.props.user.addresses[index]).then(() => 
				this.setLoading(false)
			)
		}
		this.setState({
			selected_address : this.props.user.addresses[index], 
			selected_address_index : index
		})
	}

	selectCard(index){
		this.setState({
			selected_card : this.props.user.cards[index], 
			selected_card_index : index
		})	
	}
	
	render() {
		return (
				<View style = {[{flex : 1}, styles.container]}>
					<LoadingSpinner visible = {this.state.is_loading}/>
					<View style = {[{flex : 9}, styles.scroll_container]}>
						<ScrollView>
							<CheckoutStepIndicator />

							<CheckoutAddressSection
							selectAddress = {this.selectAddress}
							selected_address = {this.state.selected_address}
							selected_address_index = {this.state.selected_address_index}
							user = {this.props.user} 
							jwt = {this.props.jwt} 
							loadUser = {this.props.loadUser}
							setUserInfo = {this.props.setUserInfo}
							setModal = {this.setAddressModalVisible.bind(this)}
							modal_visible = {this.state.addressModalVisible}
							setLoading = {this.setLoading}
							 />

							<CheckoutBillingSection
							selectCard = {this.selectCard}
							selected_card = {this.state.selected_card}
							selected_card_index = {this.state.selected_card_index}
							user = {this.props.user} 
							jwt = {this.props.jwt} 
							loadUser = {this.props.loadUser} 
							setUserInfo = {this.props.setUserInfo}
							setModal = {this.setBillingModalVisible.bind(this)}
							modal_visible = {this.state.billingModalVisible}
							setLoading = {this.setLoading}
							/>  
							
							<OrderSummarySection 
								user = {this.props.user}
							/>

						</ScrollView>
					</View>

					<View style= {styles.checkout_container}>
						<TouchableOpacity onPress = {this.checkout.bind(this)} style = {styles.checkout_button}>
							<Text style = {styles.checkout_text}>
								Place Your Order  <Icon name = "chevron-right" size = {20}/> 
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
		backgroundColor : 'white'
	},

	scroll_container : {
	},
	checkout_container : {
		padding: 4,
		borderTopWidth: 1,
		borderColor : 'silver',

	},
	checkout_button : {
		backgroundColor : '#D5D5D5',
		borderRadius : 6,
		paddingVertical: 16,
	},
	checkout_text : {
		textAlign : "center",
		color : '#333333',
		fontSize:  20,
	},
	
})

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutScreen);

