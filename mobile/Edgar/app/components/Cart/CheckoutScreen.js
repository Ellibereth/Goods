
import React from 'react';
import {Component} from 'react'
import {TouchableOpacity,
		StyleSheet,
		View,
		Text,
		ScrollView,
		TouchableHighlight
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
		}
		this.selectAddress = this.selectAddress.bind(this)
		this.selectCard = this.selectCard.bind(this)
	}

	componentDidMount(){
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
	}
	setAddressModalVisible(visible) {
		this.setState({addressModalVisible: visible});
	}

	setBillingModalVisible(visible){
		this.setState({billingModalVisible : visible})
	}

	async checkout() {
		if (this.state.selected_card == null) {
			console.log("select a card first")
			return
		}
		if (this.state.selected_address == null) {
			console.log("select an address first")
			return
		}
		var jwt = this.props.jwt
		var card_id = this.state.selected_card ? this.state.selected_card.id : null
		var address_id = this.state.selected_address ? this.state.selected_address.id : null
		let data = await handleCheckoutCart(jwt, address_id, card_id)
		if (data.success){
			console.log("success")
		}		
		else {
			console.log(data.error)
		}
	}

	selectAddress(index){
		if (index != this.state.selected_index){
			this.props.loadUserCheckout(this.props.jwt, this.props.user.addresses[index])
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
				<View style = {styles.container}>
					
					<View style = {styles.step_indicator_container}>
						<CheckoutStepIndicator />
					</View>

					<View style = {{marginTop : 16}}/>
					
					<View style = {styles.scroll_container}>
						<ScrollView>
							<CheckoutAddressSection
							selectAddress = {this.selectAddress}
							selected_address = {this.state.selected_address}
							selected_address_index = {this.state.selected_address_index}
							user = {this.props.user} 
							jwt = {this.props.jwt} 
							loadUserCheckout = {this.props.loadUserCheckout}
							setUserInfo = {this.props.setUserInfo}
							setModal = {this.setAddressModalVisible.bind(this)}
							modal_visible = {this.state.addressModalVisible}
							 />

							<CheckoutBillingSection
							selectCard = {this.selectCard}
							selected_card = {this.state.selected_card}
							selected_card_index = {this.state.selected_card_index}
							user = {this.props.user} 
							jwt = {this.props.jwt} 
							loadUserCheckout = {this.props.loadUserCheckout} 
							setUserInfo = {this.props.setUserInfo}
							setModal = {this.setBillingModalVisible.bind(this)}
							modal_visible = {this.state.billingModalVisible}
							/>  
							
							<OrderSummarySection 
							user = {this.props.user}
							/>

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
		flex : 1,
		// backgroundColor : 'white'
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

