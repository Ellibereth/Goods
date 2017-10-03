import React from 'react';
import {Component} from 'react'
import {
	View,
	Text,
	Modal
} from 'react-native';
import {Actions} from 'react-native-router-flux'
import {connect} from 'react-redux'
import SearchIcon from './SearchIcon'
import BackIcon from './BackIcon'

function mapStateToProps(state) {
	return {
		user : state.user
	}
}

class LeftNavButton extends Component {

	constructor(props) {
		super(props)
		this.state = {

		}
	}

	render() {
		

		return (
				<View style = {{flexDirection : "row"}}>
					<BackIcon/>
					<SearchIcon/>
				</View>
		)
				
	}
}


export default connect(mapStateToProps)(LeftNavButton);
