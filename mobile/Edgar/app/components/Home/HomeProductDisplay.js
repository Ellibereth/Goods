
import React from 'react';
import {Component} from 'react'
import {View, Text, Button, Image, TouchableHighlight} from 'react-native';

const img_src = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"
import {Actions} from 'react-native-router-flux'

export default class HomeProductDisplay extends Component {
	

	constructor(props) {
		super(props)
		this.state = {

		}
		this.onProductClick = this.onProductClick.bind(this);
	}

	onProductClick() {
		Actions.product({product : this.props.product})
	}

	render() {
		return (
			<View style = {{borderWidth : 1}}>
				<TouchableHighlight onPress = {this.onProductClick}>
					<View> 
						<Text>{this.props.product.name}</Text> 
						{/* <Image source={{uri: img_src + this.props.product.main_image}}
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


