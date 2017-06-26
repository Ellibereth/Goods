var React = require('react');
var ReactDOM = require('react-dom');

import {formatPrice} from '../../Input/Util'


export default class CheckoutPriceRow extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	render() {
		
		var is_final_row = this.props.is_final_row
		var label_class = is_final_row ? "checkout-price-label-text checkout-price-last-row" : "checkout-price-label-text"
		var amount_class = is_final_row ? "checkout-price-amount-text checkout-price-last-row" : "checkout-price-amount-text"
		return (
			<div className = "row">
				{this.is_final_row && <hr/>}
				<div className = "col-lg-6 col-md-6 col-sm-6 col-xs-6">
					<span 
					className = {label_class}>
						 {this.props.label} 
					</span>
				</div>
				<div className = "col-lg-6 col-md-6 col-sm-6 col-xs-6 text-right">
					<span className = {amount_class}>
						{this.props.price}
					</span>
					{this.props.has_underline && <hr/>}
				</div>
			</div>
		)
	}
}