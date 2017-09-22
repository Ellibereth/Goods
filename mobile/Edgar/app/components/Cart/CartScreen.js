
import React from 'react';
import {Component} from 'react'
import {TouchableOpacity,
		StyleSheet,
		View,
		Text,
		ScrollView,
} from 'react-native';
import {Actions} from 'react-native-router-flux'
import {connect} from 'react-redux'
import { ActionCreators } from  '../../actions'
import {bindActionCreators} from 'redux'
import Icon from 'react-native-vector-icons/FontAwesome'
import CartItemDisplay from './CartItemDisplay'
import CheckoutStepIndicator from './CheckoutStepIndicator'
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


class CartScreen extends Component {
	
	constructor(props) {
		super(props)
		this.state = {
		}	
	}

	render() {
		if (this.props.user){
			var cart_items = this.props.user.cart.items.map((item, index) => 
				<CartItemDisplay item = {item} key = {index}
				setUserInfo = {this.props.setUserInfo}
				jwt = {this.props.jwt}/>
			)	
		}
		else {
			var cart_items = <View><Text>No Items in Cart</Text></View>
		}
		
		return (
				<View style = {styles.container}>
					<View style = {styles.step_indicator_container}>
						<CheckoutStepIndicator />
					</View>

					<View style = {{marginTop : 16}}/>

					<View style = {styles.scroll_container}>
						<ScrollView>
							{cart_items}
							<OrderSummarySection 
							user = {this.props.user}
							/>
						</ScrollView>
					</View>
					<View style= {styles.checkout_container}>
						<TouchableOpacity onPress = {()=>Actions.checkout()} style = {styles.checkout_button}>
							<Text style = {styles.checkout_text}>
								Checkout  <Icon name = "chevron-right" size = {16}/> 
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
		backgroundColor : "white"
	},
	scroll_container : {
		flex: 8,
	},
	checkout_container : {
		flex : 1,
		padding: 4,
		borderTopWidth: 1,
		borderColor : 'silver',
		backgroundColor : '#f0f0f0'
	},
	checkout_button : {
		flex: 1, 
		backgroundColor : 'red',
		borderRadius : 6,
		padding: 12,
		flexDirection : 'column',
		justifyContent : 'center',
	},
	checkout_text : {
		textAlign : "center",
		color : 'white',
		fontSize : 16
	},
	step_indicator_container : {
		flex : 1
	}
	
})

export default connect(mapStateToProps, mapDispatchToProps)(CartScreen);

