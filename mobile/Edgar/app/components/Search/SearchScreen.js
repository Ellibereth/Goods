
import React from 'react';
import {Component} from 'react'
import {View, Text, FlatList, StyleSheet} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {connect} from 'react-redux'
import {searchProducts} from '../../api/ProductService'
import LoadingSpinner from '../Misc/LoadingSpinner'
// import SearchProduct from './SearchProduct'
import HomeProduct from '../Home/HomeProduct'


function mapStateToProps(state) {
	return {
		user : state.user,
	}
}


class SearchScreen extends Component {
	constructor(props) {
		super(props)
		this.state = {
			products : [],
			is_loading : true
		}
		this.searchProducts = this.searchProducts.bind(this)
		this.setLoading = this.setLoading.bind(this)
	}

	setLoading(is_loading){
		this.setState({is_loading : is_loading})
	}

	componentDidMount(){
		this.searchProducts()	
	}

	

	async searchProducts() {
		this.setLoading(true)
		let data = await searchProducts(this.props.search_text, false)
		this.setLoading(false)
		if (data.success) {
			this.setState({products : data.products, is_loading : false})
		}
	}

	
	renderItem({item}) {
		return <HomeProduct 
		product = {item}/>
	}

	render() {

		var products = this.state.products % 2 == 0 ? this.state.products : this.state.products.concat(["PLACE_HOLDER"])
		return (
				<View style = {{"flex" : 1, backgroundColor : "white"}}>
					<LoadingSpinner visible = {this.state.is_loading}/>
					<View style = {{flex : 1, paddingHorizontal : 8, paddingVertical : 4}}>
						<Text>{'Showing search results for \'' + this.props.search_text + "\'"}</Text>
					</View>
					<View style = {[styles.scroll_wrapper, {flex : 14}]}>
						<FlatList data = {products}
						renderItem = {this.renderItem}
						keyExtractor = {(item, index) => index}
						numColumns = {2}
						/>

					</View>
				</View>
			

		)
	}
}

const styles = StyleSheet.create({
	scroll_wrapper : {

	}
})


export default connect(mapStateToProps)(SearchScreen);

