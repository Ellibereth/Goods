import React from 'react';
import {Component} from 'react'
import {TouchableOpacity,
		StyleSheet,
		View,
		Text,
		ScrollView,
		Modal,
		TouchableHighlight,
		Alert,
		Picker,
		TouchableWithoutFeedback,
} from 'react-native';
import {Actions} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome'


export default class ModalPicker extends Component {
	/* props are
		show_picker : shows picker 
		setPicker : sets picker visibility
		selected_value : value of the picker
		values : all values in picker, should be 
		labels : optional list (must be parallel with values), that has labels different form values
		onChange : call back on value change

		TODO add default styles 
		preview_styles : a dictionary with 
	*/
	constructor(props) {
		super(props)
		this.state = {
		}
	}

	

	componentDidMount(){	
		
	}
	
	render() {
		var labels = this.props.labels ? this.props.labels : this.props.values

		var index_of = this.props.values.indexOf(this.props.selected_value)
		if (index_of == -1) {
			var display_value = labels[0]
		}
		else {
			var display_value = this.props.labels[index_of]
		}

		var preview_styles = this.props.preview_styles || {}
		var preview_container_style = preview_styles.container || styles.preview_container
		var preview_text_container_style = preview_styles.text_container || styles.preview_text_container
		var preview_text_style = preview_styles.text || styles.preview_text
		var preview_icon_container_style = preview_styles.icon_container || styles.preview_icon_container
		var preview_icon_style = preview_styles.icon || styles.preview_icon	
		

		return (
			<View>
				<TouchableHighlight onPress = {() => this.props.setPicker(true)}>
					<View style = {preview_container_style}>
						<View style={preview_text_container_style}>
							<Text 
								style = {preview_text_style}
							>
								{display_value}
							</Text>
						</View>
						<View style = {preview_icon_container_style}>
							<Icon
							style = {styles.preview_icon_style}
							name = "caret-down"/>
						</View>
					</View>
				</TouchableHighlight>

				<Modal
				animationType="fade"
				transparent={true}
				visible={this.props.show_picker}>
					<TouchableWithoutFeedback
					  onPress={() => this.props.setPicker(false)}>
						<View style = {{flex : 1, flexDirection :  "column", justifyContent : "flex-end"}}>
							<View style = {{flex : 1, 
								backgroundColor : 'black', opacity : 0.7
							}}/>
							<View style = {[{flex : 1, flexDirection : 'column'}, styles.picker_container]}>
								<View style = {{backgroundColor : "white"}}>
									<Text style = {{
										fontSize : 22 ,
										color  : "darkblue",
										paddingHorizontal : 6,
										paddingVertical : 6,
									}}>{this.props.prompt ? this.props.prompt : "Select"} </Text>
								</View>
								<Picker style = {{flex : 1}}
									selectedValue={this.props.selected_value}
									onValueChange={
										(itemValue, itemIndex) => this.props.onChange(itemValue)
									}
								>
									{this.props.values.map((value,index) => <Picker.Item key = {index} label= {labels[index]} value= {this.props.values[index]} />)}
								</Picker>
							</View>
						</View>
					</TouchableWithoutFeedback>
				</Modal>
			</View>

								

					
			

		)
	}
}

const styles = StyleSheet.create({
	picker_container : {
		backgroundColor : "#E1E1E1"
	},

	// these are default styles unless overridden by props
	preview_container : {
		flexDirection : 'row',
		justifyContent : 'center',
		margin : 8,
		borderColor : 'silver',
		borderWidth : 1,
		borderRadius : 4,
	},
	preview_text : {
		padding : 8,
		backgroundColor : 'transparent'
	},
	preview_icon_container : {
		flex : 1,
		backgroundColor : '#D5D5D5',
		alignItems : 'center',
		justifyContent : 'center'
	},
	preview_icon : {
		color : 'white',
		fontSize : 20
	},
	preview_text_container : {
		flex: 9,
		paddingLeft: 15,
		paddingRight: 15,
		borderRadius: 5
	},
})


