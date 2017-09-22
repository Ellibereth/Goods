
import React from 'react';
import {Component} from 'react'
import {TouchableOpacity,
		StyleSheet,
		View,
		Text,
		ScrollView,
		TouchableHighlight,
} from 'react-native';
import {Actions} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome'



export default class SelectDropdownButton extends Component {
	
	constructor(props) {
		super(props)
		this.state = {
		}	
	}

	render() {
		return (
				<TouchableHighlight stlye = {{flex : 1}}  onPress={this.props.onPress}>
					<View style = {styles.container}>
						<View style = {styles.left_box}>
							<Text style = {styles.left_text}>{this.props.left_display}</Text>
						</View>
						<View style = {styles.right_box}>
							<Icon
							style = {styles.caret}
							name = "caret-down"/>
						</View>
					</View>
				</TouchableHighlight>
		)
	}
}

const styles = StyleSheet.create({
	container : {
		flexDirection : 'row',
		borderBottomWidth : 1,
		borderColor : 'silver',
		justifyContent : 'flex-start',
		padding : 8,
	},
	left_box : {
		backgroundColor : 'white',
		borderTopLeftRadius : 4,
		borderBottomLeftRadius : 4,
		borderWidth : 1, 
		borderColor : 'silver',
		padding: 6,
	},
	right_box : { 
		backgroundColor: 'silver',
		flexDirection : 'column',
		justifyContent : 'center',
		borderTopRightRadius : 4,
		borderBottomRightRadius : 4,
		borderWidth : 1, 
		borderColor : 'silver',
		borderLeftWidth : 0,
		padding: 6,
	},
	left_text: {
		fontSize : 10
	},
	caret : { 
		color : 'white'
	},
	
})


