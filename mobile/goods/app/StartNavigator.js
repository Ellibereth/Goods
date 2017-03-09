import React from 'react';
import {Component} from 'react'
import {Platform, StyleSheet, Text, View, ListView, TouchableOpacity, TouchableHighlight, Navigator} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import BottomTabBar from './BottomTabBar';
import SubmissionForm from './components/SubmissionForm'
import SubmissionList from './components/SubmissionList'
import SubmissionDetailView from './components/SubmissionDetailView'

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
		}
		var screen;
		var bar_color = "white"
		
		switch(route.href){
			case "SubmissionForm":
				screen = (<SubmissionForm {...globalNavigatorProps} />)
				break;
			case "SubmissionList":
				screen = (<SubmissionList {...globalNavigatorProps} />)
				break;
			case "SubmissionDetailView":
				screen = (<SubmissionDetailView submission = {route.submission} {...globalNavigatorProps} />)	
				break;
		 	default:
				screen =  (<View>
							<TouchableOpacity onPress = {() => this.props.navigator.pop()}>
									<Icon name = "chevron-left" size = {30} />
							</TouchableOpacity>
							<Text> {'BRO! DO NOT GO TO THIS ROUTE ${route}'} </Text>
						</View>
					)
			}

			return screen
		}

	render() {
		var initialRoute = "SubmissionList"
		return (
				<Navigator 
					initialRoute = {{href: initialRoute}}
					ref = "appNavigator"
					renderScene = {this._renderScene.bind(this)}
					configureScene={(route, routeStack) => Navigator.SceneConfigs.PushFromRight}
					navigationBar = {<BottomTabBar navigator={this.refs.appNavigator}/>}
					/>
	 		) 

	 }  
}

