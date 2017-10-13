
import React from 'react';
import {Component} from 'react'
import {View, Text, ScrollView, StyleSheet, Dimensions} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {connect} from 'react-redux'
import {getProductsByListing} from '../../api/ProductService'
import HomeProducts from './HomeProducts'
import LoadingSpinner from '../Misc/LoadingSpinner'
import HomeMadeInUsaSection from './HomeMadeInUsaSection'


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
		let data = await getProductsByListing(HOME_TAG, false)
		if (data.success) {
			this.setState({home_products : data.products})
		}
	}

	render() {
		return (
				<View style = {[{flex : 1}, styles.container]}>
					<LoadingSpinner visible = {this.state.home_products.length == 0}/>
					<ScrollView style = {styles.scroll_wrapper}>
						<HomeMadeInUsaSection />
						<View>
							<Text style = {{fontSize : 18, padding : 12, paddingBottom : 4}}>
								Hot Products
							</Text>
						</View>
						<View style = {styles.home_product_wrapper}>
							<HomeProducts home_products = {this.state.home_products}/>
						</View>

						
						
					</ScrollView>
				</View>
		)
	}
}

const styles = StyleSheet.create({
	scroll_wrapper : {
		paddingBottom : 40,
	},
	home_product_wrapper : {

	},
	container : {
		backgroundColor : "white"
	}
})


export default connect(mapStateToProps)(HomeScreen);

