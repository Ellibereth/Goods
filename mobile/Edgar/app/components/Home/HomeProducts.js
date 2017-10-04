
import React from 'react';
import {Component} from 'react'
import {ScrollView} from 'react-native'

import {Actions} from 'react-native-router-flux'
import HomeProduct from './HomeProduct'


export default class HomeProducts extends Component {
	constructor(props) {
		super(props)
		this.state = {}
	}


	render() {
		var products = this.props.home_products.map((product, index) => 
				<HomeProduct key = {index} product = {product}/>
			)

		return (
				<ScrollView  
					horizontal = {true}
					showsHorizontalScrollIndicator = {false}>
						{products}
					</ScrollView>
			
		)
	}
}




