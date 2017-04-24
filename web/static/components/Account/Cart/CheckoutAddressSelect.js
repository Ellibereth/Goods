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
		}
	}


	setAddress(index){
		this.props.setAddress(this.props.addresses[index])
	}

	


	render() {
		var addresses = this.props.addresses
		var address_display = addresses.map((address, index) => 
				<div className = "row">
					<div className = "top-buffer"/>
					<hr/>
					<div className = "col-xs-1 col-sm-1 col-md-1 col-lg-1">
						<input type="radio" 
						onClick = {this.setAddress.bind(this, index)}
						value= {index} name="gender"/>
					</div>
					<div className = "col-xs-11 col-sm-11 col-md-11 col-lg-11 vcenter">
						 {this.props.addressToString(address)}
					</div>
				</div>
			)


		return (
			<div>
					<div className = "row">
						<div className = "col-xs-12 col-sm-12 col-md-12 col-lg-12 cart-title hcenter">
								Choose an Address 
						</div>
					</div>

					<div className = "row">
						<div className = "col-xs-6 col-sm-6 col-md-6 col-lg-6">
							<b> Your addresses </b>
						</div>
					</div>
						<form>
						{address_display}
						</form>
						<hr/>

						<div className = "row">
							<div className = "col-xs-3 col-sm-3 col-md-3 col-lg-3 vcenter">
								<Button onClick = {this.props.navigateToLastStep.bind(this)}> Return to Billing </Button>
							</div>

							<div className = "col-xs-3 col-sm-3 col-md-3 col-lg-3 vcenter">
								<Button onClick = {this.props.navigateToNextStep.bind(this)}> Proceed to Checkout </Button>
							</div>

							
						</div>
			</div>
			
		)
	}
}

