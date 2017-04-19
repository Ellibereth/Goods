var React = require('react');
var ReactDOM = require('react-dom');
var Config = require('Config')
var url = Config.serverUrl

var browserHistory = require('react-router').browserHistory;
import AppStore from '../../../stores/AppStore.js';
import AppActions from '../../../actions/AppActions.js';
import TextInput from '../../Misc/Input/TextInput.js'
import {Form, Col, FormGroup, Button} from 'react-bootstrap'
const form_labels = ["Full Name on Card", "Card Number", "Expiration Month", "Expiration Year", "CVC", "City", 
					"Country", "Address Line 1", "Address Line 2", "Zip Code"]
const form_inputs = ["name", "number", "exp_month", "exp_year", "cvc", "address_city", "address_country",
					"address_line1", "address_line2", "address_zip"]

const input_types = ["text", "text", "text", "text", "text", "text", "text", "text", "text", "text"]

export default class UpdateBillingForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name : "",
			number: "",
			exp_year : "",
			exp_month :"",
			cvc : "",
			address_city : "",
			address_country : "",
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
				url: url  + "/addCreditCard",
				data: form_data,
				success: function(data) {
					if (!data.success) {
						swal("Sorry!", "It seems there was an error with your card! " + data.error 
							+ ". Please try again!", "warning")
					}
					else {
						// AppActions.addCurrentUser(data.user_info)
						swal({
								title: "Thank you!", 
								text : "Your changes have been made",
								type: "success"
							})
					}

				}.bind(this),
				error : function(){
					console.log("error")
				},
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});
		}

	render() {

		var text_inputs = form_inputs.map((form_input, index) => {
			return (<TextInput onTextInputChange = {this.onTextInputChange.bind(this)}
				value = {this.state[form_input]} field = {form_input} label = {form_labels[index]}
				input_type = {input_types[index]}/>)
		})

		return (
			<Form horizontal>
				{text_inputs}
				<FormGroup controlId = "submit_button">
				<Col smOffset={0} sm={10}>
					<Button onClick = {this.onSubmitPress.bind(this)}>
					Submit!
					</Button>
				</Col>
				</FormGroup>
			</Form>
		)
	}
}

