import React from 'react';
import {Component} from 'react'
import {StyleSheet, View} from 'react-native';
import StartNavigator from './StartNavigator'

// cut this later just testing now
import SubmissionList from './components/SubmissionList'

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
		var initialRoute = "SubmissionForm"
		return (
				<View style = {styles.container}>
					<SubmissionList />
				</View>
			
			)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor : "#F5FCFF"
	},
});

