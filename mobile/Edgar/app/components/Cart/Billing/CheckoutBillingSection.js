
import React from 'react';
import {Component} from 'react'
import {
	ScrollView,
	StyleSheet,
	TouchableHighlight, 
	Text, 
	View,
	Alert
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import AddBillingModal from './AddBillingModal'
import Icon from 'react-native-vector-icons/FontAwesome'
import CheckoutBillingDisplay from './CheckoutBillingDisplay'
import * as Animatable from 'react-native-animatable'
import {toTitleCase} from '../../../util/Format'

export default class CheckoutBillingSection extends Component {
	constructor(props) {
		super(props)
		this.state = {
			can_edit_billing : false,
		}
	}

	toggleEditBilling(){
		var can_edit_billing = this.state.can_edit_billing
		if (can_edit_billing) {
			if (this.props.selected_card_index == null) {
				Alert.alert(
					'Warning',
					'You must select or add a payment method first',
					[
						{text: 'OK', onPress: () => console.log('OK Pressed')},
				  	],
				  { cancelable: false }
				)
			}	
			else {
				this.setState({can_edit_billing : !can_edit_billing})	
			}
		}
		else {
			this.setState({can_edit_billing : !can_edit_billing})
		}
		
	}

	componentDidMount(){
		if (this.props.selected_card_index == null){
			this.setState({can_edit_billing : true})
		}
	}

	render() {
		return (
				<View style = {styles.billing_container}>
					<View style = {[{flex : 1},styles.title_container]}>
						<Text style=  {styles.title_text}>
							Billing Information
						</Text>
					</View>


					<Animatable.View 
					style = {{flex : 4}}>
					{
						this.state.can_edit_billing ? 
						<View style = {[{flex : 1} ,styles.collapsible_container]}>
							{this.props.user.cards.length > 0 &&
								<ScrollView>
									{this.props.user.cards.map((card, index) =>
										<CheckoutBillingDisplay 
										index = {index}
										key = {index}
										selectCard = {this.props.selectCard}
										card = {card}
										selected = {this.props.selected_card_index == index}
										/>
										)
									}
								</ScrollView>
							}
							{ this.state.can_edit_billing &&

							<AddBillingModal 
							user = {this.props.user}
							selectCard = {this.props.selectCard}
							setUserInfo = {this.props.setUserInfo}
							modal_visible = {this.props.modal_visible}
							setModal = {this.props.setModal}
							jwt = {this.props.jwt} 
							toggleEditBilling = {this.toggleEditBilling.bind(this)}
							loadUser = {this.props.loadUser}/>
							}

						</View>
						:
						<View 
						style = {[{flex : 1}, styles.collapsible_container]}>
							{this.props.selected_card 
								&&
									<View style = {{flexDirection : 'row'}}>
										<View style = {{flex : 4}}>
											<Text> {this.props.selected_card.brand} ending in {this.props.selected_card.last4} </Text>
											<Text> {this.props.selected_card.name} </Text>
											<Text> Exp: {this.props.selected_card.exp_month} / {this.props.selected_card.exp_year} </Text>
										</View>
										<View style = {{flex: 1,  alignItems : "center", justifyContent : "center"}}>
											<Icon name = "circle"/>
										</View>	
									</View>
							}
						</View>
					}
					</Animatable.View>
					
					<View style = {[{flex : 1},styles.toggle_container]}>
						<TouchableHighlight 
							style = {[{flex : 1},styles.toggle_button]}
							onPress ={this.toggleEditBilling.bind(this)}>
							<Text style = {styles.toggle_text}>
								{this.state.can_edit_billing ? "Save " : "Edit Billing "}
								{this.state.can_edit_billing ? 
									<Icon name = 'caret-up'/> :
									<Icon name = 'caret-down'/>
								}
							</Text>
						</TouchableHighlight>
					</View>
					
				</View>
		)
	}
}

// height will change later to variable with animated toggling
// for now fixed to get framework
const styles = StyleSheet.create({
	billing_container : {
		flexDirection : 'column',
		minHeight : 120,
		borderColor : "silver",
		borderWidth : 1,
		margin : 8,
		marginBottom : 0,
		paddingBottom : 0,
		
	},
	collapsible_container : {
		
	},
	
	toggle_container : {
		flexDirection : 'column',
		height : 40,
	},
	toggle_button : {
		backgroundColor : '#D5D5D5',
		flexDirection : 'column',
		justifyContent : 'center'
	},
	toggle_text : {
		textAlign : "center",
		color : 'grey',
	},
	title_text : {
		fontSize : 20,
		fontWeight : 'bold',
	},
	title_container : {
		borderBottomWidth : 1,
		borderBottomColor : 'silver',
		marginLeft: 6,
		paddingLeft: 0,
		padding : 6,
		marginRight: 0,
	}

})

