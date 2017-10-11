import React from 'react';
import {Component} from 'react'
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {formatPrice} from '../../util/Format.js'
import {Actions} from 'react-native-router-flux'

const img_src = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"
export default class RelatedProductDisplay extends Component {

	constructor(props) {
		super(props)
		this.state = {	

		}
	}

	navigateToProduct(){
		Actions.product({product : this.props.product})
	}

	render() {
		return (
			<TouchableOpacity style = {styles.container} onPress = {this.navigateToProduct.bind(this)}>
					<View style = {styles.image_container}>
						<Image style = {styles.image}
						source = {{uri : img_src + this.props.product.main_image}}/>
					</View>
					<View style = {styles.description_container}>
						<Text style = {styles.name_text}>
							{this.props.product.name}
						</Text>
						<Text style = {styles.price_text}>
							{formatPrice(this.props.product.price)}
						</Text>

					</View>	
			</TouchableOpacity>
		
		);
  	}
}


const styles = StyleSheet.create({
	container :  {
		flexDirection : 'row',
		justifyContent : "flex-start",
		borderBottomWidth : 0.5,
		borderTopWidth : 0.5,
		borderColor : 'silver',
		padding : 12
	},
	image_container : {
		flex : 1,
	},
	image : {
		flex : 1,
	},
	description_container : {
		flex : 3,
		flexDirection : 'column',
		padding: 12,
	},
	name_text: {
		fontSize : 16
	},
	price_text: {
		fontWeight: 'bold',
		fontSize : 16,

	}

});
			






