import React from 'react';
import {Component} from 'react'
import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'

export default class CheckoutAddressDisplay extends Component {
	constructor(props) {
		super(props)
		this.state = {

		}
	}

	render() {
		return (
			<View style = {styles.container}>
				<View style = {styles.address_preview_container}>
					<Text> {this.props.address.name} </Text>
					<Text> {this.props.address.address_line1} </Text>
					{this.props.address.address_line2  ? <Text> {this.props.address.address_line2} </Text> : <View/>}
					<Text> {this.props.address.address_city}, {this.props.address.address_state} {this.props.address.address_zip} </Text>
				</View>
				<View style = {styles.select_container}>
					<TouchableOpacity onPress = {()=> this.props.selectAddress(this.props.index)}>
						{this.props.selected ?
							<Icon name = "circle"/>
							:
							<Icon name = "circle-o"/>
						}
					</TouchableOpacity>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container : {
		borderBottomWidth : 1,
		borderBottomColor : 'silver',
		paddingBottom : 6,
		paddingTop : 6,
		flexDirection : 'row',
	},
	address_preview_container : {
		flex: 4
	},
	select_container : {
		flex : 1,
		flexDirection : 'row',
		justifyContent: 'center',
		alignItems : 'center'
	}
})
