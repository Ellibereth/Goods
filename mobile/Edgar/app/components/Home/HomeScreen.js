
import React from 'react';
import {Component} from 'react'
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {Actions} from 'react-native-router-flux'
import {connect} from 'react-redux'
import {getProductsByListing} from '../../api/ProductService'
import HomeProducts from './HomeProducts'
import Swiper from 'react-native-swiper'

const HOME_TAG = "Home_Page"
const img_src = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"

function mapStateToProps(state) {
	return {
		user : state.user,
	}
}


class HomeScreen extends Component {
	

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
		// let data = await getProductsByListing(HOME_TAG)
		// if (data.success) {
		// 	this.setState({home_products : data.products})
		// }
	}

	


	render() {
		
		

		return (
			
				<View style = {{"flex" : 1}}>
					<View style = {styles.scroll_wrapper}>
						<HomeProducts home_products = {this.state.home_products}/>
					</View>
				</View>
			

		)
	}
}

const styles = StyleSheet.create({
	scroll_wrapper : {
		height : 225
	}
})


export default connect(mapStateToProps)(HomeScreen);

