var React = require('react');
var ReactDOM = require('react-dom');
var Link = require('react-router').Link;
var browserHistory = require('react-router').browserHistory;
import AppStore from '../../../../stores/AppStore.js';
import AppActions from '../../../../actions/AppActions.js';
import TextInput from '../../../Input/TextInput.js'
import AddressForm from '../../../Input/AddressForm.js'
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
			address_zip : "",
			disabled : false,
		}
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
					if (!data.success) {
						swal({
							title : "Sorry",
							text: data.error, 
							type: "warning"
						})
					}
					else {
						swal({
								title: "Thank you", 
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
									this.props.setLoading(false)
									if (data.success) {
										AppActions.updateCurrentUser(data.user)
										window.location = `/settings`
									}
									else {
										this.setState({
											disabled : false
										})
										swal({
											title : data.error,
											type : "error"
										})
									}
									this.props.setLoading(false)
									
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
					ga('send', 'event', {
						eventCategory: ' server-error',
						eventAction: 'addUserAddress',
						eventLabel: AppStore.getCurrentUser().email
					});
					this.props.setLoading(false)
					setTimeout(function() {
						swal({
							title :"Something went wrong",
							type : "error"
						})
					}, 250)
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
						<AddressForm header = {"Add an address"}
						has_description = {true}
						onSubmit = {this.submitData.bind(this)}
						onTextInputChange = {this.onTextInputChange.bind(this)}/>
						<div className = "form-group" id = "submit_button">
							<div className = "col-md-10 col-lg-10">
								<button type = "button pull-right" className = "btn btn-default"  disabled = {this.state.disabled}
								onClick = {this.submitData.bind(this)}>
									Submit
								</button>
							</div>
						</div>
					</form>
				</div>
		)
	}
}

