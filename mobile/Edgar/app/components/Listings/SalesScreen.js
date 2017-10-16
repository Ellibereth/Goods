
import React from 'react';
import {Component} from 'react'
import {View, Text, FlatList } from 'react-native';
import {Actions} from 'react-native-router-flux'
import {connect} from 'react-redux'
import {getProductsByListing} from '../../api/ProductService'
import HomeProduct from '../Home/HomeProduct'

const SALES_TAG = "Sales_Tag"
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
		let data = await getProductsByListing(SALES_TAG)
		if (data.success) {
			this.setState({sale_products : data.products})
		}
	}

	renderItem(val) {
		return <HomeProduct index = {val.index} product = {val.item}/>
	}

	render() {

		var products = this.state.sale_products % 2 == 0 ? this.state.sale_products : this.state.sale_products.concat(["PLACE_HOLDER"])
		return (
			
				<View style = {{"flex" : 1, backgroundColor : "white"}}>
					<FlatList 
						data = {products}
						renderItem = {this.renderItem}
						keyExtractor = {(item, index) => index}
						numColumns = {2}
					/>
				</View>
			

		)
	}
}


export default connect(mapStateToProps)(SalesScreen);

