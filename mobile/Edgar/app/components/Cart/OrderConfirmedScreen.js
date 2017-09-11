
import React from 'react';
import {Component} from 'react'
import {TouchableHighlight, Text, View, Button, StyleSheet} from 'react-native';
import {Actions, ActionConst} from 'react-native-router-flux'


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

					{/* 
					<Text style = {styles.non_link_text}>Click 
						<Text onPress = {() => Actions.home({type : 'reset'})}
						 style = {styles.link_text}> here
						</Text> 
						{' to return to the home page'}
					</Text>

					<Text style = {styles.non_link_text}>Click 
						<Text onPress = {this.navigateToOrders}
						 style = {styles.link_text}> here 
						</Text>
						{' to view order details'}
					</Text> */}

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




