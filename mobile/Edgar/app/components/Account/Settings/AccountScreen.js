
import React from 'react';
import {Component} from 'react'
import {View, Text, Button, ScrollView } from 'react-native';
import {Actions} from 'react-native-router-flux'
import {connect} from 'react-redux'
import { ActionCreators } from  '../../../actions'
import {bindActionCreators} from 'redux'

import AccountMenu from './AccountMenu'



function mapDispatchToProps(dispatch) {
	return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
	return {
		user : state.user,
	}
}


class AccountScreen extends Component {
	
	constructor(props) {
		super(props)
		this.state = {

		}
	}


	render() {
		return (
				<AccountMenu logoutUser = {this.props.logoutUser} 
					user = {this.props.user}/>
		)
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(AccountScreen);

