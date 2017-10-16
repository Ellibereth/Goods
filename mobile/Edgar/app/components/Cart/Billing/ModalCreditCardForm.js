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
} from 'react-native';
import {Actions} from 'react-native-router-flux'
import {handleAddBilling} from '../../../api/UserService'
import Icon from 'react-native-vector-icons/FontAwesome'
import CheckoutTextInput from '../../Misc/CheckoutTextInput'
import ModalPicker from '../../Misc/ModalPicker'

const months = ["01","02","03","04","05","06","07","08","09","10","11","12"]
const years = [18,19,20,21,22,23,24,25,26]
const year_labels = [2018,2019,2020,2021,2022,2023,2024,2025,2026]

export default class ModalCreditCardForm extends Component {
	constructor(props) {
		super(props)
		this.state = {
			show_month_picker : false,
			show_year_picker : false,
		}
		this.setMonthPicker = this.setMonthPicker.bind(this)
		this.setYearPicker = this.setYearPicker.bind(this)
	}

	setMonthPicker(show_month_picker){
		this.setState({show_month_picker : show_month_picker})
	}

	setYearPicker(show_year_picker){ 
		this.setState({show_year_picker : show_year_picker})
	}

	render() {
		return (
		
			<View style = {{paddingTop: 10}}>
				<View style = {styles.header_container}>
					<Text style = {styles.header_text}>Payment Method</Text>
				</View>
				<CheckoutTextInput 
					field = {'name'}
					value = {this.state.name}
					onChangeText = {this.props.onChangeCard}
					placeholder = {"Cardholder Name"}
					required = {true}
					maxLength = {40}
				/>

				<CheckoutTextInput 
					field = {'number'}
					value = {this.state.number}
					onChangeText = {this.props.onChangeCard}
					placeholder = {"Number"}
					required = {true}
					maxLength = {16}
					keyboardType = {'number-pad'}
				/>

				<View style = {{flexDirection : 'row'}}>
					<Text style = {{fontWeight : 'bold',fontSize : 16, padding : 8}}>
						Expiration date
					</Text>
				</View>

				<View style = {{flexDirection : 'row'}}>
					<View style = {{flex: 1}}>
							<ModalPicker 
								preview_styles = {preview_styles}
								show_picker = {this.state.show_month_picker}
								setPicker = {this.setMonthPicker}
								selected_value = {this.props.card.exp_month}
								values = {months}
								labels = {months.map((month,index) => month.toString())}
								onChange = {(value) => this.props.onChangeCard("exp_month", value)}
							/>
					</View>
					<View style = {{flex: 1}}>
							<ModalPicker 
								preview_styles = {preview_styles}
								show_picker = {this.state.show_year_picker}
								setPicker = {this.setYearPicker}
								selected_value = {this.props.card.exp_year}
								values = {years}
								labels = {year_labels.map((year,index) => year.toString())}
								onChange = {(value) => this.props.onChangeCard("exp_year", value)}
							/>
					</View>
				</View>
					

				<View style = {{flexDirection : "row"}}>
					
					
					<View style = {{flex : 1}}>
						<CheckoutTextInput 
							field = {'cvc'}
							value = {this.state.cvc}
							onChangeText = {this.onChangeCard}
							placeholder = {"Confirm CVC"}
							required = {true}
							keyboardType = {'number-pad'}
							maxLength = {3}
						/>
					</View>
					<View style = {{flex : 1}}/>
				</View>

			


			</View>
		)
	}
}

const preview_styles = StyleSheet.create({
	container : {
		flexDirection : 'row',
		justifyContent : 'center',
		margin : 8,
		borderColor : 'silver',
		borderWidth : 1,
		borderRadius : 4,
		justifyContent : 'space-between'
	},
	text_container : {
		paddingLeft: 15,
		paddingRight: 15,
		borderRadius: 5
	},
	text : {
		padding : 8,
		backgroundColor : 'transparent'
	},
	icon_container : {
		backgroundColor : '#D5D5D5',
		alignItems : 'center',
		justifyContent : 'center',
		paddingHorizontal : 12
	},
	icon : {
		color : 'white',
		fontSize : 20,
	},
	
})

const styles = StyleSheet.create({
	header_container : {
		paddingVertical : 8,
		marginHorizontal : 12,
		borderBottomWidth : 1,
		borderBottomColor : '#D5D5D5',
	},
	header_text : {
		fontSize : 18,
	},
	
})


