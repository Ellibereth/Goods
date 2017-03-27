var React = require('react');
var ReactDOM = require('react-dom');
import StripeCheckout from 'react-stripe-checkout';
import {} from 'react-bootstrap';
var Config = require('Config')
var url = Config.serverUrl
const strike_api_key = "pk_test_8EWYuAcsnEEfUqVe2m91mTXB"

// takes the price of the good as prop for now
export default class StripeButton extends React.Component {
  constructor(props) {
	super(props);
	this.state = {

	}
}
	// we use a fetch here, since this is taken from stripe_api
	onToken(token){
		fetch(url + "/acceptStripePayment", {
				method: 'POST',
				body: JSON.stringify(token),
			}).then(response => {
				response.json().then(data => {
				alert(`We are in business, ${data.email}`);
			});
		});
	}

  render() {
	return (
		<StripeCheckout
		token={this.onToken}
		stripeKey= {strike_api_key}
		amount={this.props.amount}
		/>

	);
  }
}


// for refernce on props
/*
<StripeCheckout
  name="Three Comma Co."
  description="Big Data Stuff"
  image="https://www.vidhub.co/assets/logos/vidhub-icon-2e5c629f64ced5598a56387d4e3d0c7c.png"
  ComponentClass="div"
  panelLabel="Give Money"
  amount={1000000}
  currency="USD"
  stripeKey="..."
  locale="zh"
  email="info@vidhub.co"
  // Note: Enabling either address option will give the user the ability to
  // fill out both. Addresses are sent as a second parameter in the token callback.
  shippingAddress
  billingAddress={false}
  // Note: enabling both zipCode checks and billing or shipping address will
  // cause zipCheck to be pulled from billing address (set to shipping if none provided).
  zipCode={false}
  alipay
  bitcoin
  allowRememberMe
  token={this.onToken}
  // Note: `reconfigureOnUpdate` should be set to true IFF, for some reason
  // you are using multiple stripe keys
  reconfigureOnUpdate={false}
  // Note: you can change the event to `onTouchTap`, `onClick`, `onTouchStart`
  // useful if you're using React-Tap-Event-Plugin
  triggerEvent="onTouchTap"
  >
  <button className="btn btn-primary">
	Use your own child component, which gets wrapped in whatever
	component you pass into as "ComponentClass" (defaults to span)
  </button>
</StripeCheckout>
*/

