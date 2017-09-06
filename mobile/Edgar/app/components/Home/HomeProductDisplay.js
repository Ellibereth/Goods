
import React from 'react';
import {Component} from 'react'
import {View, Text, Button, Image, TouchableHighlight} from 'react-native';

const img_src = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"
import {Actions} from 'react-native-router-flux'

export default class HomeProductDisplay extends Component {
	static navigationOptions = {
		title : "Home"
	};

	constructor(props) {
		super(props)
		this.state = {

		}
		this.onProductClick = this.onProductClick.bind(this);
	}

	onProductClick() {
		Actions.product({product_id : this.props.product.product_id})
	}

	render() {
		return (
			<View>
				<TouchableHighlight onPress = {this.onProductClick}>
					<View> 
						<Text>{this.props.product.name}</Text> 
						<Image source={{uri: img_src + this.props.product.main_image}}
						style={{width: 30, height: 30}} 
						/>
					</View>
				</TouchableHighlight>
			</View>
			
			
			

		)
	}
}


