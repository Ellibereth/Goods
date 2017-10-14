import React from 'react';
import {Component} from 'react'
import {
	View,
	Text,
	Modal,
	StyleSheet,
	TextInput,
	ScrollView,
	TouchableHighlight,
	TouchableOpacity,
	Alert,
	Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import {Actions} from 'react-native-router-flux'

const CATEGORIES = ["Fashion", "Fun", "Furniture", "Gifts"]

export default class SearchModal extends Component {

	constructor(props) {
		super(props)
		this.state = {
			search_text : ""
		}
		this.onTextChange = this.onTextChange.bind(this)
		this.onSearchSubmit = this.onSearchSubmit.bind(this)
	}



	onTextChange(search_text) {
		this.setState({search_text : search_text})
	}

	onSearchSubmit() {
		this.props.setSearchModal(false)
		Actions.search({search_text : this.state.search_text})
	}

	render() {
		
		return (
				<Modal
					presentationStyle = "pageSheet"
					animationType="fade"
					transparent={false}
					visible={this.props.visible}
						// onRequestClose={() => {alert("Modal has been closed.")}}
					>
					<View style = {styles.modal_container}>
						<View style=  {title_styles.container}>
							<View style = {[title_styles.search_input_container,
								{flex : 3}]}>
								<Icon style = {title_styles.search_icon} 
								size  = {16}
								name = "search"/>
								<TextInput	
									onSubmitEditing = {this.onSearchSubmit}
									style = {title_styles.search_input_text}
									value = {this.state.search_text}
									onChangeText={this.onTextChange}
									placeholderTextColor = "grey"
									placeholder='Type Here...' />
							</View>
							<View style = {{flex : 1, flexDirection : "row", 
							justifyContent : 'center', alignItems : 'center'}}>
								<TouchableOpacity 
								style = {{
								paddingHorizontal : 6, paddingVertical : 8}}
								onPress = {() => this.props.setSearchModal(false)}>
									<Text
									style = {{color : "white"}}
									>
										Cancel
									</Text>
								</TouchableOpacity>
							</View>
						</View>
						<ScrollView>
							<View style = {recommended_styles.container}>
								<View style = {recommended_styles.title}>
									<Text style = {recommended_styles.title_text}>RECOMMENDED</Text>
								</View>
								{CATEGORIES.map((category, index) =>
									<TouchableHighlight 
									onPress = {() => Alert.alert(
										'Congrats!',
									 	 'Clicking this will take you to the ' + category + ' listing page' ,
									  [
									    {text: 'OK', onPress: () => console.log('OK Pressed')},
									  ])}
									key = {index} style = {recommended_styles.category}>
										<Text style = {recommended_styles.category_text}>
											{category}
										</Text>
									</TouchableHighlight>
								)}
								
							</View>
						</ScrollView>
					</View>
				</Modal>
		)
				
	}
}


const styles = StyleSheet.create({
	modal_container : {
		flexDirection : "column",
	},

})

const recommended_styles = StyleSheet.create({
	container: {

	},
	title : {
		backgroundColor : 'black',
		padding: 12,
	},
	title_text : {
		color : "white"
	},
	category : {
		backgroundColor : '#3e3f42',
		padding: 12,
		borderTopColor : 'silver',
		borderTopWidth : 1,
	},
	category_text: {
		color : 'white'
	}	
})

const title_styles = StyleSheet.create({
	title :{
		textAlign : 'center',
		fontSize : 16,
	}, 
	container : {
		flexDirection : 'row',
		margin : 0,
		paddingTop: 22,
		backgroundColor : "#505155",
		paddingBottom : 12,
	},
	search_input_container :{
		marginLeft : 6,
		marginVertical : 6,
		marginRight : 0,
		flex : 1,
		flexDirection : "row",
		alignItems : "center",
		backgroundColor : '#3e3f42',
		borderRadius : 8,

	},
	search_input_text : {
		color : 'white',
		flex : 9,
		fontSize : 14,
		paddingVertical : 10
	},
	search_icon : {
		color : 'white',
		padding: 6,
		flex : 1,
	}

})









