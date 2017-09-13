var React = require('react');
var ReactDOM = require('react-dom');
var Link = require('react-router').Link;
var browserHistory = require('react-router').browserHistory;
import AppStore from '../../../../stores/AppStore.js';
import AppActions from '../../../../actions/AppActions.js';
import TextInput from '../../../Input/TextInput.js'
import AddressForm from '../../../Input/AddressForm.js'
import FadingText from '../../../Misc/FadingText'
const form_labels = ["Name", "Description", "City","State", "Country", "Address Line 1", 
						"Address Line 2", "Zip Code"]
const form_inputs = ["address_name", "description", "address_city", "address_state", "address_country",
					"address_line1", "address_line2", "address_zip"]

const input_types = ["text", "text", "text", "text", "text", "text", "text", "text"]
import {AlertMessages} from '../../../Misc/AlertMessages'
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
			address_zip : "",
			disabled : false,
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

	submitData(event){
		this.props.setLoading(true)
		this.setState({disabled : true})
			var data = {}
			for (var i = 0; i < form_inputs.length; i++){
				var key = form_inputs[i]
				data[key] = this.state[key]
			}
			data["jwt"] = localStorage.jwt
			var form_data = JSON.stringify(data)
			$.ajax({
				type: "POST",
				url: "/addUserAddress",
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
						eventAction: 'addUserAddress',
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
				<div>
					<form  className = "form-horizontal">
						<AddressForm header = {"Add an Address"}
						has_description = {true}
						onSubmit = {this.submitData.bind(this)}
						onTextInputChange = {this.onTextInputChange.bind(this)}/>
						<div className = "form-group" id = "submit_button">
							<div className = "row">
								<div className = "col-md-10 col-lg-10">
									<button type = "button pull-right" className = "btn btn-default"  disabled = {this.state.disabled}
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
				</div>
		)
	}
}

