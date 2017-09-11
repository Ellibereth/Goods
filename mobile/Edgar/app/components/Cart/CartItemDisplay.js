
import React from 'react';
import {Component} from 'react'
import {View, Text, StyleSheet, Image, TouchableHighlight} from 'react-native';
import {Actions} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome'
import SimplePicker from 'react-native-simple-picker'
import {updateCartQuantity} from '../../api/CartApi'
const img_src = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"

export default class CartItemDisplay extends Component {
	

	constructor(props) {
		super(props)
		this.state = {

		}
		this.showQuanityPicker = this.showQuanityPicker.bind(this)
		this.updateQuantity = this.updateQuantity.bind(this)
	}

	showQuanityPicker(){
		this.refs.quantity_picker.show()
	}


	getNumItemsLimit(){
		var num_items_options = []
		var limit = this.props.item.num_items_limit ? Math.min(this.props.item.num_items_limit, this.props.item.inventory) : this.props.item.inventory
		limit = Math.max(limit, this.props.item.num_items)
		return limit
	}

	async updateQuantity(quantity){
		console.log(quantity)
		let data = await updateCartQuantity(this.props.jwt, this.props.item, quantity)
		if(data.success){
			this.props.setUserInfo(data)
		}
		else {
			console.log(data.error)
		}
	}

	render() {
		var item_limit = this.getNumItemsLimit.bind(this)()
		var quantities = []
		for (var i = 0; i <= item_limit; i ++){
			quantities.push(i);
		}

		return (
			<View style = {styles.container}>
				<View style = {styles.title_container}>
					<Text style = {styles.title_text}>{this.props.item.name}</Text>
				</View>
				<View style = {styles.box_container}>
					<View style = {styles.image_container}>
						<Image 
						resizeMode = 'stretch'
						source={{uri: img_src + this.props.item.main_image}}
							style = {styles.product_image} />
					</View>
					<View style = {styles.details_container}>
						
							<View  style = {styles.quantity_container}>

								<TouchableHighlight  onPress={this.showQuanityPicker}
								 style = {styles.quantity_text_container}>
									<Text>
										QTY: {this.props.item.num_items}</Text>
								</TouchableHighlight>
								<TouchableHighlight  onPress={this.showQuanityPicker} style = {styles.quantity_caret_container}>
									<Icon
									style = {styles.quantity_caret}
									name = "caret-down"/>
								</TouchableHighlight>
							</View>

						<SimplePicker
									  ref = {'quantity_picker'}
									  options={quantities}
									  labels = {quantities.map((quantity)=>quantity.toString())}
									  initialOptionIndex = {this.props.item.num_items}
									  onSubmit={(option) => {
										this.updateQuantity(option)
									  }}
									/>

						<View style = {styles.price_container}>
							<Text>Price: {this.props.item.price}</Text>
						</View>
					</View>
				</View>
				<View style = {styles.shipping_container}>
					<Text>
						Shipping information goes here
					</Text>
				</View>

			</View>
			
			
			

		)
	}
}

const styles = StyleSheet.create({
	container : {
		height: 120,
		borderWidth : 1,
		borderColor : 'silver',
		borderRadius : 2,
		margin : 8,
		marginBottom : 0,
		marginTop : 8,
		flexDirection : 'column',
	},
	title_text : {

	},
	title_container : {
		flex: 1,
	},
	box_container : {
		flexDirection : 'row',
		borderTopWidth : 1,
		borderBottomWidth : 1,
		borderColor : 'silver',
		borderRightWidth : 0,
		borderLeftWidth : 1,
		marginLeft : 2,
		flex: 3
	},
	image_container : {
		flex: 1,
		flexDirection : 'column',
		borderRightWidth : 1,
		borderColor : 'silver',
		padding: 2
	},
	details_container : {
		flex: 4,
		flexDirection : 'column'
	},
	quantity_container : {
		borderBottomWidth : 1,
		borderColor : 'silver',
		flexDirection : 'row',
		justifyContent : 'flex-start',
		padding : 8,
	},
	quantity_text_container : {
		backgroundColor : 'white',
		borderTopLeftRadius : 4,
		borderBottomLeftRadius : 4,
		borderWidth : 1, 
		borderColor : 'black',
		padding: 6,
	},
	quantity_caret_container : { 
		backgroundColor: 'silver',
		flexDirection : 'column',
		justifyContent : 'center',
		borderTopRightRadius : 4,
		borderBottomRightRadius : 4,
		borderWidth : 1, 
		borderColor : 'black',
		borderLeftWidth : 0,
		padding: 6,
	},
	quantity_caret : { 
		color : 'white'
	},
	price_container : {

	},
	product_image : {
		flex : 1,
		borderRadius : 2,
	},
	shipping_container : {
		flex : 2
	}

})


