
import React from 'react';
import {Component} from 'react'
import {TouchableOpacity,
		Picker,
		StyleSheet,
		View,
		Text,
		ScrollView,
		Image,
		Alert,
} from 'react-native';
import {Actions} from 'react-native-router-flux'
import {connect} from 'react-redux'
import { ActionCreators } from  '../../actions'
import {bindActionCreators} from 'redux'
import {getProductInfo, addItemToCart} from '../../api/CartService'

import {formatPrice, toTitleCase} from '../../util/Format'

import Icon from 'react-native-vector-icons/FontAwesome'
import Swiper from 'react-native-swiper'
import SimplePicker from 'react-native-simple-picker'
import RelatedProducts from './RelatedProducts'

const img_src = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"

function mapDispatchToProps(dispatch) {
	return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
	return {
		user : state.user,
		jwt : state.jwt
	}
}


class ProductScreen extends Component {

	constructor(props) {
		super(props)
		this.state = {
			quantity : 1,
			variant : null,
		}
		this.addItemToCart = this.addItemToCart.bind(this)	
		this.updateVariant = this.updateVariant.bind(this)
	}

	componentDidMount(){	
		if (this.props.product.variants){
			this.setState({
				variant: this.props.product.variants[0]
			})
		}
	}

	async addItemToCart() {
		var product_id = this.props.product.product_id ? this.props.product.product_id.toString() : ""
		let data = await addItemToCart(
			this.props.jwt, 
			product_id, 
			this.state.quantity, 
			this.state.variant
		)
		if (data.success){
			this.props.loadUser(this.props.jwt)
			
		}
		else {
			Alert.alert(
			  data.error.title,
			  data.error.text,
			  [
				{text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false }
			)
		}
	}

	updateVariant(index){
		this.setState({
			variant : this.props.product.variants[index]
		})
	}

	

	render() {
		var images = this.props.product.images.map((image, index) => {
				var url = img_src  + image.image_id
				return <Image key = {index} resizeMode= {"stretch"}
				source = {{uri : url}} style = {styles.product_image}/>
			})
		return (
			
				<View style = {styles.screen_container}>

					<View style = {styles.scroll_container}> 
						<ScrollView>
							<Swiper 
							loop = {false}
							style={styles.image_slider_wrapper}
							paginationStyle={{
								bottom: -20,
							  }}
							>
								{images}
							</Swiper>
							<View style = {{paddingTop : 30}}/>
							<View style = {styles.title}>
								<Text style = {styles.name_text}> {this.props.product.name} </Text>
								<Text style = {styles.manufacturer_text}>by <Text style = {{textDecorationLine : "underline"}}>{this.props.product.manufacturer.name} </Text></Text>
								<Text style = {styles.price_text}> ${formatPrice(this.props.product.price)} </Text>
							</View>

							<View style = {styles.description_container}>
								<Text style = {styles.description_title}>
									DESCRIPTION
								</Text>
								<Text style = {styles.description_text}> 
									{this.props.product.description}
								</Text>
							</View>


							{this.props.product.has_variants && 
								<View style = {variant_styles.container}>
									<View style = {{flex : 1}}/>
									<View style = {variant_styles.content_container}>
										<TouchableOpacity style = {variant_styles.picker_container}
											onPress = {()=>this.refs.variant_picker.show()}>
											<Text style = {variant_styles.picker_title}>
												Select {toTitleCase(this.props.product.variant_type_description)}:
											</Text>
											<Text style = {variant_styles.picker_text}>
												{this.state.variant ? this.state.variant.variant_type : "No Variant Selected"}
											</Text>
											<View style ={variant_styles.caret_container}>
												<Icon name = {"caret-down"} 
												style = {variant_styles.caret}/>
											</View>
										</TouchableOpacity>
									</View>

									<View style = {{flex : 1}}/>

									<SimplePicker
										ref = {'variant_picker'}
										options={this.props.product.variants.map((variant, index) =>
											index
										)}
										labels = {this.props.product.variants.map((variant) => variant.variant_type)}
										initialOptionIndex = {0}
										onSubmit={(index) => {
											this.updateVariant(index)			
										}}
									/>
								</View>
							}

							<RelatedProducts product = {this.props.product}/>
							<View style = {{paddingBottom : 24}}/>
						</ScrollView>
					</View>

					<View style = {styles.add_to_cart_container}>
							<TouchableOpacity 
							style = {styles.add_to_cart_button}
							onPress = {this.addItemToCart}>
								<Icon style = {styles.cart_icon} name = {"shopping-cart"}/> 
								<Text style = {styles.add_to_cart_text}>Add to Cart</Text>
							</TouchableOpacity>
						</View>
				</View>
			

		)
	}
}

const variant_styles = StyleSheet.create({
	container : {
		flexDirection : 'row',
	},
	picker_container : {
		flex : 1,
		flexDirection : "row",
		alignItems : 'flex-start',
		justifyContent : 'center',
		borderWidth : 1,
		borderRadius : 6,
		// margin : 4,
		padding : 8,
	},
	content_container : { 
		flex: 3,
	},
	picker_title : {
		flex: 4,
	},
	picker_text :{
		flex: 2,
	},
	caret_container: {
		flex : 1,
		flexDirection : 'column',
		justifyContent : 'center',
		alignItems : 'center'
	},
	caret : {
		flex : 1,
		fontSize : 16,
		flexDirection : 'row',
	},
})

const styles = StyleSheet.create({
	screen_container : {
		flex : 1,
		flexDirection : "column",
		justifyContent : "center",
		backgroundColor : 'white'
	},
	scroll_container : {
		flex: 9,
	},
	image_slider_wrapper : {
		height: 300,
		marginBottom: 20
	},

	product_image : {
		flex: 1,
		alignSelf: 'stretch',
		// width: undefined,
		// height: undefined
		// width : 150,
	},

	title: {
		// flex : 1,
		flexDirection : 'column',
		justifyContent : 'center',
		marginBottom : 12
	},

	name_text: {
		textAlign : 'center',
		color : 'grey',
		// margin: 4,
		marginTop : 12
	},
	manufacturer_text:  {
		textAlign : 'center',
		color : 'grey',
		opacity : 0.8,
		marginTop: 4,
		marginBottom : 8,
	},
	price_text : {
		textAlign : 'center',
		color : 'red',
	},

	description_container : {
		marginLeft : 20,
		marginRight : 20,
		borderTopWidth : 1,
		borderColor : 'silver',
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
	
	add_to_cart_container : {
		flex: 1,
		flexDirection : "row",
		alignItems : "stretch",
		justifyContent : "center",
	},
	add_to_cart_button : {
		flex : 1,
		backgroundColor : 'red',
		flexDirection : "row",
		justifyContent : "center",
		alignItems : "center"

	},

	cart_icon : {
		color : 'white',
		textAlign : 'center',
		fontSize : 20,
	},

	add_to_cart_text : {
		color: 'white',
		textAlign : "center",
		fontSize : 20,
		marginLeft : 6
	}

})

export default connect(mapStateToProps, mapDispatchToProps)(ProductScreen);

