
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

import {formatPrice, toTitleCase} from '../../util/Format'

import Icon from 'react-native-vector-icons/FontAwesome'
import SimplePicker from 'react-native-simple-picker'


const img_src = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"

export default class ProductVariantPicker extends Component {

	constructor(props) {
		super(props)
		this.state = {
		}
	}


	render() {
		
		return (
			
		
			<View style = {variant_styles.container}>
				<View style = {{flex : 1}}/>
				<View style = {variant_styles.content_container}>
					<TouchableOpacity style = {variant_styles.picker_container}
						onPress = {()=>this.refs.variant_picker.show()}>
						<Text style = {variant_styles.picker_title}>
							{toTitleCase(this.props.product.variant_type_description) + ": " +
								(this.props.variant ? this.props.variant.variant_type : "No Variant Selected")}
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
						this.props.updateVariant(index)			
					}}
				/>
			</View>


		)
	}
}

const variant_styles = StyleSheet.create({
	container : {
		flexDirection : 'row',
		paddingTop : 8,
		paddingBottom : 12
	},
	picker_container : {
		flex : 1,
		flexDirection : "row",
		alignItems : 'flex-start',
		justifyContent : 'center',
		borderWidth : 1,
		borderColor : 'silver',
		padding : 14,
	},
	content_container : { 
		flex: 10,
	},
	picker_title : {
		flex: 4,
	},
	caret_container: {
		flex : 1,
		flexDirection : 'column',
		justifyContent : 'center',
		alignItems : 'flex-end'
	},
	caret : {
		flex : 1,
		fontSize : 16,
		flexDirection : 'row',
	},
})


