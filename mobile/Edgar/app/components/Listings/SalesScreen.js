
import React from 'react';
import {Component} from 'react'
import {View, Text, ScrollView } from 'react-native';
import {Actions} from 'react-native-router-flux'
import {connect} from 'react-redux'
import {getOnSaleProducts} from '../../api/ProductApi'
import HomeProductDisplay from '../Home/HomeProductDisplay'

function mapStateToProps(state) {
	return {
		user : state.user,
	}
}

class SalesScreen extends Component {
	static navigationOptions = {
		title : "Sales"
	};

	constructor(props) {
		super(props)
		this.state = {
			sale_products : [],
		}
	}

	componentDidMount(){
		this.loadSaleProducts()	

	}

	async loadSaleProducts() {
		let data = await getOnSaleProducts()
		if (data.success) {
			this.setState({sale_products : data.products})
		}
	}

	render() {


		var products = this.state.sale_products.map((product, index) => 
				<HomeProductDisplay key = {index} product = {product}/>
			)

		return (
			
				<View style = {{"flex" : 1}}>
					<Text> Sale Products </Text>
					<ScrollView>
						{products}
					</ScrollView>
				</View>
			

		)
	}
}


export default connect(mapStateToProps)(SalesScreen);

