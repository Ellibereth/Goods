var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;
import AppStore from '../../../../stores/AppStore.js';
import AppActions from '../../../../actions/AppActions.js';
import TextInput from '../../../Input/TextInput.js'
import CreditCardInput from '../../../Input/CreditCardInput.js'
import FadingText from '../../../Misc/FadingText'
import AddressForm from '../../../Input/AddressForm.js'
import {AlertMessages} from '../../../Misc/AlertMessages'
const address_inputs = ["address_city", "address_country",
					"address_line1", "address_line2", "address_zip",
					"addresss_name"]

export default class CheckoutAddBilling extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name : "",
			number: "",
			expiry: "",
			cvc : "",
			address_name : "",
			address_city : "",
			address_country : "US",
			address_line1 : "",
			address_line2 : "",
			address_zip : "",
			addresss_state: "",
			use_same_as_shipping : true,
			show_error_text : false, 
			error_text : ""
		}
		this.setErrorMessage = this.setErrorMessage.bind(this)
	}

	setErrorMessage(error_text) {
		this.setState({
			show_error_text : true, 
			error_text : error_text
		})
		setTimeout(function(){
			this.setState({show_error_text :false})
		}.bind(this), 4000)
	}

	// handle the text input changes
	onTextInputChange(field, value){
		var obj = {}
		obj[field] = value
		this.setState(obj)
	}

	useSameAddressChange(){
		this.setState({
			use_same_as_shipping : !this.state.use_same_as_shipping
		})
	}

	onSubmitPress(event){
		event.preventDefault()
		this.addCreditCard.bind(this)()
	}

	addCreditCard(){
		this.props.setLoading(true)
		var data = {}
		if (this.state.use_same_as_shipping){
			if (this.props.selected_address){
				for (var i = 0; i < address_inputs.length; i++){
					var key = address_inputs[i]
					data[key] = this.props.selected_address[key]
				}	
			}
		}	
		else {
			for (var i = 0; i < address_inputs.length; i++){
				var key = address_inputs[i]
				data[key] = this.state[key]
			}	
		}
		
		data['name'] = this.state.name
		data['cvc'] = this.state.cvc
		data['number'] = this.state.number
		data['exp_month'] = this.state['expiry'].split('/')[0]
		data['exp_year'] = this.state['expiry'].split('/')[1]
		data["jwt"] = localStorage.jwt
		var form_data = JSON.stringify(data)
		$.ajax({
			type: "POST",
			url: "/addCreditCard",
			data: form_data,
			success: function(data) {
				this.props.setLoading(false)
				if (!data.success) {
					this.setErrorMessage(data.error.title)
				}
				else {
					this.props.onAddingNewBillingMethod()
					this.props.toggleModal()
				}
				

			}.bind(this),
			error : function(){
				ga('send', 'event', {
						eventCategory: ' server-error',
						eventAction: 'addCreditCard',
						eventLabel: AppStore.getCurrentUser().email
					});
			},
			dataType: "json",
			contentType : "application/json; charset=utf-8"
		});
	}

	render() {
		return (
			<div className = "container-fluid">
				<div className = "col-sm-12 col-md-12 col-lg-12">
					<div className = "row">
						<CreditCardInput onSubmit = {this.onSubmitPress.bind(this)}
						 onTextInputChange = {this.onTextInputChange.bind(this)} />
					</div>
					<div className = "row">
						<div className="checkbox">
						  <label> Use same address from shipping  </label>
						  	<input disabled = {!this.props.selected_address} 
						  		checked = {this.state.use_same_as_shipping && this.props.selected_address}
						  		id = "same_address_checkbox" name = "same_address" 
						  		 onClick = {this.useSameAddressChange.bind(this)} type="checkbox"/>
						  	 
						</div>
						{
							!this.props.selected_address &&
							<small>	
								You must select an address before you can use this option. 
							</small>
						}
					</div>


					{ !this.state.use_same_as_shipping &&
						<div className = "row">
							<AddressForm 
							onSubmit = {this.onSubmitPress.bind(this)}
							has_description = {false}
							onTextInputChange = {this.onTextInputChange.bind(this)}/>
						</div>
					}
					<div className = "top-buffer"/>
					<div className = "top-buffer"/>

					<div className = "row">
							<button className = "btn btn-default "
							onClick = {this.onSubmitPress.bind(this)}>
								Add Billing Method
							</button>
					</div>
					<div className = "small-buffer"/>

					<div className = "row">
						<FadingText height_transition ={true} 
							show = {this.state.show_error_text}>
							<div className = "checkout-error-text">
								{this.state.error_text}
							</div>
						</FadingText>
					</div>
						
				</div>
			</div>
			
		)
	}
}

