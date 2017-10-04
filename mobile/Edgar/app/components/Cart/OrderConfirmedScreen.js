
import React from 'react';
import {Component} from 'react'
import {TouchableHighlight, Text, View, StyleSheet} from 'react-native';
import {Actions, ActionConst} from 'react-native-router-flux'
import CheckoutStepIndicator from './CheckoutStepIndicator'

export default class OrderConfirmedScreen extends Component {
	constructor(props) {
		super(props)
		this.state = {
		}
	}

	navigateToOrders(){
		Actions.account({type : ActionConst.JUMP});
		Actions.orders();
	}
	
	render() {
		return (
			
				<View style = {styles.container}>
					<View style = {styles.step_indicator_container}>
						<CheckoutStepIndicator />
					</View>
					<Text style = {styles.non_link_text}>
						Thank you for ordering with Edgar USA
					</Text>

					<TouchableHighlight onPress = {() => Actions.home({type :  ActionConst.RESET})}>
						<Text style = {styles.link_text}>
							Click any of this to navigate to home
						</Text>

					</TouchableHighlight>

					<TouchableHighlight onPress = {this.navigateToOrders}>
						<Text style = {styles.link_text}>
							Click any of this to navigate to orders
						</Text>

					</TouchableHighlight>
				</View>
			
			

		)
	}
}

const styles = StyleSheet.create({
	container : {

	},
	link_text : {
		fontSize : 16,
		color : 'skyblue',
		padding: 12
	},
	non_link_text : {
		fontSize : 16,
		padding: 12
		
	}
})
