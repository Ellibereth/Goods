
import React from 'react';
import {Component} from 'react'
import {View, Text, Button, ScrollView } from 'react-native';
import {Actions} from 'react-native-router-flux'
import {connect} from 'react-redux'
import { ActionCreators } from  '../../actions'
import {bindActionCreators} from 'redux'


const url = "https://www.edgarusa.com"
const test_url = "http://0.0.0.0:5000"

function mapDispatchToProps(dispatch) {
	return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
	return {
		user : state.user,
	}
}


class ProductScreen extends Component {
	static navigationOptions = {
		title : "Product"
	};

	constructor(props) {
		super(props)
		this.state = {
			product: {},
		}
		this.getProductInfo = this.getProductInfo.bind(this);
	}

	componentDidMount(){	
		this.getProductInfo()
	}

	getProductInfo() {
		console.log(this.props.product_id)
		var form_data = JSON.stringify({
			"product_id" : this.props.product_id.toString(),
		})

		fetch(test_url + "/getMarketProductInfo", {method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
				body: form_data
			})
			.then((response) => response.json())
			.then((responseData) => {
				if (responseData.success) {
					this.setState({
						product : responseData.product
					})
				}
				else {
					console.log(responseData.error)
				}
			})
			.catch((error) => {
				console.log(error)
			})
			.done();
	}


	render() {
		return (
			
				<View style = {{"flex" : 1}}>
					<Text> Product Screen </Text>
					<Text> {this.state.product.name} </Text>
					<Text> {this.state.product.manufacturer} </Text>
				</View>
			

		)
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(ProductScreen);

