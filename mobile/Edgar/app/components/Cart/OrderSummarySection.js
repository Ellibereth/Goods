import React from 'react';
import {Component} from 'react'
import {StyleSheet, Text, View} from 'react-native';
import {formatPrice} from '../../util/Format.js'
import CheckoutPriceRow from './CheckoutPriceRow'
export default class OrderSummarySection extends Component {

	constructor(props) {
		super(props)
		this.state = {	

		}
	}

	render() {
		var cart = this.props.user.cart
		return (
			<View style = {styles.container}>
				<View style = {styles.title_container}>
					<Text style=  {styles.title_text}>
						Order Summary
					</Text>
				</View>	
				{cart.items_discount ? 
					<View>
						<CheckoutPriceRow label = {"Items"} price = {'$' + formatPrice(cart.original_items_price)}/>
						<CheckoutPriceRow
						red_price = {true}
						 label = {"Discount"} price = {'-$' + formatPrice(cart.items_discount)}/>
						<CheckoutPriceRow label = {"After Discount"} price = {'$' + formatPrice(cart.items_price)}/>
					</View>
					:
					<View>
						<CheckoutPriceRow label = {"Items"} price = {'$' + formatPrice(cart.items_price)}/>
					</View>
				}

				{cart.shipping_price ? 
					<CheckoutPriceRow label = {"Shipping"} price = {'$' + formatPrice(cart.shipping_price)}/>
					: 
					<CheckoutPriceRow label = {"Shipping"} price = {"Free!"}/>
				}

				{cart.sales_tax_price ?
					<CheckoutPriceRow label = {"Sales Tax"} price = {'$' + formatPrice(cart.sales_tax_price)}/>
					:
					<View/>
				}
				<CheckoutPriceRow
					bold_text = {true}
				 	label = {"Total"} 
				 	price = {'$' + formatPrice(cart.total_price)}/>
			</View>
		
		);
  	}
}


const styles = StyleSheet.create({
	container : {
		flexDirection : 'column',
		// height : 300,
		borderColor : "silver",
		borderWidth : 1,
		margin : 8,
		padding: 8,
		marginBottom : 20,
		paddingBottom : 0,		
	},
	title_text : {
		fontSize : 20,
		fontWeight : 'bold',
	},
	title_container : {
		paddingBottom : 12,
	},
});
			





