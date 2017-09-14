import React from 'react';
import {Component} from 'react'
import {
	StyleSheet,
	Text,
	View,
	ListView,
	TouchableOpacity,
	TextInput
} from 'react-native';
import {dismissKeyboard} from 'react-native-dismiss-keyboard'
import {handleRegisterSubmit} from '../../../api/UserService'
import {Actions} from 'react-native-router-flux'

export default class RegisterScreen extends Component {
	constructor(props) {
		super(props)
		this.state = {
			name : "",
			email : "",
			password: "",
			password_confirm : "",
		}	
	}

	registerAccount(){
		this.handleRegisterSubmit().then(() => {
			Actions.account({type : ActionConst.RESET})
			Actions.home({type : ActionConst.REPLACE})
		})
	}

	async handleRegisterSubmit() {
		let data = await handleRegisterSubmit(
				this.state.name, 
				this.state.email,
				this.state.password, 
				this.state.password_confirm
			)
		if (data.success){
			console.log("success")
		}
		else {
			Alert.alert(
			  data.error.title,
			  data.error.text,
			  [
			    {text: 'OK', onPress: () => console.log('OK Pressed')},
			  ],
			  { cancelable: false }
			)
		}
	}
	
	
	handleTextChange(field, value) {
		var obj = this.state
		obj[field] = value
		this.setState(obj)
	}


	render() {
		return (
		<TouchableWithoutFeedback onPress={() => dismissKeyboard()}>
			<View style={styles.container}>
				<View style={{flex : 1, flexDirection : 'column'}}>
					<View style={{flex : 2}}>
						<View style={{flex : 1}}/>

						<View style = {{flex : 1}}>
							<View style={styles.input_wrapper}>
								<TextInput onChangeText = {this.handleTextChange.bind(this, 'name')}
									style = {styles.input}
									placeholder = {"Name"}
									/>
							</View>
						</View>

						<View style={{flex : 0.5}}/>
						<View style={{flex : 1}}>
							<View style={styles.input_wrapper}>
								<TextInput 
								onChangeText = {this.handleTextChange.bind(this, 'email')}
									style = {styles.input}
									placeholder = {"Email"}
									/>
							</View>
						</View>
						<View style={{flex : 0.5}}/>
						<View style = {{flex : 1}}>
							<View style={styles.input_wrapper}>
								<TextInput onChangeText = {this.handleTextChange.bind(this, 'password')}
									style = {styles.input}
									secureTextEntry = {true}
									placeholder = {"Password"}
									/>
							</View>
						</View>
						<View style={{flex : 0.5}}/>
						<View style = {{flex : 1}}>
							<View style={styles.input_wrapper}>
								<TextInput onChangeText = {this.handleTextChange.bind(this, 'password_confirm')}
									style = {styles.input}
									secureTextEntry = {true}
									placeholder = {"Password Confirm"}
									/>
							</View>
						</View>
					</View>
					<View style = {{height : 24}}/>
					<View style = {{flex : 1, alignItems : 'center'}}>
						<TouchableOpacity style={{flex : 1}} onPress = {this.registerAccount.bind(this)}>
							<View style = {styles.button}>
								<Text style={styles.button_text}>Register</Text>
							</View>
						</TouchableOpacity>
					</View>
					<View style = {{flex : 1}}/>
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
		backgroundColor : "black",
		padding : 12,
		borderRadius : 8,
		width : 250
	},
	button_text : {
		color: 'white',
		textAlign : 'center'
	},
	forgot_password : {fontSize : 12, color : 'lightseagreen'},
	label : {flex : 0, fontSize : 12, fontWeight : 'bold', color : '#696969'},
	input_wrapper : {flex : 1, borderColor : 'silver', borderWidth : 1, borderRadius : 6},
	input : {flex : 1, width : 240, fontSize : 14, justifyContent : 'flex-start', padding: 6},
});
