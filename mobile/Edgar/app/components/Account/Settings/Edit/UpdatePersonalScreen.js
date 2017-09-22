import React from 'react';
import {Component} from 'react'
import {View, Text} from 'react-native';
import {Actions} from 'react-native-router-flux'
import {connect} from 'react-redux'
import { ActionCreators } from  '../../../../actions'
import {bindActionCreators} from 'redux'
import UpdatePersonalForm from './UpdatePersonalForm'
function mapDispatchToProps(dispatch) {
	return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
	return {
		user : state.user,
		jwt : state.jwt
	}
}

class UpdatePersonalScreen extends Component {
	
	constructor(props) {
		super(props)
		this.state = {}
	}

	render() {
		return (
				<View style = {{flex : 1}}> 
					<UpdatePersonalForm jwt ={this.props.jwt} 
					user = {this.props.user}
					setUserInfo = {this.props.setUserInfo}
					loadUser = {this.props.loadUser}/>
				</View>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdatePersonalScreen);

