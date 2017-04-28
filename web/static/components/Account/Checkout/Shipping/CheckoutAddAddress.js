var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../../stores/AppStore.js';
import {Button} from 'react-bootstrap'
import AddressForm from '../../../Misc/Input/AddressForm.js'

var browserHistory = require('react-router').browserHistory;
var Link = require('react-router').Link
const ADDRESS_INDEX = 0
const BILLING_INDEX = 1
const CART_INDEX = 2

const form_inputs = ["address_name", "description", "address_city", "address_state", "address_country",
					"address_line1", "address_line2", "address_zip"]
// requires as props
//	refreshCheckoutInformation

export default class CheckoutAddAddress extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			use_same_for_billing : 0,
			address_name : "",
			description : "",
			address_state: "",
			address_city : "",
			address_country : "US",
			address_line1 : "",
			address_line2 : "",
			address_zip : ""
		}
	}

	// handle the text input changes
	onTextInputChange(field, value){
		var obj = {}
		obj[field] = value
		this.setState(obj)
	}

	onBillingAddressOptionChange(event){
		this.setState({use_same_for_billing : event.target.value})
	}

	refreshCheckoutInformation(){
		var form_data = JSON.stringify({
				"account_id" : AppStore.getCurrentUser().account_id,
				"jwt" : localStorage.jwt
			})
			$.ajax({
				type: "POST",
				url: "/getCheckoutInformation",
				data: form_data,
				success: function(data) {
					if (data.success) {
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

	addAddress(){
		var data = {}
			for (var i = 0; i < form_inputs.length; i++){
				var key = form_inputs[i]
				data[key] = this.state[key]
			}
			data["jwt"] = localStorage.jwt
			data["account_id"] = AppStore.getCurrentUser().account_id
			var form_data = JSON.stringify(data)
			$.ajax({
				type: "POST",
				url: "/addUserAddresses",
				data: form_data,
				success: function(data) {
					if (!data.success) {
						swal("Sorry!", "It seems there was an error with your address! " + data.error 
							+ ". Please try again!", "warning")
					}
					else {
						// AppActions.addCurrentUser(data.user_info)
						swal({
								title: "Thank you!", 
								text : "Your changes have been made",
								type: "success"
							})
						this.props.toggleModal()
						this.props.onAddingNewShippingAddress(this.state.use_same_for_billing)
					}

				}.bind(this),
				error : function(){

				},
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});
	}


	componentWillMount(){
		this.props.refreshCheckoutInformation()
	}

	render() {
		return (
			<div className = "row">
				<div className = "col-sm-10 col-md-10 col-lg-10">
					<AddressForm 
					has_description = {true}
					onTextInputChange = {this.onTextInputChange.bind(this)}/>

					
					<div className= "row">
						<div className = "col-mg-2 col-sm-2 col-lg-2"/>
						<div className="col-md-6">
						    <p> Using a new or existing payment method? </p>
							<div class="radio">
							  <label><input onChange = {this.onBillingAddressOptionChange.bind(this)} value = {0}  selected = "selected" type="radio" name="use_same"/> Yes, I will add a new payment method </label>
							</div>

							<div class="radio">
							  <label><input onChange = {this.onBillingAddressOptionChange.bind(this)} value = {1} type="radio" name="use_same"/> No, I will use an existing payment method </label>
							</div>
						</div>
					</div>

					<hr/>

					<div className = "row">
						<Button onClick = {this.addAddress.bind(this)}>
							Add Address
						</Button>
					</div>
				</div>
			</div>
		)
	}
}

