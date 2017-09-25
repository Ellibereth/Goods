import React from 'react';
import {Component} from 'react'
import {View, Text} from 'react-native';
import {Actions} from 'react-native-router-flux'
import {connect} from 'react-redux'
import { ActionCreators } from  '../../../../actions'
import {bindActionCreators} from 'redux'
import UpdatePasswordForm from './UpdatePasswordForm'

function mapDispatchToProps(dispatch) {
	return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
	return {
		user : state.user,
		jwt : state.jwt
	}
}

class UpdatePasswordScreen extends Component {
	
	constructor(props) {
		super(props)
		this.state = {}
	}

	render() {
		return (
				<View style = {{flex : 1}}>
					<UpdatePasswordForm 
					user = {this.props.user}
					jwt = {this.props.jwt}
					setUserInfo = {this.props.setUserInfo}
					/> 
				</View>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdatePasswordScreen);
