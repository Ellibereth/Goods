import React from 'react';
import {Component} from 'react'
import {StyleSheet, TouchableHighlight, Text, View} from 'react-native';
import {Actions} from 'react-native-router-flux';

export default class SignInScreen extends Component {
	constructor(props) {
		super(props)
		this.state = {
		}
	}

	render() {
		return (
				
				<View style = {styles.container}>
					<View style = {{height : 30}}/>
					<TouchableHighlight style = {styles.button}
					 onPress = {()=> Actions.login()}>
						<View>
							<Text style = {styles.button_text}>
								Sign In
							</Text>
						</View>
					</TouchableHighlight>

					<View style = {{height : 30}}/>

					<View
						style={styles.hr}
					/>

					<View style = {{height : 30}}/>

					<View style = {styles.description_container}>
						<Text style = {styles.description_text}>
							Don't have an account yet? 
						</Text>
						<Text style = {styles.description_text}>
							Join Edgar USA today.
						</Text>
					</View>

					<View style = {{height : 30}}/>

					<TouchableHighlight style = {styles.button}
					 onPress = {()=> Actions.register()}>
						<View>
							<Text style = {styles.button_text}>
								Sign Up
							</Text>
						</View>
					</TouchableHighlight>
				</View>
		)
	}
}


const styles = StyleSheet.create({
	container: {
		flexDirection : "column",
		justifyContent : "center",
		alignItems: "center",
	},
	button : {
		backgroundColor : "#002868",
		padding : 12,
		borderRadius : 8,
		width : 250
	},
	button_text : {
		color: 'white',
		textAlign : 'center'
	},
	hr : {
		borderBottomColor: 'grey',
		borderBottomWidth: 0.5,
		width : 250,
  	},
  	description_container : {
  		width : 200,
  	},
  	description_text : {
  		textAlign : 'center',
  		color : 'grey',
  		fontFamily : "Arial"
  	}

})
