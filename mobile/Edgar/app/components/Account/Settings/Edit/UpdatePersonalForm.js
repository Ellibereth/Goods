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
import {updateSettings} from '../../../../api/UserService'
import {Actions, ActionConst} from 'react-native-router-flux'

export default class UpdatePersonalForm extends Component {
	constructor(props) {
		super(props)
		this.state = {
			email : "",
			name: ""
		}
	}

	componentDidMount(){
		this.setState({
			email : this.props.user.email,
			name : this.props.user.name
		})
	}

	handleUpdateSettingsPress() {
		this.asyncUpdateSettings().then((response)=> {
			if (response){
				Actions.pop()	
			}
		}).done()
	}

	async asyncUpdateSettings() {
		var new_settings = {
			email : this.state.email,
			name : this.state.name
		}
		let data = await updatePersonalSettings(this.props.jwt, new_settings)
		if (data.success) {
			this.props.setUserInfo(data.user)
			return true	
		}
		else {
			console.log("update settings error", data.error)
			return false
		}
	}
	
	handleNameChange(name) {
		this.setState({name: name})
	}
	handleEmailChange(email) {
		this.setState({email : email})
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
							<Text style  = {styles.input_label}>
								NAME
							</Text>
							<View style={styles.input_wrapper}>
								<TextInput onChangeText = {this.handleNameChange.bind(this)}
									style = {styles.input}
									placeholder = {"Name"}
									value = {this.state.name}
									/>
							</View>
						</View>
						<View style={{flex : 0.5}}/>
						<View style = {{flex : 2}}>
							<Text style  = {styles.input_label}>
								EMAIL
							</Text>
							<View style={styles.input_wrapper}>
								<TextInput onChangeText = {this.handleEmailChange.bind(this)}
									style = {styles.input}
									value = {this.state.email}
									/>
							</View>
						</View>
					</View>
					<View style = {{height : 16}}/>
					<View style = {{flex : 1, alignItems : 'center'}}>
						<TouchableOpacity style={{flex : 1}} onPress = {this.handleUpdateSettingsPress.bind(this)}>
							<View style = {styles.button}>
								<Text style={styles.button_text}>Update Settings</Text>
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
