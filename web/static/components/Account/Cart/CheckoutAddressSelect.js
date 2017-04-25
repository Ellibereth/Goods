var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../stores/AppStore.js';
import TopNavBar from '../../Misc/TopNavBar'

var browserHistory = require('react-router').browserHistory;
var Link = require('react-router').Link
import {Button} from 'react-bootstrap'

export default class CheckoutAddressSelect extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			selected_address : 0
		}
	}


	setAddress(){
		this.props.setAddress(this.props.addresses[this.state.selected_address])
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


		return (
			<div>
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

						<div className = "row">
							<Button onClick = {this.setAddress.bind(this)}>
								Use this address
							</Button>
						</div>
					</div>
				:
					<div>
						<div className = "row">
							<div className = "col-md-5 col-lg-5 col-sm-5">
								<b> 1. Shipping Address </b>
							</div>
							<div className = "col-md-6 col-lg-6 col-sm-6">
								<span className = "span-block"> {address.name} </span>
								<span className = "span-block"> {address.address_line1} {address.address_line2} </span> 
								<span className = "span-block"> {address.address_city}, {address.address_state} {address.address_zip} </span>
							</div>
							<div className = "col-md-1 col-sm-1 col-lg-1">
								<div onClick = {this.props.openEditable}>
									Change
								</div>
							</div>
							<div className = "top-buffer"/>
						</div>
					</div>
				}
			</div>
			
		)
	}
}

