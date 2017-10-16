
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
		Dimensions
} from 'react-native';

import {formatPrice, toTitleCase} from '../../util/Format'

import Icon from 'react-native-vector-icons/FontAwesome'
import ModalPicker from '../Misc/ModalPicker'


const img_src = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"

export default class ProductVariantPicker extends Component {

	constructor(props) {
		super(props)
		this.state = {
			show_variant_picker : false,
		}
		this.setVariantPicker = this.setVariantPicker.bind(this)
	}

	setVariantPicker(show_variant_picker){
		this.setState({show_variant_picker : show_variant_picker})
	}

	render() {
		
		return (
			
		
			<View style = {variant_styles.container}>
				{/* <View style = {{flex : 1}}/>
				<View style = {variant_styles.content_container}>
					<TouchableOpacity style = {variant_styles.picker_container}
						onPress = {()=>this.setVariantPicker(true)}>
						<Text style = {variant_styles.picker_title}>
							{toTitleCase(this.props.product.variant_type_description) + ": " +
								(this.props.variant ? this.props.variant.variant_type : "No Variant Selected")}
						</Text>
						<View style ={variant_styles.caret_container}>
							<Icon name = {"caret-down"} 
							style = {variant_styles.caret}/>
						</View>
					</TouchableOpacity>
				</View> */}


				<ModalPicker 
					preview_styles = {picker_preview_styles}
					show_picker = {this.state.show_variant_picker}
					setPicker = {this.setVariantPicker}
					selected_value = {this.props.variant && this.props.variant.variant_type}
					values = {this.props.product.variants.map((variant, index) => index)}
					labels = {this.props.product.variants.map((variant, index) => variant.variant_type)}
					onChange = {(index) => this.props.updateVariant(index)}
				/>
			</View>


		)
	}
}

const picker_preview_styles = StyleSheet.create({
	container : {
		padding : 8,
		width : Dimensions.get('window').width * 0.9,
		flexDirection : 'row',
		borderWidth : 1,
		borderRadius : 4,
		justifyContent : "space-between"
	},
	text_container : {
	},
	text : {
		fontSize : 20,
	}, 
	icon_container :{ 
		flexDirection : "row",
		justifyContent : 'center',
		alignItems : "center"
	},
	icon : {
		fontSize : 20,
	}
})

const variant_styles = StyleSheet.create({
	container : {
		flexDirection : 'row',
		paddingTop : 8,
		paddingBottom : 12,
		justifyContent : "center"
	},
})


