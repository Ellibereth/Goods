var React = require('react');
var ReactDOM = require('react-dom');
var Config = require('Config')
var url = Config.serverUrl
import AppStore from '../../../stores/AppStore.js';
import TopNavBar from '../../Misc/TopNavBar'
import CartDisplay from './CartDisplay'
import CheckoutCardSelect from './CheckoutCardSelect.js'
import CheckoutAddressSelect from './CheckoutAddressSelect.js'
import CheckoutConfirm from './CheckoutConfirm.js'
import {Button} from 'react-bootstrap'


var browserHistory = require('react-router').browserHistory;
var Link = require('react-router').Link

export default class ViewCartPage extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			items : [],
			price : null,
			cards : [],
			addresses : [],
			selected_card : null,
			selected_address : null,
			step : 1,
			num_steps : 4
		}
	}


	refreshProductInfo(){
		var form_data = JSON.stringify({
				"account_id" : AppStore.getCurrentUser().account_id,
				"jwt" : localStorage.jwt
			})
			$.ajax({
				type: "POST",
				url: url  + "/getCheckoutInformation",
				data: form_data,
				success: function(data) {
					console.log(data)
					if (data.success) {
						console.log(data)
						this.setState({
							items: data.cart.items, 
							price : data.cart.price,
							cards : data.cards,
							addresses : data.addresses, 
						})
					}
					else {
						console.log("an error")
					}
				}.bind(this),
				error : function(){
					console.log("an internal server error")
				},
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});
	}

	componentWillMount(){
		this.refreshProductInfo.bind(this)()
	}

	setCard(card){
		this.setState({selected_card : card})
	}

	setAddress(address){
		this.setState({selected_address : address})
	}

	hasCheckoutError(){
		return (this.state.selected_address == null || this.state.selected_card == null)
	}

	onCheckoutClick(){
		var text = "Are you ready to checkout with card ending in " + this.state.selected_card.last4  + 
				"\n to address " + this.state.selected_address.address_line1 + "?"
		swal({
		  title: "Confirm",
		  text: text,
		  showCancelButton: true,
		  confirmButtonColor: "#DD6B55",
		  confirmButtonText: "Yes",
		  cancelButtonText: "No",
		  closeOnConfirm: true,
		  closeOnCancel: true
		},
		function () {
			this.checkout.bind(this)()
		}.bind(this))
	}

	checkout(){
			var form_data = JSON.stringify({
					account_id : AppStore.getCurrentUser().account_id,
					jwt : localStorage.jwt,
					card_id : this.state.selected_card.id,
					address_id : this.state.selected_address.id 
				})
			$.ajax({
				type: "POST",
				url: url  + "/checkoutCart",
				data: form_data,
				success: function(data) {
					if (!data.success) {
						swal("Sorry!", "Something went wrong + " + data.error, "warning")
					}
					else {
						swal("Thank you!", "You will receive a confirmation email for this purchase"
							, "success")
					}
				}.bind(this),
				error : function(){
					console.log("error")
				},
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});
	}	

	navigateToNextStep(){
		if (this.state.step + 1 < 5){
			this.setState({step : this.state.step + 1})
		}
	}	

	navigateToLastStep(){
		if (this.state.step - 1 > 0){
			this.setState({step : this.state.step - 1})
		}
	}

	getThisStep(step){
		switch (step) {
			case 1:
				return <CartDisplay 
					refreshProductInfo = {this.refreshProductInfo.bind(this)}
					price = {this.state.price}
					 items = {this.state.items}/>
			case 2:
				return <CheckoutAddressSelect setAddress = {this.setAddress.bind(this)}
						addresses = {this.state.addresses}
						addressToString = {this.addressToString} />
			case 3:
				return <CheckoutCardSelect setCard = {this.setCard.bind(this)} cards = {this.state.cards} />
			case 4:
				return <CheckoutConfirm selected_address = {this.state.selected_address}
						 selected_card = {this.state.selected_card}
						 items = {this.state.items}
						 price = {this.state.price}
						 addressToString = {this.addressToString}
						 />
		}
	}

	addressToString(address){
		// Darek Johnson 3900 City Avenue, M619, Philadelphia, PA, 19131 United States
		return ( 
			<span>
				<b> {address.name} </b> {address.address_line1}, {address.address_line2}, {address.address_city}, {address.address_state}, {address.address_zip} {address.address_country}
			</span>
		)
	}

	getChangeStepButtons(step){
		var has_error = this.hasCheckoutError.bind(this)()
		if (step == 1) {
			return (
				<div>
					<Button onClick = {this.navigateToNextStep.bind(this)}> Proceed to Checkout </Button>
				</div>
			)	
		}
		else if (step == 4){
			return (
				<div>
					<Button onClick = {this.navigateToLastStep.bind(this)}> Back </Button>
					<Button disabled = {has_error} onClick = {this.onCheckoutClick.bind(this)}> Checkout! </Button>
				</div>
			)	
		}
		else {
			return (
				<div>
					<Button onClick = {this.navigateToLastStep.bind(this)}> Back </Button>
					<Button onClick = {this.navigateToNextStep.bind(this)}> Next </Button>
				</div>
			)
		}
		
	}	

	render() {
		var this_step = this.getThisStep.bind(this)(this.state.step)
		var change_step_buttons = this.getChangeStepButtons.bind(this)(this.state.step)
		return (
			<div>
				<TopNavBar />
				<div className = "container">
					{this_step}
					{change_step_buttons}
				</div>
			</div>	
		)
	}
}

