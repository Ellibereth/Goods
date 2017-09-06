
import React from 'react';
import {Component} from 'react'
import {Alert, Image, TouchableWithoutFeedback, KeyboardAvoidingView, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import {handleLoginSubmit} from '../../../api/UserApi'

export default class LoginScreen extends Component {
	constructor(props) {
		super(props)
		this.state = {
			email : "",
			password: ""
		}
		
	}

	
	async handleLoginSubmit() {
		let data = await handleLoginSubmit(this.state.email, this.state.password)
		if (data.success) {
			this.props.loadUser(data.jwt)	
		}
	}
	
	
	handlePasswordChange(password) {
		this.setState({password: password})
	}
	handleEmailChange(email) {
		this.setState({email : email})
	}

	render() {
		return (
		<TouchableWithoutFeedback onPress={() => dismissKeyboard()}>
			<View style={styles.container}>
				<View style={{flex : 1, flexDirection : 'column'}}>
					<View style={{flex : 2}}>
						<View style={{flex : 1}}/>
						<View style={{flex : 1}}>
							<Text style={styles.label}>EMAIL</Text>
							<View style={styles.input_wrapper}>
								<TextInput onChangeText = {this.handleEmailChange.bind(this)}
									style = {styles.input}/>
							</View>
						</View>
						<View style={{flex : 0.5}}/>
						<View style = {{flex : 1}}>
							<Text style={styles.label}>PASSWORD</Text>
							<View style={styles.input_wrapper}>
								<TextInput onChangeText = {this.handlePasswordChange.bind(this)}
									style = {styles.input}
									secureTextEntry = {true}
									/>
							</View>
						</View>
					</View>
					<View style = {{flex : 1, alignItems : 'center'}}>
						<TouchableOpacity style={{flex : 1}} onPress = {this.handleLoginSubmit.bind(this)}>
							<View style = {styles.button}>
								<Text style={styles.button_text}>Log In</Text>
							</View>
						</TouchableOpacity>
					</View>
					<View style = {{flex : 3}}/>
				</View>
			</View>
		</TouchableWithoutFeedback>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems : 'center',
		backgroundColor: "white",
	},
	button : {
		flex : 1,
		backgroundColor : '#90d7ed',
		borderRadius:60,
		justifyContent : 'center',
		alignItems : 'center',
		width : 150,
		height : 15
	},
	button_text : {color : 'white', fontWeight : 'bold', fontSize : 14},
	forgot_password : {fontSize : 12, color : 'lightseagreen'},
	label : {flex : 0, fontSize : 12, fontWeight : 'bold', color : '#696969'},
	input_wrapper : {flex : 1, borderBottomColor : 'silver', borderBottomWidth : 1},
	input : {flex : 1, width : 220, fontSize : 14, justifyContent : 'flex-start', paddingBottom: 0},
});
