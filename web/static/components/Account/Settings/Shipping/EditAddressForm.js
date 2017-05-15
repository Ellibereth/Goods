var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;
import AppStore from '../../../../stores/AppStore.js';
import AppActions from '../../../../actions/AppActions.js';
import AddressForm from '../../../Input/AddressForm.js'
import {Button} from 'react-bootstrap'

const form_inputs = ["address_name", "description", "address_city", "address_state", "address_country",
					"address_line1", "address_line2", "address_zip"]

export default class EditAddressForm extends React.Component {
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

	// initialize address values
	componentDidMount(){
		var address = this.props.address
		this.setState({
			address_name : address.address_name,
			description : address.description,
			address_state : address.address_state,
			address_city : address.address_city,
			address_line1 : address.address_line1,
			address_line2 : address.address_line2,
			address_zip : address.address_zip
		})
	}

	addAddress(){
		var data = {}
			for (var i = 0; i < form_inputs.length; i++){
				var key = form_inputs[i]
				data[key] = this.state[key]
			}
			data["jwt"] = localStorage.jwt
			data["account_id"] = AppStore.getCurrentUser().account_id
			data['address_id'] = this.props.address.id
			var form_data = JSON.stringify(data)
			$.ajax({
				type: "POST",
				url: "/editUserAddress",
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
						this.props.refreshSettings()
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
			<div className = "container">
			<div className = "row">
				<div className = "col-sm-10 col-md-10 col-lg-10">
					<AddressForm 
					onTextInputChange = {this.onTextInputChange.bind(this)}
					address = {this.props.address} />

					
					<Button onClick = {this.addAddress.bind(this)}>
						Add Address
					</Button>
				
				</div>
			</div>
			</div>
		)
	}
}

