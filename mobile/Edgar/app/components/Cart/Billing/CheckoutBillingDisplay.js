
import React from 'react';
import {Component} from 'react'
import {StyleSheet, TouchableOpacity, Text, View, Button, TextInput} from 'react-native';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import {Actions} from 'react-native-router-flux';

import Icon from 'react-native-vector-icons/FontAwesome'


export default class CheckoutBillingDisplay extends Component {
	
	constructor(props) {
		super(props)
		this.state = {

		}
	}

	

	
	render() {
		var card = this.props.card
		return (
			<View style = {styles.container}>
				<View style = {styles.billing_preview_container}>
					<Text>{card.brand} ending in {card.last4}</Text>
					<Text> {card.name} </Text>
					<Text> Exp: {card.exp_month} / {card.exp_year} </Text>
				</View>
				<View style = {styles.select_container}>
					<TouchableOpacity onPress = {()=> this.props.selectCard(this.props.index)}>
						{this.props.selected ?
							<Icon name = "circle"/>
							:
							<Icon name = "circle-o"/>
						}
					</TouchableOpacity>
				</View>
			</View>
			
			

		)
	}
}


const styles = StyleSheet.create({
	container : {
		borderBottomWidth : 1,
		borderBottomColor : 'silver',
		paddingBottom : 6,
		paddingTop : 6,
		flexDirection : 'row',
	},
	billing_preview_container : {
		flex: 4
	},
	select_container : {
		flex : 1,
		flexDirection : 'row',
		justifyContent: 'center',
		alignItems : 'center'
	}

})



