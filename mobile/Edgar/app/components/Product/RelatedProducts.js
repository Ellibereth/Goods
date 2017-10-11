import React from 'react';
import {Component} from 'react'
import {StyleSheet, Text, View} from 'react-native';
import {formatPrice} from '../../util/Format.js'
import {getRelatedProducts} from '../../api/ProductService'
import RelatedProductDisplay from './RelatedProductDisplay'


export default class RelatedProducts extends Component {

	constructor(props) {
		super(props)
		this.state = {	
			related_products : []
		}
	}

	async componentDidMount(){
		let data = await getRelatedProducts(this.props.product.product_id)
		if (data.success) {
			if (data.related_products){
				this.setState({related_products : data.related_products})	
			}
		}
	}


	render() {
		return (
			<View style = {styles.container}>
				{/*<View style = {styles.title_container}>
					<Text style = {styles.title_text}>
						YOU MIGHT ALSO LIKE
					</Text> 
				</View>*/}

				{this.state.related_products &&
						this.state.related_products.map((product, index) => 
							<RelatedProductDisplay product = {product} key = {index}/>
					)
				} 
			</View>
		
		);
  	}
}


const styles = StyleSheet.create({
	container : { 
		flex : 1,
		paddingTop : 20,
		flexDirection : 'column',
		justifyContent : 'center',
		alignItems : 'center'
	},
	title_container : {
		padding: 12,
		borderTopWidth : 1,
		borderColor : 'silver',
	},
	title_text : {
		textAlign : "center",
		fontSize : 20
	}
});
			






