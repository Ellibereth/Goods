import React from 'react';
import {Component} from 'react'
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	TextInput,
	Alert
} from 'react-native';
import {dismissKeyboard} from 'react-native-dismiss-keyboard'
import {handleLoginSubmit} from '../../../api/UserService'
import LoadingSpinner from '../../Misc/LoadingSpinner'
import {Actions, ActionConst} from 'react-native-router-flux'

export default class LoginForm extends Component {
	constructor(props) {
		super(props)
		this.state = {
			email : "",
			password: "",
			is_loading : false,
		}
	}

	handleLoginSubmit() {
		this.setState({is_loading : true})
		this.asyncHandleLoginSubmit().then((response)=> {
			this.setState({is_loading : false})
			if (response){
				Actions.home({type : ActionConst.RESET})
			}
		}).done()
	}

	async asyncHandleLoginSubmit() {
		let data = await handleLoginSubmit(this.state.email, this.state.password)
		if (data.success) {
			this.props.setUserInfo(data.user)
			this.props.setJwt(data.jwt)
			return true	
		}
		else {
			console.log("login error", data.error)
			return false
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
			<View style={styles.container}>
				<LoadingSpinner visible = {this.state.is_loading}/>
				<View style={{flex : 1, flexDirection : 'column'}}>
					<View style={{flex : 2}}>
						<View style={{flex : 1}}/>
						<View style={{flex : 1}}>
							<View style={styles.input_wrapper}>
								<TextInput onChangeText = {this.handleEmailChange.bind(this)}
									style = {styles.input}
									placeholder = {"Email"}
									/>
							</View>
						</View>
						<View style={{flex : 0.5}}/>
						<View style = {{flex : 1}}>
							<View style={styles.input_wrapper}>
								<TextInput onChangeText = {this.handlePasswordChange.bind(this)}
									style = {styles.input}
									secureTextEntry = {true}
									placeholder = {"Password"}
									/>
							</View>
						</View>
					</View>
					<View style = {{height : 16}}/>
					<View style = {{flex : 1, alignItems : 'center'}}>
						<TouchableOpacity style={{flex : 1}} onPress = {this.handleLoginSubmit.bind(this)}>
							<View style = {styles.button}>
								<Text style={styles.button_text}>Sign In</Text>
							</View>
						</TouchableOpacity>
					</View>
					<View style = {{flex : 3}}/>
				</View>
			</View>
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
		backgroundColor : "#002868",
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
