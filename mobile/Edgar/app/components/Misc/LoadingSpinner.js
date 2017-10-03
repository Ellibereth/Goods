
import React from 'react';
import {Component} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay';

export default class LoadingSpinner extends Component {
	

	constructor(props) {
		super(props)
		this.state = {
		}
	}

	render() {
		return (
			
				<View style = {styles.loading}>
					<Spinner visible={this.props.visible} />
				</View>
			

		)
	}
}

const styles = StyleSheet.create({
	loading : {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center'
	}
})



