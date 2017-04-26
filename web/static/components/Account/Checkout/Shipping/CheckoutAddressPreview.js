var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../../stores/AppStore.js';
import TopNavBar from '../../../Misc/TopNavBar'

var browserHistory = require('react-router').browserHistory;
var Link = require('react-router').Link
import {Button} from 'react-bootstrap'


// requires props
// openEditable
// address
export default class CheckoutAddressPreview extends React.Component {
	constructor(props){
		super(props);
		this.state = {
		}
	}


	render() {

		var address = this.props.address
		if (address == null || address == []){
			var address_display = <div className = "col-md-6 col-lg-6 col-sm-6"/>
		}
		else {
			var address_display = (
				<div className = "col-md-6 col-lg-6 col-sm-6">
					<span className = "span-block"> {address.name} </span>
					<span className = "span-block"> {address.address_line1} {address.address_line2} </span> 
					<span className = "span-block"> {address.address_city}, {address.address_state} {address.address_zip} </span>
				</div>
			)
		}
		return (
				<div>
					<div className = "row">
						<div className = "col-md-5 col-lg-5 col-sm-5">
							<b> 1. Shipping Address </b>
						</div>
							{address_display}
						<div className = "col-md-1 col-sm-1 col-lg-1">
							<div onClick = {this.props.openEditable}>
								Change
							</div>
						</div>
						<div className = "top-buffer"/>
					</div>
				</div>
		)
	}
}

