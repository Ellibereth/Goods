var React = require('react')
var ReactDOM = require('react-dom')


export default class MobileFooter extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
		}
	}

	render() {
		return (
				
			<footer>		
				<div className = "mobile-footer-links">
					<div className = "row">
						<div className = "col-xs-6"> <a href="/about">About Us</a> </div>
						<div className = "col-xs-6">  <a href="/faq">FAQ</a> </div>
					</div>
					<div className = "row">
						<div className = "col-xs-6">  <a href="/usa">Made in the USA</a> </div>
						<div className = "col-xs-6">  <a href="/suggestProduct">Suggest Products</a> </div>
					</div>
					<div className = "row">
						<div className = "col-xs-6">  <a href="/contact">Contact Us</a> </div>
						<div className = "col-xs-6">  <a href="/careers">Careers</a> </div>
					</div>
					<div className = "row">
						<div className = "col-xs-6">  <a href="/vendors">Vendors</a> </div>
						<div className = "col-xs-6">  <a href="/sellWithEdgar">Sell on Edgar USA</a> </div>
					</div>
					<div className = "row">
						<div className = "col-xs-6">  <a href="/terms">Terms of Service</a> </div>
						<div className = "col-xs-6">  <a href="/privacy">Privacy Policy</a> </div>
					</div>
					<div className = "row">
						<div className = "col-xs-6">  <a href="/returnPolicy">Returns</a> </div>		
						<div className = "col-xs-6">  <a href="/settings">Your Account</a> </div>
					</div>
					<div className = "row">
						<div className = "col-xs-6">  <a href="/myCart">Your Cart</a> </div>
						<div className = "col-xs-6">  <a href="/myOrders">Your Orders</a> </div>
					</div>
				</div>
			</footer>
		)
	}
}