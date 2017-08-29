import React from 'react';
import {Component} from 'react'
import {Alert, TouchableWithoutFeedback, Text, ActivityIndicator, NetInfo, AsyncStorage, Platform, AppState, AppRegistry, StyleSheet, TabBarIOS, View} from 'react-native';
import StartNavigator from './navigation/StartNavigator'
import dismissKeyboard from 'react-native-dismiss-keyboard';
import {
	setCustomView,
	setCustomTextInput,
	setCustomText,
	setCustomImage,
	setCustomTouchableOpacity
} from 'react-native-global-props';

const url = "www.edgarusa.com"

const customTextProps = {
	style: {
		fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'Roboto',
		letterSpacing : 0
	}
};
const customTextInputProps = {
	style: {
		fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'Roboto',
		letterSpacing : 0
	},
	underlineColorAndroid: "transparent"
};

setCustomText(customTextProps);
setCustomTextInput(customTextInputProps);

export default class Index extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			isConnected : null,
			current_user : {},
			current_username: "",
			isLoading: true,
			feed: [],
			notifications: []
		}
	}


	getUserInfo(){
		if (this.state.current_username) {
			AsyncStorage.getItem("jwt", (error, result) => {
				if (!result) {
					this.asyncStorageLogout.bind(this)();
				}
				else {
					fetch(url + "/getUserInfo", {
						method: "POST",
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							username: this.state.current_username,
							jwt : result
						})
					})
					.then((response) => response.json())
					.then((responseData) => {
						if (responseData.result != 'success') {
							this.asyncStorageLogout.bind(this)();
						}
						else {
							this.setState({current_user : responseData.thisUser}, this.getNotifications.bind(this));
						}
					})
					.catch((error) => {
						Alert.alert(error);
					})
					.done();
				}
			});
		}
	}

	componentWillUnmount(){
		
	}
	componentDidMount() {
		this.getUserInfo()
	}

	render() {
		return (
			
				<View style = {styles.container}>
					<TouchableWithoutFeedback onPress={() => dismissKeyboard()}>
						<StartNavigator 
							getUserInfo = {this.getUserInfo.bind(this)}
						/> 
					</TouchableWithoutFeedback>
				</View>
			
			)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor : "#F5FCFF"
	},
	centering: {
		flex : 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 8,
	},
	white: {
		backgroundColor: 'skyblue',
	}
});

