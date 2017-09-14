
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
			variant_id : 0,
			variant : null,
		}
		this.addItemToCart = this.addItemToCart.bind(this);	
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

	

	render() {
		return (
			
				<View>
					<ScrollView>

						<Image source={{uri: img_src + this.props.product.main_image}}
						style = {styles.product_image}
						/>

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
							<View style = {{paddingTop : 10}}>
								<Picker
								  selectedValue={this.state.variant_id}
								  onValueChange={(itemValue, itemIndex) => this.setState({variant_id : itemIndex, variant : this.props.product.variants[itemIndex]})}>
								  {this.props.product.variants.map((variant,index) => 
								  		<Picker.Item 
								  		key = {index}
								  		label={variant.variant_type} 
								  		value= {index} />		
								  	)}
								</Picker>
							</View>
						}
					</ScrollView>
				</View>
			

		)
	}
}

const styles = StyleSheet.create({
	product_image : {
		height: 100,
		width : 100,
		borderRadius : 6
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

