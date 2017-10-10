import React from 'react';
import {Component} from 'react'
import {
	View,
	Text,
} from 'react-native';
import {Actions} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome'


export default class BackIcon extends Component {

	constructor(props) {
		super(props)
		this.state = {}
	}

	navigateBack(){
		Actions.pop()
	}

	render() {
		
		return (
			 <Icon name = "chevron-left" 
						size = {24}
						style = {{
							marginTop : 4,
							marginLeft : 8,
							color : '#3399ff',
							fontWeight : 'lighter',
							padding : 8,
							paddingRight : 24,
							paddingLeft : 0,
						}}
						onPress = {this.navigateBack}/>
		)
				
	}
}

