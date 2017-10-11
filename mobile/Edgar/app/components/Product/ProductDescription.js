import React from 'react';
import {Component} from 'react'
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native'
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view'


export default class ProductDescription extends Component {

	constructor(props) {
		super(props)
		this.state = {	

		}
	}

	

	render() {
		return (
			<View style = {styles.description_container}>
				{/* <Text style = {styles.description_title}>
					DESCRIPTION
				</Text>*/}
				<Text style = {styles.description_text}> 
					{this.props.product.description}
				</Text>
			</View>
		
		);
  	}
}


const styles = StyleSheet.create({
	description_container : {
		marginLeft : 20,
		marginRight : 20,
		marginTop : 6,
		marginBottom: 6

	},
	description_title : {
		margin : 12,
		fontSize : 24,
		textAlign : 'center'
	},
	description_text : {
		textAlign : 'center',
		fontSize : 16,
		color : 'grey'
	},
});
			






