
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
import {addItemToCart} from '../../api/CartService'
import {getProductInfo} from '../../api/ProductService'

import {formatPrice, toTitleCase} from '../../util/Format'

import Icon from 'react-native-vector-icons/FontAwesome'
import Swiper from 'react-native-swiper'

import LoadingSpinner from '../Misc/LoadingSpinner'
import ProductTabs from './ProductTabs'
import ProductVariantPicker from './ProductVariantPicker'

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
			is_loading : false,
			product : null,
		}
		this.addItemToCart = this.addItemToCart.bind(this)	
		this.updateVariant = this.updateVariant.bind(this)
		this.setLoading = this.setLoading.bind(this)
		this.loadProductInfo = this.loadProductInfo.bind(this)
	}

	async loadProductInfo(product_id) {
		let data = await getProductInfo(product_id)
		if (data.success){
			this.setState({
				product : data.product
			})
			if (data.product.variants){
				this.setState({
					variant: data.product.variants[0]
				})
			}
		}
		else {
			Actions.home()
		}
	}

	componentDidMount(){	
		this.loadProductInfo(this.props.product_id)
	}

	_navigateToSignUp(){
		Actions.register()
	}

	setLoading(is_loading) {
		this.setState({is_loading : is_loading})
	}

	async addItemToCart() {
		if (!this.props.jwt) {
			Alert.alert(
				"Create an account",
				"You need an account to start shopping",
				[
					{text: 'Sign Up', onPress: () => this._navigateToSignUp()},
					{text: 'Back', onPress: () => console.log('OK Pressed')},
				],
				{ cancelable: false }
			)
			return
		}

		var product_id = this.props.product_id ? this.props.product_id.toString() : ""
		this.setLoading(true)
		let data = await addItemToCart(
			this.props.jwt, 
			product_id, 
			this.state.quantity, 
			this.state.variant
		)
		this.setLoading(false)
		if (data.success){
			this.props.setUserInfo(data.user)
			Alert.alert(
				"Success",
				this.state.product.name + " added to cart",
				[
					{text: 'OK'},
				],
				{ cancelable: false }
			)
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
			variant : this.state.product.variants[index]
		})
	}

	

	render() {
		if (!this.state.product) return <View/>
		var images = this.state.product.images.map((image, index) => {
				var url = img_src  + image.image_id + "_200"
				return <Image key = {index} resizeMode= {"stretch"}
				source = {{uri : url}} style = {styles.product_image}/>
			})
		return (
			
				<View style = {styles.screen_container}>
					<LoadingSpinner visible = {this.state.is_loading}/>
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
								<Text style = {styles.name_text}> {this.state.product.name} </Text>
								<Text style = {styles.manufacturer_text}>by <Text style = {{textDecorationLine : "underline"}}>{this.state.product.manufacturer.name} </Text></Text>
								<Text style = {styles.price_text}> ${formatPrice(this.state.product.price)} </Text>
							</View>

							

							{this.state.product.has_variants && 
								<ProductVariantPicker 
									updateVariant = {this.updateVariant.bind(this)}
									variant = {this.state.variant}
									product = {this.state.product}
								/>
							}

							<ProductTabs product = {this.state.product}/>

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
		color : 'black',
		// margin: 4,
		marginTop : 12,
		fontSize : 20,
	},
	manufacturer_text:  {
		textAlign : 'center',
		color : 'grey',
		opacity : 0.8,
		marginTop: 4,
		marginBottom : 8,
		fontSize:  20
	},
	price_text : {
		textAlign : 'center',
		color : 'red',
		fontSize : 20,
		paddingTop : 10
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

