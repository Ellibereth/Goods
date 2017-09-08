
import React from 'react';
import {Component} from 'react'
import {View, Button, AsyncStorage} from 'react-native';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import LoginForm from './LoginForm'


export default class LoginScreen extends Component {
	constructor(props) {
		super(props)
		this.state = {
		}
	}

	

	render() {
		return (
				
				<LoginForm loadUser = {this.props.loadUser} />
			
			

		)
	}
}





