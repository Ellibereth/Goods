var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;
var Link = require('react-router').Link;
import AppStore from '../../../../stores/AppStore.js';
import AppActions from '../../../../actions/AppActions.js';
import TextInput from '../../../Input/TextInput.js'
import CreditCardInput from '../../../Input/CreditCardInput.js'
import AddressForm from '../../../Input/AddressForm.js'


import {Form, Col, FormGroup, Button} from 'react-bootstrap'
const form_inputs = ["address_city", "address_country",
					"address_line1", "address_line2", "address_zip",
					"addresss_name", "name", "number", "cvc"]


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
			disabled: false
		}
	}

	// handle the text input changes
	onTextInputChange(field, value){
		var obj = {}
		obj[field] = value
		this.setState(obj)
	}

	onSubmitPress(){
		swal({
		  title: "Ready?",
		  text: "Is all your information correct?",
		  showCancelButton: true,
		  confirmButtonColor: "#DD6B55",
		  confirmButtonText: "Yes",
		  cancelButtonText: "No!",
		  closeOnConfirm: true,
		  closeOnCancel: true
		},
		function () {
			this.submitData.bind(this)()
		}.bind(this))
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

	submitData(){
		this.setState({disabled : true})
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
			data["account_id"] = AppStore.getCurrentUser().account_id
			var form_data = JSON.stringify(data)
			$.ajax({
				type: "POST",
				url: "/addCreditCard",
				data: form_data,
				success: function(data) {
					if (!data.success) {
						swal("Sorry!", "It seems there was an error with your card! " + data.error 
							+ ". Please try again!", "failure")
					}
					else {
						// AppActions.addCurrentUser(data.user_info)
						swal({
								title: "Thank you!", 
								text : "Your changes have been made",
								type: "success"
							})
						var form_data =  JSON.stringify({
								jwt : localStorage.jwt
							})
							$.ajax({
								type: "POST",
								url: "/getUserInfo",
								data: form_data,
								success: function(data) {
									if (data.success) {
										AppActions.removeCurrentUser()
										AppActions.addCurrentUser(data.user, data.jwt)
									}
									browserHistory.push(`/settings`)
								}.bind(this),
								error : function(){
								},
								dataType: "json",
								contentType : "application/json; charset=utf-8"
							});
						
					}
					this.setState({disabled : false})
				}.bind(this),
				error : function(){
					console.log("error")
				},
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});
		}

	render() {
		return (
			<div className = "col-sm-12 col-md-12 col-lg-12">
			<Form horizontal>
				<CreditCardInput 
				onSubmit = {this.onSubmitPress.bind(this)}
				header = {"Add a payment method"}
				onTextInputChange = {this.onTextInputChange.bind(this)} />
				<div className = "row">
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
					<AddressForm onSubmit = {this.onSubmitPress.bind(this)} header = {false} onTextInputChange  = {this.onTextInputChange.bind(this)} />
				}

				<FormGroup controlId = "submit_button">
					<div className = "col-md-10 col-lg-10">
						<Button className = "pull-right" disabled = {this.state.disabled}
						 onClick = {this.onSubmitPress.bind(this)}>
						Submit
						</Button>
					</div>
				</FormGroup>
			</Form>
			</div>
		)
	}
}

