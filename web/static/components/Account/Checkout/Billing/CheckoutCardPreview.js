var React = require('react')


export default class CheckoutCardPreview extends React.Component {
	constructor(props){
		super(props)
		this.state = {
		}
	}

	render() {

		var card = this.props.card
		if (card == null || card == []){
			var card_display = <div className = "col-xs-6 col-md-5 col-lg-5 col-sm-5"/>
		}
		else {
			var card_display = (
				<div className = "col-xs-6 col-md-6 col-lg-6 col-sm-6">
					<span className = "payment-info span-block"> <b> {card.brand} </b> ending in {card.last4}  </span>
				</div>
			)
		}

		return (
			<div>
				<div className = "row row-eq-height">
					<div className = "col-xs-8 col-md-4 col-lg-4 col-sm-4">
						<span className = "checkout-section-title"> <b> 2. Payment </b> </span>
					</div>
					{card_display}
					<div className = "col-xs-4 col-md-2 col-sm-2 col-lg-2 text-right">
						<div className = "clickable-text" onClick = {() => this.props.openEditable(this.props.BILLING_INDEX)}>
							Change
						</div>
					</div>
					<div className = "top-buffer"/>
				</div>
			</div>
		)
	}
}

