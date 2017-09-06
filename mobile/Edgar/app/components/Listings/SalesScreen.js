
import React from 'react';
import {Component} from 'react'
import {View, Text, Button, ScrollView } from 'react-native';
import {Actions} from 'react-native-router-flux'
import {connect} from 'react-redux'
import { ActionCreators } from  '../../actions'
import {bindActionCreators} from 'redux'


function mapDispatchToProps(dispatch) {
	return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
	return {
		user : state.user,
		home_products : state.home_products
	}
}


class SalesScreen extends Component {
	static navigationOptions = {
		title : "Sales"
	};

	constructor(props) {
		super(props)
		this.state = {

		}
	}

	


	render() {


		return (
			
				<View style = {{"flex" : 1}}>
					<Text> Sales Page </Text>
				</View>
			

		)
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(SalesScreen);

