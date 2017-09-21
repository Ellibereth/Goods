
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

import Swiper from 'react-native-swiper'
import SimplePicker from 'react-native-simple-picker'

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
				return <Image key = {index}
				source = {{uri : url}} style = {styles.product_image}/>
			})

		return (
			
				<View>
					<ScrollView>

						<Swiper 
						style={styles.image_slider_wrapper}>
							{images}
						</Swiper>
						
						

						<View style = {{height : 10}}/>					
						<View>
							<Text> Product Screen </Text>
							<Text> {this.props.product.name} </Text>
							<Text> {this.props.product.manufacturer} </Text>
						</View>

						
						<View>
							<TouchableOpacity 
							style = {styles.add_to_cart_button}
							onPress = {this.addItemToCart}>
								<Text style = {styles.add_to_cart_text}>Add to Cart</Text>
							</TouchableOpacity>
						</View>

						{this.props.product.has_variants && 
							<View>
								<View>
									<TouchableOpacity onPress = {()=>this.refs.variant_picker.show()}>
										<Text> 
											{this.state.variant ? this.state.variant.variant_type : "No Variant Selected"}
										</Text>
									</TouchableOpacity>
								</View>

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

						
					</ScrollView>
				</View>
			

		)
	}
}

const styles = StyleSheet.create({
	image_slider_wrapper : {
		height: 150,
	},

	product_image : {
		height: 150,
		// width : 150,
	},
	add_to_cart_button : {
		backgroundColor : 'red',
		borderRadius : 6,
		padding: 8,

	},
	add_to_cart_text : {
		color: 'white',
		textAlign : "center"
	}

})

export default connect(mapStateToProps, mapDispatchToProps)(ProductScreen);

