import React from 'react';
import {Component} from 'react'
import {} from 'react-native';
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





