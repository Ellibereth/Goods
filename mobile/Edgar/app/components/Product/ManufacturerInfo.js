import React from 'react';
import {Component} from 'react'
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native'
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view'


export default class ManufacturerInfo extends Component {

	constructor(props) {
		super(props)
		this.state = {	

		}
	}

	

	render() {
		return (
			<View style = {styles.description_container}>
				<Text style = {styles.description_text}> 
					{this.props.product.manufacturer.description}
				</Text>
			</View>
		
		);
  	}
}


const styles = StyleSheet.create({
	description_container : {
		marginTop : 6,
		marginBottom: 6,
		paddingVertical : 16,
		paddingHorizontal : 24

	},
	description_text : {
		fontSize : 16,
		color : 'black',
	},
});
			






