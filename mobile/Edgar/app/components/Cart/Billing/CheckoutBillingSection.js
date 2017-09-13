
import React from 'react';
import {Component} from 'react'
import {ScrollView,StyleSheet, TouchableHighlight, Text, View} from 'react-native';
import {Actions} from 'react-native-router-flux';
import AddBillingModal from './AddBillingModal'
import Icon from 'react-native-vector-icons/FontAwesome'
import CheckoutBillingDisplay from './CheckoutBillingDisplay'

export default class CheckoutBillingSection extends Component {
	constructor(props) {
		super(props)
		this.state = {
			can_edit_billing : false,
		}
	}

	toggleEditBilling(){
		this.setState({can_edit_billing : !this.state.can_edit_billing})
	}

	componentDidMount(){
		if (this.props.user.cards.length == 0){
			this.props.setModal(true)
		}
	}

	render() {
		return (
				<View style = {styles.billing_container}>
					<View style = {styles.title_container}>
					 	<Text style=  {styles.title_text}>
					 		Billing Information
					 	</Text>
					</View>
					{
						this.state.can_edit_billing ? 
						<View style = {styles.collapsible_container}>
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
							<AddBillingModal 
							selectCard = {this.props.selectCard}
							setUserInfo = {this.props.setUserInfo}
							modal_visible = {this.props.modal_visible}
							setModal = {this.props.setModal}
							jwt = {this.props.jwt} 
							toggleEditBilling = {this.toggleEditBilling.bind(this)}
							loadUserCheckout = {this.props.loadUserCheckout}/>

						</View>
						:
						<View style = {styles.collapsible_container}>
							<Text> Selected Billing Display - No Editing</Text>
							{this.props.selected_card 
								?
									<View>
										<Text> {this.props.selected_card.brand} ending in {this.props.selected_card.last4} </Text>
										<Text> {this.props.selected_card.name} </Text>
										<Text> Exp: {this.props.selected_card.exp_month} / {this.props.selected_card.exp_year} </Text>
									</View>
								:
									<Text> No Billing Method Selected Yet </Text>
							}
						</View>
					}
					
					<View style = {styles.toggle_container}>
						<TouchableHighlight 
							style = {styles.toggle_button}
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
		height : 300,
		borderColor : "silver",
		borderWidth : 1,
		margin : 8,
		marginBottom : 0,
		paddingBottom : 0,
		
	},
	collapsible_container : {
		flex : 4,
	},
	
	toggle_container : {
		flex : 1,
		flexDirection : 'column'
	},
	toggle_button : {
		backgroundColor : 'silver',
		flex : 1,
		flexDirection : 'column',
		justifyContent : 'center'
	},
	toggle_text : {
		textAlign : "center",
		color : 'grey'
	},
	title_text : {
		fontSize : 20,
		fontWeight : 'bold',
	},
	title_container : {
		flex : 0.5,
		borderBottomWidth : 1,
		borderBottomColor : 'silver',
		marginLeft: 6,
		paddingLeft: 0,
		padding : 6,
		marginRight: 0,
	}
})
