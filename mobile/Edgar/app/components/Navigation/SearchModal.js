import React from 'react';
import {Component} from 'react'
import {
	View,
	Text,
	Modal,
	StyleSheet,
	TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import {Actions} from 'react-native-router-flux'

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
					animationType="slide"
					transparent={false}
					visible={this.props.visible}
						// onRequestClose={() => {alert("Modal has been closed.")}}
					>
					<View style = {styles.modal_container}>
						<View style=  {title_styles.container}>
							<View style = {[title_styles.search_input_container,
								{flex : 4}]}>
								<Icon style = {title_styles.search_icon} 
								size  = {18}
								name = "search"/>
								<TextInput	
									onSubmitEditing = {this.onSearchSubmit}
									style = {title_styles.search_input_text}
									value = {this.state.search_text}
									onChangeText={this.onTextChange}
									placeholder='Type Here...' />
							</View>
							<View style = {{flex : 1, flexDirection : "row", 
							justifyContent : 'flex-end', alignItems : 'center'}}>
								<Text
								style = {{margin : 6, color : "white"}}
								onPress = {() => this.props.setSearchModal(false)}
								>
									Cancel
								</Text>
							</View>
							</View>
						<View/>
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
		margin : 12,
		flex : 1,
		flexDirection : "row",
		alignItems : "center",
		backgroundColor : '#3e3f42',
		borderRadius : 8,

	},
	search_input_text : {
		color : 'white'
	},
	search_icon : {
		color : 'white',
		padding: 6,
	}

})









