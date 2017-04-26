var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../../stores/AppStore.js';
import CheckoutAddressPreview from './CheckoutAddressPreview'
import CheckoutAddAddressModal from './CheckoutAddAddressModal'

var browserHistory = require('react-router').browserHistory;
var Link = require('react-router').Link
import {Button} from 'react-bootstrap'

export default class CheckoutAddressSelect extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			selected_address : 0,

		}
	}

	


	setAddress(){
		this.props.setAddress(this.state.selected_address)
		this.props.closeEditable()
	}

	onAddressChange(index){
		this.setState({selected_address : index})
	}



	render() {
		var addresses = this.props.addresses
		var address = this.props.address
		var address_display = addresses.map((address, index) => 
				<div className = "row">
					<div className = "top-buffer"/>
					<hr/>
					<div className = "col-xs-1 col-sm-1 col-md-1 col-lg-1">
						<input type="radio" 
						onClick = {this.onAddressChange.bind(this, index)}
						value= {index} name="gender"/>
					</div>
					<div className = "col-xs-11 col-sm-11 col-md-11 col-lg-11 vcenter">
						 {this.props.addressToString(address)}
					</div>
				</div>
			)
		if (address_display.length == 0){
			address_display = (
				<div className = "row">
					<div className = "top-buffer"/>
					<hr/>
					<div className = "col-xs-1 col-sm-1 col-md-1 col-lg-1">

					</div>
					<div className = "col-xs-11 col-sm-11 col-md-11 col-lg-11 vcenter">
						You have no addresses right now!
					</div>
				</div>
			)
		}
		


		return (
			<div>
				<CheckoutAddAddressModal 
				onAddingNewShippingAddress = {this.props.onAddingNewShippingAddress}
				show = {this.props.address_modal_open} 
				toggleModal = {this.props.toggleModal}
				refreshCheckoutInformation = {this.props.refreshCheckoutInformation}/>
				{this.props.can_edit ? 
					<div>
						{/* }
						<div className = "row">
							<div className = "col-md-5 col-lg-5 col-sm-5 checkout-item-label-editable">
								<b> 1. Select an Address </b>
							</div>
							<div className = "col-md-5 col-lg-5 col-sm-5" />
							<div className = "col-md-2 col-lg-2 col-sm-2">
								<div onClick = {this.props.closeEditable}> 
									Close 
									<span className = "glyphicon glyphicon-remove small"/>
								</div>
							</div>
						</div>
					*/}
						<div className = "row">
							<div className = "col-xs-6 col-sm-6 col-md-6 col-lg-6 ">
								<b> 1. Select an Address </b>
							</div>
						</div>
							<form>
								{address_display}
							</form>
						<hr/>

						<span onClick = {this.props.toggleModal}>
							<span className = "gylphicon glyphicon-plus" /> Add Address
						</span>
						{
							this.props.addresses.length > 0 && 
							<div className = "row">
								<Button onClick = {this.setAddress.bind(this)}>
									Use this address
								</Button>
							</div>	
						}
						
					</div>
				:
					<CheckoutAddressPreview 
						openEditable = {this.props.openEditable}
						address = {this.props.address}
						/>
				}
			</div>
			
		)
	}
}

