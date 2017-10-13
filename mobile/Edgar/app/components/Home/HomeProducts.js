
import React from 'react';
import {Component} from 'react'
import {FlatList} from 'react-native'

import {Actions} from 'react-native-router-flux'
import HomeProduct from './HomeProduct'


export default class HomeProducts extends Component {
	constructor(props) {
		super(props)
		this.state = {}
	}


	renderItem(val) {
		return <HomeProduct index = {val.index} product = {val.item}/>	
	}

	render() {
		var products = this.props.home_products % 2 == 0 ? this.props.home_products : this.props.home_products.concat(["PLACE_HOLDER"])
		return (

			<FlatList 
						data = {products}
						renderItem = {this.renderItem}
						keyExtractor = {(item, index) => index}
						numColumns = {2}
					/>
			
		)
	}
}




