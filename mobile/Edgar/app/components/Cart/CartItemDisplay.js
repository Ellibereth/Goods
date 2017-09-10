
import React from 'react';
import {Component} from 'react'
import {View, Text, StyleSheet, Image, TouchableHighlight} from 'react-native';
import {Actions} from 'react-native-router-flux'

const img_src = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"

export default class CartItemDisplay extends Component {
	

	constructor(props) {
		super(props)
		this.state = {

		}

	}


	render() {
		return (
			<View style = {styles.container}>
				<View style = {styles.title_container}>
					<Text style = {styles.title_text}>{this.props.item.name}</Text>
				</View>
				<View style = {styles.box_container}>
					<View style = {styles.image_container}>
						<Image 
						resizeMode = 'stretch'
						source={{uri: img_src + this.props.item.main_image}}
							style = {styles.product_image} />
					</View>
					<View style = {styles.details_container}>
						<View style = {styles.quantity_container}>
							<Text>Quantity: {this.props.item.num_items}</Text>
						</View>
						<View style = {styles.price_container}>
							<Text>Price: {this.props.item.price}</Text>
						</View>
					</View>
				</View>
				<View style = {styles.shipping_container}>
					<Text>
						Shipping information goes here
					</Text>
				</View>

			</View>
			
			
			

		)
	}
}

const styles = StyleSheet.create({
	container : {
		height: 120,
		borderWidth : 1,
		borderColor : 'silver',
		borderRadius : 2,
		margin : 8,
		marginBottom : 0,
		marginTop : 8,
		flexDirection : 'column',
	},
	title_text : {

	},
	title_container : {
		flex: 1,
	},
	box_container : {
		flexDirection : 'row',
		borderTopWidth : 1,
		borderBottomWidth : 1,
		borderColor : 'silver',
		borderRightWidth : 0,
		borderLeftWidth : 1,
		marginLeft : 2,
		flex: 3
	},
	image_container : {
		flex: 1,
		flexDirection : 'column',
		borderRightWidth : 1,
		borderColor : 'silver',
		padding: 2
	},
	details_container : {
		flex: 4,
		flexDirection : 'column'
	},
	quantity_container : {
		borderBottomWidth : 1,
		borderColor : 'silver'
	},
	price_container : {

	},
	product_image : {
		flex : 1,
		borderRadius : 2,
	},
	shipping_container : {
		flex : 2
	}
})


