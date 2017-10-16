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
import SimplePicker from 'react-native-simple-picker'
import Icon from 'react-native-vector-icons/FontAwesome'
import ModalPicker from '../../Misc/ModalPicker'

import CheckoutTextInput from '../../Misc/CheckoutTextInput'

const img_src = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"
const field_list = ['address_name', 'address_line1', 'address_line2', 'address_city', 'address_zip']
const placeholder_list = ['Name', "Address Line 1", "Address Line 2", "City", "Zip"]
const required_list = [true, true, false, true, true]
const max_length_list = [null, null, null, null, 5]
const states = {
	'AL': 'Alabama',
	'AK': 'Alaska',
	'AS': 'American Samoa',
	'AZ': 'Arizona',
	'AR': 'Arkansas',
	'CA': 'California',
	'CO': 'Colorado',
	'CT': 'Connecticut',
	'DE': 'Delaware',
	'DC': 'District Of Columbia',
	'FM': 'Federated States Of Micronesia',
	'FL': 'Florida',
	'GA': 'Georgia',
	'GU': 'Guam',
	'HI': 'Hawaii',
	'ID': 'Idaho',
	'IL': 'Illinois',
	'IN': 'Indiana',
	'IA': 'Iowa',
	'KS': 'Kansas',
	'KY': 'Kentucky',
	'LA': 'Louisiana',
	'ME': 'Maine',
	'MH': 'Marshall Islands',
	'MD': 'Maryland',
	'MA': 'Massachusetts',
	'MI': 'Michigan',
	'MN': 'Minnesota',
	'MS': 'Mississippi',
	'MO': 'Missouri',
	'MT': 'Montana',
	'NE': 'Nebraska',
	'NV': 'Nevada',
	'NH': 'New Hampshire',
	'NJ': 'New Jersey',
	'NM': 'New Mexico',
	'NY': 'New York',
	'NC': 'North Carolina',
	'ND': 'North Dakota',
	'MP': 'Northern Mariana Islands',
	'OH': 'Ohio',
	'OK': 'Oklahoma',
	'OR': 'Oregon',
	'PW': 'Palau',
	'PA': 'Pennsylvania',
	'PR': 'Puerto Rico',
	'RI': 'Rhode Island',
	'SC': 'South Carolina',
	'SD': 'South Dakota',
	'TN': 'Tennessee',
	'TX': 'Texas',
	'UT': 'Utah',
	'VT': 'Vermont',
	'VI': 'Virgin Islands',
	'VA': 'Virginia',
	'WA': 'Washington',
	'WV': 'West Virginia',
	'WI': 'Wisconsin',
	'WY': 'Wyoming'
  }


export default class ModalAddressForm extends Component {

	constructor(props) {
		super(props)
		this.state = {
			show_state_picker : false,
		}
		this.setStatePicker = this.setStatePicker.bind(this)
	}

	setStatePicker(show_state_picker) {
		this.setState({show_state_picker : show_state_picker})
	}

	componentDidMount(){	
		
	}
	
	render() {
		return (
					<View>
						{this.props.show_header &&
							<View style=  {[styles.title_container, {marginTop : 22}]}>
								<View style = {{flex : 1}}/>
								<View style = {{flex : 4}}>
								<Text style = {styles.title}> 
									Add Shipping Address
								</Text>
								</View>
								<View style = {{flex : 1, flexDirection : "row", 
								justifyContent : 'flex-end', alignItems : 'center'}}>
									<Icon name = {"close"}
									size = {16}
									style = {{padding : 10}}
									onPress = {() => this.props.setModal(false)}
									/>
								</View>
							</View>
						}
							<View > 
								{field_list.map((field, index) =>
									<CheckoutTextInput 
										key = {index}
										field = {field_list[index]}
										value = {this.props.address[field_list[index]]}
										onChangeText = {this.props.onChangeAddress}
										placeholder = {placeholder_list[index]}
										required = {required_list[index]}
										maxLength = {max_length_list[index]}
									/>
								)}

									

								<ModalPicker 
									preview_styles = {preview_styles}
									show_picker = {this.state.show_state_picker}
									setPicker = {this.setStatePicker}
									selected_value = {this.props.address.address_state}
									values = {Object.keys(states)}
									labels = {Object.keys(states).map((key,index) => states[key])}
									onChange = {(value) => this.props.onChangeAddress("address_state", value)}
								/>





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
	},
	text : {
		padding : 8,
		backgroundColor : 'transparent'
	},
	icon_container : {
		flex : 1,
		backgroundColor : '#D5D5D5',
		alignItems : 'center',
		justifyContent : 'center'
	},
	icon : {
		color : 'white',
		fontSize : 20
	},
	text_container : {
		flex: 9,
		paddingLeft: 15,
		paddingRight: 15,
		borderRadius: 5
	},
})

const styles = StyleSheet.create({
	container : {
		flexDirection : 'column',
		justifyContent : 'center',
		alignItems : 'stretch'
	},
	scroll_container : {
		flex: 9,
	},
	checkout_container : {
		padding: 4,
		borderTopWidth: 1,
		borderColor : 'silver',

	},
	finish_button_container : {
		flexDirection : 'row',
	},
	save_button : {
		flex : 1,
		margin : 8,
		borderRadius : 6,
		borderWidth : 1,
		padding: 16,
		backgroundColor : 'red',
		borderColor : 'red'

	},
	save_button_text : {
		textAlign : 'center',
		color : 'white'
	},
	cancel_button : {
		flex : 1,
		margin : 8,
		borderRadius : 6,
		padding : 16,
		borderWidth : 1,
		borderColor : 'silver',
		backgroundColor : '#D5D5D5'
	}, 
	cancel_button_text : {
		textAlign : 'center',
		color : 'grey'
	},
	
	checkout_text : {
		textAlign : "center",
		color : 'white'
	},
	show_modal_button : {
		paddingVertical: 12,
		borderRadius: 4,
		backgroundColor : '#D5D5D5',
		margin : 8,
	},
	show_modal_button_text : {
		color : '#333333',
		textAlign : 'center',
		fontSize : 16,
	},
	title :{
		textAlign : 'center',
		fontSize : 20,

	}, 
	title_container : {
		flexDirection : 'row',
		margin : 6
	}
	
})


