var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;
import AppStore from '../../../../stores/AppStore.js';
import AppActions from '../../../../actions/AppActions.js';
import AddressForm from '../../../Input/AddressForm.js'

import {AlertMessages} from '../../../Misc/AlertMessages'
import FadingText from '../../../Misc/FadingText'
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
			address_zip : "",
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
		this.editAddress.bind(this)()	
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
		
		this.props.setLoading(true)
		$.ajax({
			type: "POST",
			url: "/editUserAddress",
			data: form_data,
			success: function(data) {
				this.props.setLoading(false)
				if (!data.success) {
					this.setErrorMessage(data.error.title)
				}
				else {
					this.props.toggleModal(null)
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
				</div>

						
						
				<div className = "row">
					<div className = "col-sm-9 col-md-9 col-lg-9">
							<button type = "button" className = "btn btn-default" onClick = {this.onSubmitPress.bind(this)}>
								Edit Address
							</button>
					</div>
				</div>
				<div className = "small-buffer"/>
				<div className = "row">
					<div className = "col-sm-12 col-md-12 col-lg-12">
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

