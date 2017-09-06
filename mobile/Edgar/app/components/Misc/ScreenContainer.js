
import React from 'react';
import {Component} from 'react'
import {View, Text, Button} from 'react-native';
import BottomTabBar from '../Navigation/BottomTabBar'



export default class ScreenContainer extends Component {
	

	constructor(props) {
		super(props)
		this.state = {
		}
	}

	render() {
		return (
			<View style = {{flex : 1}}>
				{this.props.children}
				{this.props.show_tab_bar && <BottomTabBar />}
			</View>

		)
	}
}


