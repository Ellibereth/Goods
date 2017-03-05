import React from 'react';
import {Component} from 'react'
import {Alert, TouchableWithoutFeedback, Text, ActivityIndicator, NetInfo, AsyncStorage, Platform, AppState, AppRegistry, StyleSheet, TabBarIOS, View} from 'react-native';

import SubmissionForm from './components/SubmissionForm'

const url = "https://manaweb-events.herokuapp.com"
const test_url = "http://0.0.0.0:5000"
// setCustomText(customTextProps);
// setCustomTextInput(customTextInputProps);
export default class Index extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			
			notifications: []
		}
	}

	render(){
		return (
			
				<View style = {styles.container}>
					<SubmissionForm/>
				</View>
			
			)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor : "#F5FCFF"
	},
	centering: {
		flex : 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 8,
	},
	white: {
		backgroundColor: 'skyblue',
	}
});

