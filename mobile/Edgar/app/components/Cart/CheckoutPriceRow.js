import React from 'react';
import {Component} from 'react'
import {StyleSheet, Text, View} from 'react-native';
export default class CheckoutPriceRow extends Component {
	constructor(props) {
		super(props)
		this.state = {	

		}
	}

	render() {
		var styles = StyleSheet.create({
			container : {
				flexDirection : 'row',
				justifyContent : "space-between",
				paddingTop : 6,
				paddingBottom : 6,
				borderTopWidth : 1,
				borderTopColor : 'silver'
			},
			label_text : {
				fontWeight : this.props.bold_text && "bold",
			}, 
			price_text: {
				fontWeight : this.props.bold_text && "bold",
				color : this.props.red_price && 'red'
			}
		});
		
		return (
			<View style = {styles.container}>
				<Text style = {styles.label_text}>{this.props.label}</Text>
				<Text style = {styles.price_text}>{this.props.price}</Text>
			</View>
		);
  	}

}


