import React from 'react';
import {Component} from 'react'
import {
	TouchableWithoutFeedback,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	TextInput
} from 'react-native';
import {dismissKeyboard} from 'react-native-dismiss-keyboard'
import {updatePassword} from '../../../../api/UserService'
import {Actions, ActionConst} from 'react-native-router-flux'

export default class UpdatePasswordForm extends Component {
	constructor(props) {
		super(props)
		this.state = {
			old_password: "",
			password: "",
			password_confirm : "",
		}
	}

	componentDidMount(){
		
	}

	handleUpdatePasswordPress() {
		this.asyncUpdatePassword().then((response)=> {
			if (response){
				Actions.pop()	
			}
		}).done()
	}

	async asyncUpdatePassword() {
		
		let data = await updatePassword(
			this.props.jwt, 
			this.state.old_password,
			this.state.password,
			this.state.password_confirm
		)
		if (data.success) {
			this.props.setUserInfo(data.user)
			return true	
		}
		else {
			console.log("update password error", data.error)
			return false
		}
	}
	

	render() {

		return (
			<TouchableWithoutFeedback 
			// onPress={() => dismissKeyboard()}
			>
				<View style={styles.container}>
					<View style={{flex : 1, flexDirection : 'column'}}>
						<View style={{flex : 2}}>
							<View style = {{flex : 1}}/>
							<View style={{flex : 2}}>
								<View style={styles.input_wrapper}>
									<TextInput
										onChangeText = {(old_password) => this.setState({old_password})}
										style = {styles.input}
										secureTextEntry = {true}
										placeholder = {"Old Password"}
										/>
								</View>
							</View>
							<View style={{flex : 0.5}}/>
							<View style = {{flex : 2}}>
								<View style={styles.input_wrapper}>
									<TextInput
									 onChangeText = {(password) => this.setState({password})}
										style = {styles.input}
										secureTextEntry = {true}
										placeholder = {"Password"}
										/>
								</View>
							</View>
							<View style={{flex : 0.5}}/>
							<View style = {{flex : 2}}>
								<View style={styles.input_wrapper}>
									<TextInput
									 onChangeText = {(password_confirm) => this.setState({password_confirm})}
										style = {styles.input}
										secureTextEntry = {true}
										placeholder = {"Confirm Password"}
										/>
								</View>
							</View>
						</View>
						<View style = {{height : 16}}/>
						<View style = {{flex : 1, alignItems : 'center'}}>
							<TouchableOpacity style={{flex : 1}} onPress = {this.handleUpdatePasswordPress.bind(this)}>
								<View style = {styles.button}>
									<Text style={styles.button_text}>Save Changes</Text>
								</View>
							</TouchableOpacity>
						</View>
						<View style = {{flex : 2}}/>
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
		backgroundColor : "#002868",
		padding : 12,
		borderRadius : 4,
		width : 250
	},
	button_text : {
		color: 'white',
		textAlign : 'center'
	},
	forgot_password : {fontSize : 12, color : 'lightseagreen'},
	label : {flex : 0, fontSize : 12, fontWeight : 'bold', color : '#696969'},
	input_wrapper : {flex : 1, borderColor : 'silver', borderWidth : 1, borderRadius : 4},
	input : {flex : 1, width : 240, fontSize : 14, justifyContent : 'flex-start', padding: 6},
	input_label : {
		fontSize: 14,
		marginBottom : 4, 
		marginLeft : 0

	}
});
