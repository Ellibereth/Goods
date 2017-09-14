import React from 'react';
import {Component} from 'react'
import {
		StyleSheet,
		View,
		ScrollView,
} from 'react-native';
import {Actions} from 'react-native-router-flux'
import {connect} from 'react-redux'
import { ActionCreators } from  '../../../actions'
import {bindActionCreators} from 'redux'
import {getUserOrders} from '../../../api/UserService'

import Icon from 'react-native-vector-icons/FontAwesome'
import OrderDisplay from './OrderDisplay'

const img_src = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"

function mapDispatchToProps(dispatch) {
	return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
	return {
		user : state.user,
		jwt : state.jwt
	}
}


class OrdersScreen extends Component {

	constructor(props) {
		super(props)
		this.state = {
			orders: [],
		}
	}

	async getUserOrders() {
		let data = await getUserOrders(this.props.jwt)
		if (data.success){
			this.setState({
				orders : data.orders
			})
		}
	}

	componentDidMount() {
		this.getUserOrders()
	}
	
	render() {
		return (
				<View style = {styles.container}>
					<ScrollView>
						{this.state.orders.map((order,index) => 
							<OrderDisplay order = {order} key = {index}/>
						)}
					</ScrollView>
				</View>
		)
	}
}

const styles = StyleSheet.create({
	container : {
		flexDirection : 'column',
		flex : 1,
		// backgroundColor : 'white'
	},
	
})

export default connect(mapStateToProps, mapDispatchToProps)(OrdersScreen);

