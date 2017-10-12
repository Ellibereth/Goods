import React from 'react';
import {Component} from 'react'
import {
		StyleSheet,
		View,
		ScrollView,
		Text, 
		TouchableOpacity,
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
		// returns in the case of no orders made
		if (!this.state.orders.length) {
			return (
				<View style = {{flex :  1, flexDirection : 'column', alignItems : 'center'}}>
					<View style = {{marginTop : 64}}/>
				 	<Text style = {empty_styles.text}>
				 		You have not placed any orders
				 	</Text>
				 	<View style = {{marginTop : 48}}/>
				 	<TouchableOpacity style = {empty_styles.button}
				 	onPress = {() => Actions.sales({type : ActionConst.RESET})}>
				 		<Text style = {empty_styles.button_text}>
				 			See Today's Sales
				 		</Text>
				 	</TouchableOpacity>
				</View>
			)
		}
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

const empty_styles = StyleSheet.create({
	text : {
		fontSize : 20,
		color : '#002868',
	},
	button : {
		paddingHorizontal : 24,
		paddingVertical : 12,
		backgroundColor : 'red',
		borderRadius : 2,
	},
	button_text : {
		fontSize : 20,
		color : 'white',
		fontWeight : 'bold'
	},
})

const styles = StyleSheet.create({
	container : {
		flexDirection : 'column',
		flex : 1,
		// backgroundColor : 'white'
	},
	
})

export default connect(mapStateToProps, mapDispatchToProps)(OrdersScreen);

