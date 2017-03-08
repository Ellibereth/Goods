import React from 'react';
import {Component} from 'react'
import {Platform, StyleSheet, Text, View, ListView, TouchableOpacity, TouchableHighlight, Navigator} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import BottomTabBar from './BottomTabBar';
import SubmissionForm from './components/SubmissionForm'
import SubmissionList from './components/SubmissionList'

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
		var href = this.props.initialRoute
		return (
				<Navigator 
					initialRoute = {{href: href}}
					ref = "appNavigator"
					renderScene = {this._renderScene.bind(this)}
					configureScene={(route, routeStack) => Navigator.SceneConfigs.PushFromRight}
					navigationBar = {<BottomTabBar navigator={this.refs.appNavigator}/>}
					/>
	 		) 

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
