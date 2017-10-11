
import React from 'react';
import {Component} from 'react'
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	Image,
	Dimensions,
} from 'react-native'
import {Actions} from 'react-native-router-flux'

const img_src = "https://s3-us-west-2.amazonaws.com/edgarusahomepage/"

export default class HomeMadeInUsaSection extends Component {
	

	constructor(props) {
		super(props)
		this.state = {
	
		}
	}
	
	


	render() {
		return (
				
				<TouchableOpacity style = {styles.container} onPress = {() => Actions.madeinusa()}>
					<Text style = {styles.text}>
						Learn exactly what it means to be Made in USA right here
					</Text>

					<Image 
					style = {[styles.image]}
					source={{uri : img_src + "mia1.jpeg"}} />
					
				</TouchableOpacity>
			

		)
	}
}

const styles = StyleSheet.create({
	container : {
		flexDirection : 'column',
		paddingTop: 8,
		borderTopWidth : 1,
		borderTopColor : 'darkblue',
		backgroundColor : 'white',
	},
	image : {
		height: 175,
		width : Dimensions.get('window').width,	
	},
	text: {
		paddingTop : 0,
		padding : 16,
		fontSize : 20,
		color: 'darkblue'
	}
})



