import React from 'react';
import {Component} from 'react'
import {Alert, TouchableWithoutFeedback, Text, ActivityIndicator, NetInfo, AsyncStorage, Platform, AppState, AppRegistry, StyleSheet, TabBarIOS, View} from 'react-native';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import {
	setCustomView,
	setCustomTextInput,
	setCustomText,
	setCustomImage,
	setCustomTouchableOpacity
} from 'react-native-global-props';

import HomeScreen from './Components/Home/HomeScreen'
import { StackNavigator } from 'react-navigation';
const url = "www.edgarusa.com"
export default class Index extends React.Component {

	constructor(props){
		super(props)
		this.state = {
			isConnected : null,
			current_user : {},
			current_username: "",
			isLoading: true,
			feed: [],
			notifications: []
		}
	}


	getUserInfo(){
		
	}

	componentWillUnmount(){
		
	}
	componentDidMount() {
		this.getUserInfo()
	}

	

	render() {
		const stack_nav = StackNavigator({
			Home: { screen: HomeScreen },
		});
		return (
			
				<View>
					<View>
						<Text>Open up Edgar.js to start working on your app!</Text>
						<Text>Changes you make will automatically reload.</Text>
						<Text>Shake your phone to open the developer menu.</Text>
					</View>
				</View>
			
			)
	}
}



