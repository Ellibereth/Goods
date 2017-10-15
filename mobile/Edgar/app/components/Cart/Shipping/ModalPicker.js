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
		return (

				<Modal
				animationType="fade"
				transparent={true}
				visible={this.props.show_picker}>
					<TouchableWithoutFeedback
					  onPress={() => this.props.setPicker(false)}>
					  	<View style = {{flex : 1, flexDirection :  "column", justifyContent : "flex-end"}}>
					  		<View style = {{flex : 3, 
					  			backgroundColor : 'black', opacity : 0.7
					  		}}/>
					  		<View style = {[{flex : 2, flexDirection : 'column'}, styles.picker_container]}>
					  			<View style = {{backgroundColor : "white"}}>
					  				<Text style = {{
					  					fontSize : 22 ,
					  					color  : "darkblue",
					  					paddingHorizontal : 6,
					  					paddingVertical : 6,
					  				}}> Select a state </Text>
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

								

					
			

		)
	}
}

const styles = StyleSheet.create({
	picker_container : {
		backgroundColor : "#E1E1E1"
	}
})


