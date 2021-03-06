var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../../stores/AppStore.js';
import AddressForm from '../../../Input/AddressForm.js'

var browserHistory = require('react-router').browserHistory;
var Link = require('react-router').Link
const ADDRESS_INDEX = 0
const BILLING_INDEX = 1
const CART_INDEX = 2

const form_inputs = ["address_name", "description", "address_city", "address_state", "address_country",
					"address_line1", "address_line2", "address_zip"]
import {AlertMessages} from '../../../Misc/AlertMessages'
// requires as props
//	refreshCheckoutInformation

export default class CheckoutAddAddress extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			use_same_for_billing : 1,
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

	onSubmitPress(event){
		event.preventDefault()
		this.addAddress.bind(this)()
	}

	addAddress(){
		this.props.setLoading(true)
		this.props.toggleModal()
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
				if (!data.success) {
					swal(data.error.title, data.error.text , data.error.type)
				}
				else {
					this.props.onAddingNewShippingAddress(this.state.use_same_for_billing)
				}
				this.props.setLoading(false)

			}.bind(this),
			error : function(){
				ga('send', 'event', {
						eventCategory: ' server-error',
						eventAction: 'addUserAddress',
						eventLabel: AppStore.getCurrentUser().email
					});
			},
			dataType: "json",
			contentType : "application/json; charset=utf-8"
		});
	}


	componentWillMount(){
		this.props.refreshCheckoutInformation()
	}

	render() {
		return (
			<div className = "container-fluid">
				<div className = "col-sm-12 col-md-12 col-lg-12">
					<div className = "row">
					
						<AddressForm onSubmit = {this.onSubmitPress.bind(this)}
						has_description = {true}
						onTextInputChange = {this.onTextInputChange.bind(this)}/>

					</div>
						<hr/>

					<div className = "row">
							
						<button className = "btn btn-default" 
							onClick = {this.onSubmitPress.bind(this)}>
							Add Address
						</button>
					</div>
				</div>
			</div>
		)
	}
}

