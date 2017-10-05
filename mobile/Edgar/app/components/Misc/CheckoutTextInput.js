
import React from 'react';
import {Component} from 'react'
import {StyleSheet, Text, View, TextInput} from 'react-native';
import {Actions} from 'react-native-router-flux';

export default class CheckoutTextInput extends Component {
	// takes prop of field and value as input
	// also takes callback onChange as input to handle the change of input
	//  onChange(field, value)
	// optional props are 
	// placeholder (defaults to field)
	// custom styles (defaults to something Darek will add soon)
	// TODO - required....this shows red asterisk in preview, (defaults to false) 
	// maxLength, default none
	constructor(props) {
		super(props)
		this.state = {

		}
	}

	onChangeText(value) {
		this.props.onChangeText(this.props.field, value)
	}

	render() {
		return (
			<View style = {styles.input_container}>
				<TextInput style = {styles.input_text}
					onChangeText = {this.onChangeText.bind(this)}
					// style = {this.props.styles ? }
					maxLength = {this.props.maxLength}
					value = {this.props.value}
					placeholder = {this.props.placeholder ? this.props.placeholder : this.props.field}
					keyboardType = {this.props.keyboardType}
				/>
			</View>
			
			

		)
	}
}


const styles = StyleSheet.create({
	input_container : {
		height : 40,
		margin : 8,
		padding : 4,
		borderColor : 'silver',
		borderRadius : 4,
		borderWidth : 1,
		flexDirection : 'column',
		justifyContent:  'center'
	},
	input_text :{
		fontSize : 22,

	}

})



