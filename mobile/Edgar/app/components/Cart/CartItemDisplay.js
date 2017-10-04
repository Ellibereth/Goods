import React from 'react';
import {Component} from 'react'
import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableHighlight,
	Alert
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome'
import SimplePicker from 'react-native-simple-picker'
import {updateCartQuantity} from '../../api/CartService'
import {formatPrice} from '../../util/Format'
import SelectDropdownButton from '../Misc/SelectDropdownButton'
const img_src = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"

export default class CartItemDisplay extends Component {

	constructor(props) {
		super(props)
		this.state = {}
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
		this.props.setLoading(true)
		let data = await updateCartQuantity(this.props.jwt, this.props.item, quantity)
		if(data.success){
			this.props.setUserInfo(data.user)
			this.props.setLoading(false)
		}
		else {
			this.props.setLoading(false)
			console.log(data.error)
		}
	}

	onRemovePress() {
		Alert.alert(
			'Edgar USA',
			'Are you sure you want to remove this item?',
			  [
				{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
				{text: 'OK', onPress: () => this.updateQuantity(0)},
			  ]
		)
	}

	render() {
		var item_limit = this.getNumItemsLimit.bind(this)()
		var quantities = []
		for (var i = 1; i <= item_limit; i ++){
			quantities.push(i);
		}

		return (
			<View style = {styles.container}>
				<View style = {[{flex : 1}, styles.title_container]}>
					<Text numberOfLines = {1} style = {styles.title_text}>{this.props.item.name}</Text>
					<Icon size = {20} 
					color = "grey" name = {"times-circle"}
						onPress = {this.onRemovePress.bind(this)}
					/>
				</View>
				<View style = {[{flex : 3}, styles.box_container]}>
					<View style = {[{flex : 1},styles.image_container]}>
						<Image 
						// resizeMode = 'stretch'
						source={{uri: img_src + this.props.item.main_image}}
							style = {[{flex: 1}, styles.product_image]} />
					</View>
					<View style = {[{flex: 3}, styles.details_container]}>
						<View style=  {{flex : 3}}>
							<SelectDropdownButton 
							left_display = {"QTY:" + this.props.item.num_items}
							onPress = {this.showQuanityPicker}/>
						</View>

						<View style = {[{flex : 2}, styles.price_container]}>
							<Text style = {[{flex : 1},styles.price_text]}>
								${formatPrice(this.props.item.price * this.props.item.num_items)}
							</Text>
						</View>
					</View>
				</View>
				<View style = {[{flex: 1}, styles.shipping_container]}>
					<Text style = {styles.shipping_info_text}>
						Shipping information goes here
					</Text>
				</View>
				<SimplePicker
							ref = {'quantity_picker'}
							options={quantities}
							labels = {quantities.map((quantity)=>quantity.toString())}
							initialOptionIndex = {this.props.item.num_items - 1 || 0}
							onSubmit={(option) => {
							this.updateQuantity(option)
							}}
						/>

			</View>
		)
	}
}

const styles = StyleSheet.create({
	container : {
		height: 140,
		borderWidth : 1,
		borderColor : 'silver',
		marginHorizontal : 10,
		marginBottom : 16,
		marginTop : 0,
		flexDirection : 'column',
	},
	title_text : {
		fontWeight : 'bold',
		fontSize : 16,
	},
	title_container : {
		padding : 4,
		flexDirection : 'row',
		justifyContent : 'space-between',
		alignItems : 'center'
	},
	box_container : {
		flexDirection : 'row',
		borderTopWidth : 1,
		borderBottomWidth : 1,
		borderColor : 'silver',
		borderRightWidth : 0,
		borderLeftWidth : 1,
		marginLeft : 4,
	},
	image_container : {
		borderRightWidth : 1,
		borderColor : 'silver',
		padding: 2,
	},
	details_container : {
		flexDirection : 'column'
	},
	
	price_container : {
		flexDirection : 'row',
		justifyContent : 'flex-end',
		alignItems: 'center',
	},
	price_text: {
		fontWeight : 'bold',
		fontSize : 14,
		textAlign : 'right',
		margin : 6,
	},
	product_image : {
		borderRadius : 2,
	},
	shipping_container : {
		padding: 6,
		flexDirection : 'row',
		justifyContent : 'center',
		alignItems : 'center',
	},
	shipping_info_text : {

	}

})


