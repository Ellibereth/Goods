
import React from 'react';
import {Component} from 'react'
import {View, Text, FlatList, StyleSheet} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {connect} from 'react-redux'
import {searchProducts} from '../../api/ProductService'
import LoadingSpinner from '../Misc/LoadingSpinner'
import SearchProduct from './SearchProduct'

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
	}

	componentDidMount(){
		this.searchProducts()	

	}

	

	async searchProducts() {
		let data = await searchProducts(this.props.search_text, false)
		if (data.success) {
			this.setState({products : data.products, is_loading : false})
		}
	}

	
	renderItem({item}) {
		return <SearchProduct 
		product = {item}/>
	}

	render() {
		return (
				<View style = {{"flex" : 1}}>
					{/* <LoadingSpinner visible = {this.state.is_loading}/> */}
					<View style = {{flex : 1, paddingHorizontal : 8, paddingVertical : 4}}>
						<Text>{'Showing search results for \'' + this.props.search_text + "\'"}</Text>
					</View>
					<View style = {[styles.scroll_wrapper, {flex : 14}]}>
						<FlatList data = {this.state.products}
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

