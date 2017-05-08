var React = require('react');
var ReactDOM = require('react-dom');
var Link = require('react-router').Link;
var browserHistory = require('react-router').browserHistory;
import AppStore from '../../../../stores/AppStore.js';
import AppActions from '../../../../actions/AppActions.js';
import TextInput from '../../../Input/TextInput.js'
import AddressForm from '../../../Input/AddressForm.js'
import {Form, Col, FormGroup, Button} from 'react-bootstrap'
const form_labels = ["Name", "Description", "City","State", "Country", "Address Line 1", 
						"Address Line 2", "Zip Code"]
const form_inputs = ["address_name", "description", "address_city", "address_state", "address_country",
					"address_line1", "address_line2", "address_zip"]

const input_types = ["text", "text", "text", "text", "text", "text", "text", "text"]

export default class UpdateShippingForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
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

	onSubmitPress(){
		swal({
		  title: "Ready?",
		  text: "Is all your information correct?",
		  showCancelButton: true,
		  confirmButtonColor: "#DD6B55",
		  confirmButtonText: "Yes",
		  cancelButtonText: "No!",
		  closeOnConfirm: false,
		  closeOnCancel: true
		},
		function () {
			this.submitData.bind(this)()
		}.bind(this))
	}

	submitData(){
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
						browserHistory.push(`/settings`)
					}

				}.bind(this),
				error : function(){

				},
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});
		}

	render() {

	

		return (
				<div>
					<h3> Add an Address </h3>
					<span> Click <Link to = "/settings"> here </Link> to return  </span>
					<Form horizontal>
						<AddressForm 
						has_description = {true}
						onTextInputChange = {this.onTextInputChange.bind(this)}/>
						<div className = "form-group" id = "submit_button">
							<Col lgOffset = {2} mdOffset={2} md={6} lg = {6}>
								<Button onClick = {this.onSubmitPress.bind(this)}>
								Submit
								</Button>
							</Col>
						</div>
					</Form>
				</div>
		)
	}
}

