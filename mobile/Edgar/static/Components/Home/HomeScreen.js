import Spinner from 'react-native-loading-spinner-overlay';
import React from 'react';
import {Component} from 'react'
import {InteractionManager, ActivityIndicator, Picker, RCTAnimation, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput,
			Alert, Image, Animated, TouchableWithoutFeedback, ScrollView, Keyboard} from 'react-native';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/Ionicons';
import ActionBar from '../actionbar/ActionBar'; // downloaded from https://github.com/Osedea/react-native-action-bar


class HomeScreen extends Component {
	constructor(props) {
		super(props)
		this.state = {
			products : []
		}
	}
	render() {
		return (
			<View style = {styles.container}>
				<TouchableWithoutFeedback onPress={() => this.collapseMessageBox()}>
					<View style = {{height: SEARCH_BAR_HEIGHT}}>
						{this.state.products.map((product,index)=> 
							<Text> {product} </Text>
						)}
					</View>
				</TouchableWithoutFeedback>
			</View>

		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex:1,
		justifyContent: 'flex-start',
		backgroundColor : 'white'
	},
	containerHorizontal: {
		 flexDirection:'row',
		 height: ACTIVITY_BAR_HEIGHT,
	},

	titleTextLarge: {
		fontSize: 30
	},
	titleTextSmall: {
		fontSize: 25
	},
	dropdown_bar: {
		borderWidth: 0,
		height: ACTIVITY_BAR_HEIGHT,
		justifyContent: 'center',
		backgroundColor: ACTIVITY_BAR_COLOR,
	},
	activity_text: {
		height: ACTIVITY_BAR_HEIGHT,
		fontSize: 25,
		color: 'white',
		textAlign: 'left',
		textAlignVertical: 'center',
		backgroundColor: ACTIVITY_BAR_COLOR,
		justifyContent: 'center'
	},
	dropdown_box: {
		borderColor: 'black',
		borderWidth: 2,
		borderRadius: 0,
		alignSelf: 'flex-end'
	},
	dropdown_row: {
		flex: 1,
		flexDirection: 'row',
		height: 40,
		alignItems: 'center',
	},
	dropdown_row_text: {
		marginHorizontal: 4,
		fontSize: 16,
		color: 'navy',
		textAlignVertical: 'center',
	},
	dropdown_image: {
		width: 30,
		height: 30,
		tintColor: 'white',
		alignSelf: 'flex-end'
	},
	scrollView: {
		backgroundColor: '#6A85B1',
		height: 300,
	},
	text_input: {
			flex: 1,
			fontSize: 20
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

module.exports = FeedScreen
