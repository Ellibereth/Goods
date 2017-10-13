
import React from 'react';
import {Component} from 'react'
import {
	View, 
	Text,
	Image,
	TouchableHighlight,
	StyleSheet, 
	Dimensions
} from 'react-native'

import {Actions} from 'react-native-router-flux'
import ImageSlider from 'react-native-image-slider'
import {formatPrice} from '../../util/Format'
const img_src = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"


export default class HomeProduct extends Component {
	constructor(props) {
		super(props)
		this.state = {}
		this.onProductClick = this.onProductClick.bind(this);
	}

	onProductClick() {
		Actions.product({product : this.props.product})
	}

	componentDidMount() {
		
	}

	render() {
		var padding_style = this.props.index % 2 == 0 ? {marginRight : 6, marginLeft : 12} : {marginLeft : 6, marginRight : 12}
		return (
				<TouchableHighlight style = {{flex : 1}}
				onPress = {this.onProductClick}>
					<View style = {[styles.container,padding_style]}>
						<View style = {[styles.image_container]}> 
							<Image 
							source={{
								uri : img_src + this.props.product.main_image,
								// cache : 'force-cache'
							}}
							style={styles.image} resizeMode = {'stretch'}/>	
						</View>
						<View style = {styles.description_container}>
							<View style = {{flex : 1}}>
								<Text style = {styles.name} numberOfLines = {1}>
									{this.props.product.name}
								</Text> 
								<Text style = {styles.manufacuturer} numberOfLines = {1}>
									{this.props.product.manufacturer.name}
								</Text>
							</View>
							<View style = {{flex : 1, flexDirection : 'row', alignItems : 'flex-end'}}>
								<Text style = {styles.price}>
									${formatPrice(this.props.product.price)}
								</Text>
							</View>
						</View>
					</View>
				</TouchableHighlight>
			
		)
	}
}

const styles = StyleSheet.create({
	container : {
		marginTop : 10,
		height: Dimensions.get('window').height / 2.8,
		flexDirection : "column",
		justifyContent : 'center',
		borderWidth : 1,
		borderColor : '#E2DAE8',
		borderRadius : 4

	},
	image_container : {
		// paddingVertical : 4,
		flex : 2,
		overflow : 'hidden'

	},
	description_container : {
 		flex : 1,
 		flexDirection : 'column',
 		justifyContent : 'space-between',
 		paddingTop: 8,
 		paddingBottom : 4,
 		paddingHorizontal : 8,
	},
	image : {
		flex : 1,
		borderRadius : 4,
		marginBottom : -4,

	},
	name : {
		flex : 1,
		// fontWeight : 'bold',
		// textAlign : 'center'
	},
	manufacuturer : {
		flex : 1,
		color: 'grey'
		// textAlign : 'center'
	}, 
	price: {
		flex : 1,
		fontWeight : 'bold',
		// textAlign : 'center'
	}
})


