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
import SimplePicker from 'react-native-simple-picker'
import Icon from 'react-native-vector-icons/FontAwesome'
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

export default class AddBillingModal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			// hard coded for easier testing
			// change to all "" except country when done
			address_name : "",
			description : "",
			address_state: "",
			address_city : "",
			address_country : "US",
			address_line1 : "",
			address_line2 : "",
			address_zip : "",
			number : "",
			cvc : "",
			exp_month : "",
			exp_year : "",
			name: ""
		}
		this.onChangeText = this.onChangeText.bind(this);
	}

	onChangeText(field, value){
		var obj = this.state
		obj[field] = value
		this.setState(obj)
	}

	async addBilling() {
		var new_index = (this.props.user.cards.length || 0)
		var form_data = {
				jwt : this.props.jwt,
				address_name : this.state.address_name,
				description : this.state.description,
				address_state: this.state.address_state,
				address_city : this.state.address_city,
				address_country : this.state.address_country,
				address_line1 : this.state.address_line1,
				address_line2 : this.state.address_line2,
				address_zip : this.state.address_zip,
				number : this.state.number,
				cvc : this.state.cvc,
				exp_month : this.state.exp_month,
				exp_year : this.state.exp_year,
				name: this.state.name
			}
		this.props.setLoading(true)
		this.props.setModal(false)
		let data = await handleAddBilling(form_data)
		console.log(data)
		if (data.success) {
			await this.props.loadUser(this.props.jwt)
			this.props.selectCard(new_index);
			this.props.toggleEditBilling()
			this.props.setLoading(false)
			// add alert 
		} 

		else {
			this.props.setLoading(false)
			// need an alert on error
			Alert.alert(
				'Error',
				data.error.title,
				[	
					{text : 'Try Again', onPress: () => this.props.setModal(true)},
					{text : 'Never Mind'}
				]
			)
		}
	}

	onCreditCardChange(data){
		var values = data.values
		this.setState({
			number : values.number,
			expiry: values.expiry,
			cvc : values.cvc
		})
	}

	render() {
		return (
			
				<View style = {styles.container}>
						<Modal 
						  animationType="slide"
						  transparent={false}
						  visible={this.props.modal_visible}
						  // onRequestClose={() => {alert("Modal has been closed.")}}
						  >
							<View style={{marginTop: 22}}>
								<View style=  {styles.title_container}>
									<View style = {{flex : 1}}/>
									<View style = {{flex : 4}}>
										<Text style = {styles.title}> 
											Add Payment Method
										</Text>
									</View>
									<View style = {{flex : 1, flexDirection : "row", 
										justifyContent : 'flex-end', alignItems : 'center'}}>
										<Icon name = {"close"}
										style = {{padding : 6}}
										size = {16}
										onPress = {() => this.props.setModal(false)}
										/>
									</View>
								</View>
								<ScrollView>
									<View style = {{paddingBottom : 10, paddingTop: 10}}>
										<View style = {styles.heading_container}>
											<Text style = {styles.heading_text}>Payment Method</Text>
										</View>
										<CheckoutTextInput 
											field = {'name'}
											value = {this.state.name}
											onChangeText = {this.onChangeText}
											placeholder = {"Cardholder Name"}
											required = {true}
											maxLength = {40}
										/>

										<CheckoutTextInput 
											field = {'number'}
											value = {this.state.number}
											onChangeText = {this.onChangeText}
											placeholder = {"Number"}
											required = {true}
											maxLength = {16}
											keyboardType = {'number-pad'}
										/>

										<View style = {{flexDirection : 'row', justifyContent : 'space-between'}}>
											<View style = {{flex : 1}}>
											<CheckoutTextInput 
												field = {'exp_month'}
												value = {this.state.exp_month}
												onChangeText = {this.onChangeText}
												placeholder = {"Exp Month"}
												required = {true}
												maxLength = {2}
												keyboardType = {'number-pad'}
											/>
											</View>
											<View style = {{flex : 1}}>
											<CheckoutTextInput 
												field = {'exp_year'}
												value = {this.state.exp_year}
												onChangeText = {this.onChangeText}
												placeholder = {"Exp Year"}
												required = {true}
												keyboardType = {'number-pad'}
												maxLength = {2}
											/>
											</View>
										</View>

										<View style = {{flexDirection : "row"}}>
											<View style = {{flex : 1}}>
												<CheckoutTextInput 
													field = {'cvc'}
													value = {this.state.cvc}
													onChangeText = {this.onChangeText}
													placeholder = {"CVC"}
													required = {true}
													keyboardType = {'number-pad'}
													maxLength = {3}
												/>
											</View>
											<View style = {{flex : 1}}/>
										</View>



										<View style= {styles.heading_container}>
											<Text style = {styles.heading_text}>
												Billing Address
											</Text>
										</View>

										{field_list.map((field, index) =>
											<CheckoutTextInput 
												key = {index}
												field = {field_list[index]}
												value = {this.state[field_list[index]]}
												onChangeText = {this.onChangeText}
												placeholder = {placeholder_list[index]}
												required = {required_list[index]}
												maxLength = {max_length_list[index]}
											/>
										)}

											<View style = {styles.state_display}>
												<View style={styles.state_text_container}>
													<Text 
														style = {styles.state_display_text}
														onPress={() => {
															this.refs.state_picker.show()}}>
														{this.state.address_state ? states[this.state.address_state] : "Select State"}
													</Text>
												</View>
												<View style = {styles.picker_icon_container}>
													<Icon onPress={() => {
															this.refs.state_picker.show()}}
													style = {styles.picker_icon}
													size = {16}
													name = "caret-down"/>
												</View>
											</View>

										<SimplePicker
										  ref = {'state_picker'}
										  options={Object.keys(states)}
										  labels = {Object.values(states)}
										  onSubmit={(option) => {
											this.setState({
												address_state : option,
											});
										  }}
										/>
									</View>
									<View style = {styles.finish_button_container}>
										<TouchableOpacity style = {styles.cancel_button} 
											onPress = {() => this.props.setModal(false)}>
											<Text style = {styles.cancel_button_text}>Cancel</Text>
										</TouchableOpacity>
										<TouchableOpacity style = {styles.save_button} onPress = {this.addBilling.bind(this)}>
											<Text style = {styles.save_button_text}>Save</Text>
										</TouchableOpacity>
									</View>
									<View style= {{paddingBottom : 50}}/>
								</ScrollView>
							</View>
						</Modal>
						<TouchableHighlight 
							style = {styles.show_modal_button}
							onPress={() => {
						  this.props.setModal(true)
						}}>
							<Text style=  {styles.show_modal_button_text}>Add New Payment Method</Text>
						</TouchableHighlight>
				</View>
		)
	}
}

const styles = StyleSheet.create({
	container : {
		flexDirection : 'column',
		justifyContent : 'center',
		alignItems : 'stretch'
	},
	scroll_container : {
		flex: 9,
	},
	heading_container : {
		paddingVertical : 8,
		marginHorizontal : 12,
		borderBottomWidth : 1,
		borderBottomColor : '#D5D5D5',
	},
	heading_text : {
		fontSize : 18,
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
	state_display : {
		flexDirection : 'row',
		justifyContent : 'center',
		margin : 8,
		borderColor : '#D5D5D5',
		borderWidth : 1,
		borderRadius : 4,
	},
	state_display_text : {
		padding : 8,
		backgroundColor : 'transparent'
	},
	picker_icon_container : {
		flex : 1,
		backgroundColor : '#D5D5D5',
		alignItems : 'center',
		justifyContent : 'center'
	},
	picker_icon : {
		color : 'white'
	},
	state_text_container : {
		flex: 9,
		paddingLeft: 15,
		paddingRight: 15,
		borderRadius: 5
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
  		margin : 6,
  		marginBottom : 0,
  		paddingBottom : 10,
  		borderBottomWidth : 1,
  		borderBottomColor : "#D5D5D5"
  	}
	
})


