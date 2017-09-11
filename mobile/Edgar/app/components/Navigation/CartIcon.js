
import React from 'react';
import {Component} from 'react'
import {TouchableOpacity,
		Picker,
		StyleSheet,
		View,
		Text,
		Button,
		ScrollView,
		Image,
		Alert,
		Modal,
		TouchableHighlight
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

	componentDidMount(){	
		
	}

	render() {
		var current_scene = Actions.currentScene
		if (current_scene == 'cart' || current_scene == 'checkout') {
			return <View/>
		}

		// var badge_count = 0
		var badge_count = this.props.user.cart_size
		return (
			 <IconBadge
				MainElement={
					<Icon 
						onPress = {() => Actions.cart()}
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

const styles = StyleSheet.create({
		
})


export default connect(mapStateToProps)(CartIcon);