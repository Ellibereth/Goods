
import React from 'react';
import {Component} from 'react'
import {View, Text, Button, ScrollView } from 'react-native';
import {Actions} from 'react-native-router-flux'
import {connect} from 'react-redux'
import { ActionCreators } from  '../../actions'
import {bindActionCreators} from 'redux'

import HomeProductDisplay from './HomeProductDisplay'



function mapDispatchToProps(dispatch) {
	return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
	return {
		user : state.user,
		home_products : state.home_products
	}
}


class HomeScreen extends Component {
	static navigationOptions = {
		title : "Home"
	};

	constructor(props) {
		super(props)
		this.state = {

		}
	}

	componentDidMount(){
		this.loadHomeProducts()			

	}

	loadHomeProducts() {
		if (this.props.home_products.length == 0) {		
			this.props.getHomeProducts()	
		}
	}


	render() {
		var products = this.props.home_products.map((product, index) => 
				<HomeProductDisplay key = {index} product = {product}/>
			)

		return (
			
				<View style = {{"flex" : 1}}>
					<Text> Products </Text>
					<ScrollView>
						{products}
					</ScrollView>
				</View>
			

		)
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

