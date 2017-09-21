
import React from 'react';
import {Component} from 'react'
import {View, Text, Image, TouchableHighlight, StyleSheet} from 'react-native'

import {Actions} from 'react-native-router-flux'
import ImageSlider from 'react-native-image-slider'
const img_src = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"


export default class HomeProductDisplay extends Component {
	constructor(props) {
		super(props)
		this.state = {}
		this.onProductClick = this.onProductClick.bind(this);
	}

	onProductClick() {
		Actions.product({product : this.props.product})
	}

	render() {
		

		return (
			<View style = {styles.container}>
				<TouchableHighlight onPress = {this.onProductClick}>
					<View> 
						<Text>{this.props.product.name}</Text> 
						{this.props.image}
						{/* <Image source={{uri : }}
						style={{width: 30, height: 30}} 
						/>*/}
						{this.props.product.has_variants ? 
							<Text>Has Variants</Text> :
							<Text>No Variants</Text>
						}
					</View>
				</TouchableHighlight>
			</View>
			
			
			

		)
	}
}

const styles = StyleSheet.create({
	container : {
		borderWidth : 1,
		margin : 6,
		padding : 6,
		borderRadius : 4
	}
})


