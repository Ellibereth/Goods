import React from 'react';
import {Component} from 'react'
import {
	View,
	Text,
} from 'react-native';
import {Actions} from 'react-native-router-flux'
import {connect} from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'
import IconBadge from 'react-native-icon-badge'

function mapStateToProps(state) {
	return {
		user : state.user
	}
	this.getCartIcon = this.getCartIcon.bind(this);
}

class CartIcon extends Component {

	constructor(props) {
		super(props)
		this.state = {
		}
	}

	navigateToCart(){
		Actions.cart()
	}

	render() {
		

		var badge_count = this.props.user.cart_size
		return (
			 <IconBadge
				MainElement={
					<Icon 
						onPress = {this.navigateToCart}
						name = "shopping-cart"
						size = {24}
						style = {{paddingRight : 12}}
					/>
				}
				BadgeElement={
					<Text style={{color:'white', fontSize : 10}}>{badge_count}</Text>
				}
				IconBadgeStyle={{
					position:'absolute',
					top:-8,
					right:2,
					minWidth : 10,
					width:18,
					height:18,
					borderRadius:18,
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: '#FF0000',
					borderColor : 'white',
					borderWidth : 1
				}}
				Hidden={!badge_count}
			/>	
		)
				
	}
}


export default connect(mapStateToProps)(CartIcon);