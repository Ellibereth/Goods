var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../../stores/AppStore.js';
var browserHistory = require('react-router').browserHistory;
var Link = require('react-router').Link
import {Button} from 'react-bootstrap'

const ADDRESS_INDEX = 0
const BILLING_INDEX = 1
const CART_INDEX = 2

export default class CheckoutCardPreview extends React.Component {
	constructor(props){
		super(props);
		this.state = {
		}
	}

	render() {

		var card = this.props.card
		if (card == null || card == []){
			var card_display = <div className = "col-md-5 col-lg-5 col-sm-5"/>
		}
		else{
			var card_display = (
							<div className = "col-md-5 col-lg-5 col-sm-5">
								<span className = "span-block"> <b> {card.brand} </b> ending in {card.last4}  </span>
							</div>
					)
		}

		return (
					<div>
						<div className = "row">
							<div className = "col-md-5 col-lg-5 col-sm-5">
								<b> 2. Payment Information </b>
							</div>
							{card_display}
							<div className = "col-md-2 col-sm-2 col-lg-2 text-right">
								<div className = "clickable-text" onClick = {() => this.props.openEditable(BILLING_INDEX)}>
									Change
								</div>
							</div>
							<div className = "top-buffer"/>
						</div>
					</div>
		)
	}
}

