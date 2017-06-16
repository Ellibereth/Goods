var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;
import AppStore from '../../../../stores/AppStore.js';
import AppActions from '../../../../actions/AppActions.js';
import AddressForm from '../../../Input/AddressForm.js'

import {AlertMessages} from '../../../Misc/AlertMessages'
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
			address_name : address.name,
			description : address.description,
			address_state : address.address_state,
			address_city : address.address_city,
			address_line1 : address.address_line1,
			address_line2 : address.address_line2,
			address_zip : address.address_zip
		})
	}

	onSubmitPress(){
		swal(AlertMessages.IS_ALL_YOUR_INFORMATION_CORRECT,
		function (isConfirm) {
			if (isConfirm){
				this.editAddress.bind(this)()	
			}
		}.bind(this))
	}

	editAddress(){
		
		var data = {}
		for (var i = 0; i < form_inputs.length; i++){
			var key = form_inputs[i]
			data[key] = this.state[key]
		}
		data["jwt"] = localStorage.jwt
		data['address_id'] = this.props.address.id
		var form_data = JSON.stringify(data)
		this.props.toggleModal(null)
		this.props.setLoading(true)
		$.ajax({
			type: "POST",
			url: "/editUserAddress",
			data: form_data,
			success: function(data) {
				if (!data.success) {
					swal(data.error.title, data.error.text , data.error.type)
				}
				else {
					swal(AlertMessages.CHANGE_WAS_SUCCESSFUL)

					this.props.setLoading(false)
					this.props.refreshSettings()
				}

			}.bind(this),
			error : function(){
				ga('send', 'event', {
						eventCategory: ' server-error',
						eventAction: 'editUserAddress',
						eventLabel: AppStore.getCurrentUser().email
					});
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
					address = {this.props.address}
					onSubmit = {this.onSubmitPress.bind(this)}
					 />

					
					
				</div>
				<div className = "col-sm-9 col-md-9 col-lg-9">
					<div className = "pull-right">
						<button type = "button" className = "btn btn-default" onClick = {this.onSubmitPress.bind(this)}>
							Edit Address
						</button>
					</div>
				</div>
				
			</div>
			</div>
		)
	}
}

