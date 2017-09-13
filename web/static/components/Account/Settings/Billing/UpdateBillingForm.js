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
			address_state: "",
			skip_shipping: true,
			disabled: false,
			error_text : "",
			show_error_text : false,
			selected_address_index : null
		}
		this.setErrorMessage = this.setErrorMessage.bind(this)
		this.onAddressChange = this.onAddressChange.bind(this)
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

	skipBillingAddress(){
		if (!this.state.skip_shipping){
			this.setState({
				address_name : "",
				address_city : "",
				address_country : "US",
				address_line1 : "",
				address_line2 : "",
				address_zip : "",
				address_state: "",
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

	componentDidMount(){
		var user = AppStore.getCurrentUser()
		if (user.addresses.length == 0){
			this.setState({skip_shipping : false})	
		}
		else {
			this.onAddressChange(0)
		}
		
	}

	addressToString(address){
		// Example Format
		// Darek Johnson 3900 City Avenue, M619, Philadelphia, PA, 19131 United States
		return ( 
			<span>
				<b> {address.name} </b> <br/>
				{address.address_line1} <br/>
				{address.address_line2 && " " + address.address_line2} 
				{address.address_line2 && <br/>}
				{address.address_city}, {address.address_state} {address.address_zip} {address.address_country}
			</span>
		)
	}

	onAddressChange(index){
		var user = AppStore.getCurrentUser()
		var addr = user.addresses[index]
		this.setState({
			selected_address_index : index,
			address_name : addr.name,
			address_city : addr.address_city,
			address_country : "US",
			address_line1 : addr.address_line1,
			address_line2 : addr.address_line2,
			address_zip : addr.address_zip,
			address_state: addr.address_state,

		})
	}


	getExistingAddressForm(){
		var user = AppStore.getCurrentUser()
		var address_selects = user.addresses.map((address,index) => 
				<div className = "row">
					<div className = "small-buffer"/>
					<div className = "col-xs-1 col-sm-1 col-md-1 col-lg-1 text-right vcenter">
						<input type="radio"
						checked = {index == this.state.selected_address_index}
						onClick = {this.onAddressChange.bind(this, index)}
						value= {index}/>
					</div>
					<div className = "col-xs-11 col-sm-11 col-md-11 col-lg-11 vcenter">
						<span className = "checkout-card-details">  {this.addressToString(address)} </span>
					</div>
					{index != user.addresses.length - 1 ? <hr/> : <div className = "small-buffer"/>}
				</div>
			)
		return address_selects
	}


	render() {
		var select_existing_address_form = this.getExistingAddressForm()
		return (
			<div>
				<div className = "panel panel-default">
					<div className = "panel-heading">
						<div className = "row">
							<div className = "col-sm-3 col-md-3 col-lg-3">
								<span style = {{fontSize: "20px"}}>Enter Payment Information</span>
							</div>
							<div className = "col-sm-2 col-md-2 col-lg-2">
								<span className = "red-text"> * </span>
								<span className = "vcenter"> <b>Required</b> </span>
							</div>
						</div>
						
						
					</div>
					<div className = "panel-body">
						<CreditCardInput 
						name = {this.state.name}
						number = {this.state.number}
						expiry = {this.state.expiry}
						cvc = {this.state.cvc}
						header = {false}
						onSubmit = {this.submitData.bind(this)}
						onTextInputChange = {this.onTextInputChange.bind(this)} />
					</div>
				</div>

				
				
				<div className = "small-buffer"/>
				<div style = {{paddingTop: "30px"}}/>

				{ this.state.skip_shipping ?
					<div className = "panel panel-default">
						<div className = "panel-heading">
							<span style = {{fontSize: "20px"}}>Choose a Billing Address</span>
						</div>
						<div className = "panel-body">
							{select_existing_address_form}
						</div>
						<div className = "panel-footer">
							<div className = "row">
								<div className = "col-sm-3 col-md-3 col-lg-3">
									<button className = "btn btn-default"
									onClick = {this.skipBillingAddress.bind(this)}>
										Add a New Address
									</button>
								</div>
								<div className = "col-sm-3 col-md-3 col-lg-3">
									<button className = "btn btn-default" 
									onClick = {this.submitData.bind(this)}
									disabled = {this.state.disabled}>
										Submit With This Address
									</button>
								</div>
							</div>
							<div className = "row">
								<div className = "col-sm-2 col-md-2 col-lg-2">
									<FadingText height_transition ={true} 
										show = {this.state.show_error_text}>
											<div className = "checkout-error-text">
												{this.state.error_text}
											</div>
									</FadingText>
								</div>
							</div>
						</div>
					</div>

					:
					<div className = "panel panel-default">
						<div className = "panel-heading">
							<span style = {{fontSize: "20px"}}>Choose a Billing Address</span>
						</div>
						<div className = "panel-body">
							<AddressForm onSubmit = {this.submitData.bind(this)} header = {false} 
							onTextInputChange  = {this.onTextInputChange.bind(this)} />
						</div>
						<div className = "panel-footer">
							<div className = "row">
								{AppStore.getCurrentUser().addresses.length > 0 &&
									<div className = "col-sm-3 col-md-3 col-lg-3">
										<button onClick = {this.skipBillingAddress.bind(this)}
											className = "btn btn-default">
											Use an Existing Address
										</button>
									</div>
								}
								<div className = "col-sm-3 col-md-3 col-lg-3">
									<button className = "btn btn-default"
									onClick = {this.submitData.bind(this)}
									disabled = {this.state.disabled}>
										Submit With This Address
									</button>
								</div>
							</div>
							<div className = "row">
								<div className = "col-sm-2 col-md-2 col-lg-2">
									<FadingText height_transition ={true} 
										show = {this.state.show_error_text}>
											<div className = "checkout-error-text">
												{this.state.error_text}
											</div>
									</FadingText>
								</div>
							</div>
						</div>
					</div>
				}

	
			</div>
		)
	}
}

