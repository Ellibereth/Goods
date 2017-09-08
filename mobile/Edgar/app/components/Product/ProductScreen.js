
import React from 'react';
import {Component} from 'react'
import {Picker, StyleSheet, View, Text, Button, ScrollView } from 'react-native';
import {Actions} from 'react-native-router-flux'
import {connect} from 'react-redux'
import { ActionCreators } from  '../../actions'
import {bindActionCreators} from 'redux'
import {getProductInfo, addToCart} from '../../api/ProductApi'

const url = "https://www.edgarusa.com"
const test_url = "http://0.0.0.0:5000"

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
	static navigationOptions = {
		title : "Product"
	};

	constructor(props) {
		super(props)
		this.state = {
			quantity : 1,
			variant : null,
		}
		this.addToCart = this.addToCart.bind(this);	
	}

	componentDidMount(){	
		
		
	}

	async addToCart() {
		let data = addToCart(this.props.jwt, 
			this.props.product_id, 
			this.state.quantity, 
			this.state.variant
		)
		if (data.success){
			console.log("add to cart success")
		}
		else {
			console.log("add to cart error")
		}
	}

	selectVariant(variant_id){

	}

	render() {
		console.log(this.props.product.variants)
		return (
			
				<View>
					<View style = {{flex:  1}}>
						<Text> Product Screen </Text>
						<Text> {this.props.product.name} </Text>
						<Text> {this.props.product.manufacturer} </Text>
					</View>
					<View style = {{flex:  1}}>
						<Button title = {"Add To Cart"}
						onPress = {this.addToCart.bind(this)}/>
					</View>

					{this.props.product.has_variants &&
						<View style = {{flex : 1}}>
							<Picker
							  selectedValue={this.state.variant_id}
							  onValueChange={(itemValue, itemIndex) => this.selectVariant(itemValue)}>
							  {this.props.product.variants.map((variant) => 
							  		<Picker.Item label={variant.name} value= {variant.variant_id} />		
							  	)}
							  <Picker.Item label="Variant 1" value="1" />
							  <Picker.Item label="Variant 2" value="2" />
							</Picker>
						</View>
					}
				</View>
			

		)
	}
}

const styles = StyleSheet.create({

})

export default connect(mapStateToProps, mapDispatchToProps)(ProductScreen);

