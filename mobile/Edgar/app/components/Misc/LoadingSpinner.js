
import React from 'react';
import {Component} from 'react'
import {
	View, 
	Text, 
	StyleSheet,
	ActivityIndicator,
	Dimensions
} from 'react-native'

export default class LoadingSpinner extends Component {
	

	constructor(props) {
		super(props)
		this.state = {
		}
	}

	render() {
		var z_index_style = this.props.visible ? {zIndex : 20} : {}
		var loading_style = this.props.visible ? {backgroundColor : 'black', 'opacity' : 0.7} : {}
		return (
			<View style = {[styles.loading, z_index_style, loading_style]}>
				<ActivityIndicator animating={this.props.visible}
				color = {this.props.color}
				size ="large" />
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
		justifyContent: 'center',
	},
})



