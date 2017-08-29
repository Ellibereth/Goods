import React from 'react';
import {Component} from 'react'
import {KeyboardAvoidingView, Platform, Keyboard, ActivityIndicator, ViewContainer, AsyncStorage, AppRegistry, StyleSheet, Text, View, ListView, TouchableOpacity, TouchableHighlight, Navigator} from 'react-native';
import Login from './Account/Login/LoginScreen'
import Home from './Account/Login/HomeScreen'

import Spinner from 'react-native-loading-spinner-overlay';


export default class StartNavigator extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isLoading: true,
			scroll: false
		}
	}
	_renderScene(route, navigator) {
		var globalNavigatorProps = {
			navigator: navigator,
			current_username : this.props.current_username,
			current_user : this.props.current_user,
			asyncStorageLogin : this.props.asyncStorageLogin,
			asyncStorageLogout : this.props.asyncStorageLogout,
			initializeUserInformation : this.props.initializeUserInformation
		}
		var registerNavigatorProps = {
			first_name : route.first_name,
			last_name : route.last_name,
			phone_number : route.phone_number,
			confirmationPin : route.confirmationPin,
			password : route.password,
			email : route.email
		}
		var screen;
		var bar_color = "white"
		

		switch(route.href){
			case "Login":
				screen = (<LoginScreen {...globalNavigatorProps}/>);
				break;
			case "Home":
				screen = (<HomeScreen {...globalNavigatorProps}/>);
				break;
			
			default:
				screen =    (
						<View>
							<TouchableOpacity onPress = {() => this.props.navigator.pop()}>
									<Icon name = "chevron-left" size = {30} />
							</TouchableOpacity>
							<Text> {'BRO! DO NOT GO TO THIS ROUTE ${route}'} </Text>
						</View>
					)
		}
		var spacing = 0;
		if (Platform.OS == 'ios') {
			var top_bar = (<View style = {{paddingTop : 20, backgroundColor : bar_color}} />)
			spacing = 20;
		}
		else var top_bar = <View/>
		if (route.href == "Comment") {
			if (Platform.OS == 'ios')
				return (<KeyboardAvoidingView style = {{flex: 1}} behavior="padding">
					{top_bar}
					{screen}
				</KeyboardAvoidingView>
				);
			else return (
				<View style={{flex : 1}}>
					{top_bar}
					{screen}
				</View>
				);
		}
		else return (
			<View style = {{flex: 1}} >
					{top_bar}
					{screen}
				</View>
			)
	}
	stopScroll() {
		this.setState({ scroll : false });
	}
	startScroll() {
		this.setState({ scroll : true });
	}
	render() {
		var start = ""
		if (this.props.current_username == "" || this.props.current_username == null) {
			start = "Login"
		}
		else {
			start = "Home"
		}
		if (this.props.isLoading) {
			return (
					<View style = {styles.container}>
						<ActivityIndicator style={[styles.centering, styles.white]} color="#cccccc" size="large"/>
					</View>
				)
		}
		else {
			return (
				<View style={styles.container}>
					<View style={{flex : 1}}>
						<Navigator 
						initialRoute = {{href: start}}
						ref = "appNavigator"
						renderScene = {this._renderScene.bind(this)}
						configureScene={(route, routeStack) =>
						Navigator.SceneConfigs.PushFromRight}
						/>
					</View>
				</View>
		) 

		}    
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor : "white"
	},
	centering: {
		flex : 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 8,
	},
	white: {
		backgroundColor: 'white',
	}
});
