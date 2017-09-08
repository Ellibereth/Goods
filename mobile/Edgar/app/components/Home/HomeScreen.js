
import React from 'react';
import {Component} from 'react'
import {View, Text, Button, ScrollView } from 'react-native';
import {Actions} from 'react-native-router-flux'
import {connect} from 'react-redux'
import {getProductsByListing} from '../../api/ProductApi'
import HomeProductDisplay from './HomeProductDisplay'

const HOME_TAG = "Home_Page"

function mapStateToProps(state) {
	return {
		user : state.user,
	}
}


class HomeScreen extends Component {
	static navigationOptions = {
		title : "Home"
	};

	constructor(props) {
		super(props)
		this.state = {
			home_products : [],
		}
		this.loadHomeProducts = this.loadHomeProducts.bind(this)
	}

	componentDidMount(){
		this.loadHomeProducts()	

	}

	async loadHomeProducts() {
		let data = await getProductsByListing(HOME_TAG)
		if (data.success) {
			this.setState({home_products : data.products})
		}
	}

	


	render() {
		var products = this.state.home_products.map((product, index) => 
				<HomeProductDisplay key = {index} product = {product}/>
			)

		return (
			
				<View style = {{"flex" : 1}}>
					<Text> Home Products </Text>
					<ScrollView>
						{products}
					</ScrollView>
				</View>
			

		)
	}
}


export default connect(mapStateToProps)(HomeScreen);

