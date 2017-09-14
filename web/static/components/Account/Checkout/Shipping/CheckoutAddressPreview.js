var React = require('react')
import {toTitleCase} from '../../../Input/Util'

export default class CheckoutAddressPreview extends React.Component {
	constructor(props){
		super(props)
		this.state = {
		}
	}

	render() {

		var address = this.props.address
		if (address == null || address == []){
			var address_display = <div className = "col-xs-6 col-md-5 col-lg-5 col-sm-5"/>
		}
		else {
			var address_display = (
				<div className = "col-xs-6 col-md-6 col-lg-6 col-sm-6">
					<span className = "span-block"> {toTitleCase(address.name)} </span>
					<span className = "span-block"> {toTitleCase(address.address_line1)} {address.address_line2} </span> 
					<span className = "span-block"> {toTitleCase(address.address_city)}, {address.address_state} {address.address_zip} </span>
				</div>
			)
		}
		return (
			<div>
				<div className = "row">
					<div className = "col-xs-6 col-md-4 col-lg-4 col-sm-4">
						<span className = "checkout-section-title">	<b> 1. Shipping </b> </span>
					</div>
					{address_display}
					<div className = "col-xs-6 col-md-2 col-sm-2 col-lg-2 text-right">
						<div className = "clickable-text" onClick = {() => this.props.openEditable(this.props.ADDRESS_INDEX)}>
								Change
						</div>
					</div>
					<div className = "top-buffer"/>
				</div>
			</div>
		)
	}
}

