import React from 'react';
import {Component} from 'react'
import {} from 'react-native';
import LoginForm from './LoginForm'
import { ActionCreators } from  '../../../actions'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'


function mapDispatchToProps(dispatch) {
	return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
	return {
		user : state.user,
		jwt : state.jwt
	}
}

class LoginScreen extends Component {
	constructor(props) {
		super(props)
		this.state = {
		}
	}

	render() {
		return (
				<LoginForm 
				setJwt = {this.props.setJwt}
				setUserInfo = {this.props.setUserInfo} />
		)
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);





