
import React from 'react';
import {Component} from 'react'
import {
	View,
 	Text, 
 	Image, 
 	TouchableHighlight, 
 	StyleSheet,
 	Dimensions}
from 'react-native'

import {Actions} from 'react-native-router-flux'
import ImageSlider from 'react-native-image-slider'
import {formatPrice} from '../../util/Format'
const img_src = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"

export default class SearchProduct extends Component {
	constructor(props) {
		super(props)
		this.state = {}
	}

	render() {
		if (this.props.product == "PLACE_HOLDER"){
			return <View style = {styles.container} />
		}
		return (
				<TouchableHighlight
				onPress = {this.onProductClick}>
					<View style = {styles.container}>
						<View style = {styles.image_container}> 
							<Image source={{uri : img_src + this.props.product.main_image + "_100"}}
							style={styles.image} resizeMode = {'stretch'}/>	
						</View>
						<View style = {styles.description_container}>
							<Text style = {styles.name} numberOfLines = {1}>
								{this.props.product.name}
							</Text> 
							<Text style = {styles.manufacuturer} numberOfLines = {1}>
								by {this.props.product.manufacturer.name}
							</Text>
							<Text style = {styles.price}>
								${formatPrice(this.props.product.price)}
							</Text>
						</View>
					</View>
				</TouchableHighlight>
			
		)
	}
}

const styles = StyleSheet.create({
	container : {
		margin : 2,
		padding : 2,
		height : Dimensions.get('window').width / 2.1 * (1.5),
		width : Dimensions.get('window').width / 2.1,
		flexDirection : "column",
		justifyContent : 'center',

	},
	image_container : {
		flex : 2,
	},
	description_container : {
 		flex : 1,
 		// backgroundColor : 'skyblue',
 		flexDirection : 'column',
 		justifyContent : 'space-between',
 		padding: 8,
	},
	image : {
		flex : 1,
	},
	name : {
		flex : 1,
		fontWeight : 'bold',
		textAlign : 'center'
	},
	manufacuturer : {
		flex : 1,
		textAlign : 'center'
	}, 
	price: {
		flex : 1,
		fontWeight : 'bold',
		textAlign : 'center'
	}
})


