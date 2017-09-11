
import React from 'react';
import {Component} from 'react'
import {TouchableOpacity,
		StyleSheet,
		View,
		Text,
		ScrollView,
		Image,
		TouchableHighlight
} from 'react-native';
import {Actions} from 'react-native-router-flux'

import Icon from 'react-native-vector-icons/FontAwesome'


const img_src = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"



export default class OrdersScreen extends Component {

	constructor(props) {
		super(props)
		this.state = {
		}
	}

	
	
	render() {
		
		return (
				<View style = {styles.container}>
					<Text>{this.props.order.order_id}</Text>
					{this.props.order.items.map((item, index) => 
						<Text key = {index}> {item.name}</Text>
					)}
				</View>
		)
	}
}

const styles = StyleSheet.create({
	container : {
		
		padding : 8,
		borderWidth : 1,
		borderColor : 'grey',
		margin : 8,
	},
	
})


