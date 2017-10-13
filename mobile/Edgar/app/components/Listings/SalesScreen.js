
import React from 'react';
import {Component} from 'react'
import {View, Text, FlatList } from 'react-native';
import {Actions} from 'react-native-router-flux'
import {connect} from 'react-redux'
import {getOnSaleProducts} from '../../api/ProductService'
import HomeProduct from '../Home/HomeProduct'

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

	renderItem(val) {
		return <HomeProduct index = {val.index} product = {val.item}/>
	}

	render() {

		var products = this.state.sale_products % 2 == 0 ? this.state.sale_products : this.state.sale_products.concat(["PLACE_HOLDER"])
		return (
			
				<View style = {{"flex" : 1}}>
					<FlatList 
						data = {this.products}
						renderItem = {this.renderItem}
						keyExtractor = {(item, index) => index}
						numColumns = {2}
					/>
				</View>
			

		)
	}
}


export default connect(mapStateToProps)(SalesScreen);

