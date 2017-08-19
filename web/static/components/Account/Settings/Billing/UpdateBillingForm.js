var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;
var Link = require('react-router').Link;
import AppStore from '../../../../stores/AppStore.js';
import AppActions from '../../../../actions/AppActions.js';
import TextInput from '../../../Input/TextInput.js'
import CreditCardInput from '../../../Input/CreditCardInput.js'
import AddressForm from '../../../Input/AddressForm.js'
import {AlertMessages} from '../../../Misc/AlertMessages'
import FadingText from '../../../Misc/FadingText'

const form_inputs = ["address_city", "address_country",
					"address_line1", "address_line2", "address_zip",
					"address_name", "name", "number", "cvc"]


export default class UpdateBillingForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
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
			skip_shipping: true,
			disabled: false,
			error_text : "",
			show_error_text : false,
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

	skipBillingAddress(){
		if (!this.state.skip_shipping){
			this.setState({
				address_name : "",
				address_city : "",
				address_country : "US",
				address_line1 : "",
				address_line2 : "",
				address_zip : "",
				addresss_state: "",
				skip_shipping: true,
			})
		}
		else {
			this.setState({
				skip_shipping : false
			})
		}
		
	}

	submitData(event){
		this.setState({disabled : true})
		this.props.setLoading(true)
			var data = {}
			for (var i = 0; i < form_inputs.length; i++){
				var key = form_inputs[i]
				data[key] = this.state[key]
			}
			data['name'] = this.state.name
			data['number'] = document.getElementById("card_input").value.toString().substring(0, 19)
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
					if (data.success) {
						AppActions.updateCurrentUser(data.user)
						window.location = "/settings"
					}
					else {
						this.setErrorMessage(data.error.title)
					}
					this.setState({disabled : false})
				}.bind(this),
				error : function(){
					ga('send', 'event', {
						eventCategory: ' server-error',
						eventAction: 'addCreditCard',
						eventLabel: AppStore.getCurrentUser().email
					});
					this.props.setLoading(false)
					this.setState({disabled : false})
				}.bind(this),
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});
		}

	render() {
		return (
			<form className = "form-horizontal">
				<CreditCardInput 
				onSubmit = {this.submitData.bind(this)}
				header = {"Add a payment method"}
				onTextInputChange = {this.onTextInputChange.bind(this)} />
				<div className = "col-md-12 col-lg-12">
					<div className="checkbox">
						<label>
							<input checked={this.state.skip_shipping} id = "skip_address_checkbox" 
							name = "same_address" onClick = {this.skipBillingAddress.bind(this)} 
							type="checkbox"/> 
								Use default shipping address
						</label>
					</div>
				</div>
				<div className = "small-buffer"/>
				{ !this.state.skip_shipping && 
					<AddressForm onSubmit = {this.submitData.bind(this)} header = {false} onTextInputChange  = {this.onTextInputChange.bind(this)} />
				}
				<div style = {{"marginTop" : "40px"}} className = "form-group">
					<div className = "row">
						<div className = "col-md-10 col-lg-10">
							<button className = "btn btn-default " disabled = {this.state.disabled}
							 onClick = {this.submitData.bind(this)}>
								Submit
							</button>
						</div>
					</div>
					<div className = "small-buffer"/>
					<FadingText height_transition ={true} 
						show = {this.state.show_error_text}>
							<div className = "checkout-error-text">
								{this.state.error_text}
							</div>
					</FadingText>
				</div>
			</form>
		)
	}
}

