var React = require('react');
var ReactDOM = require('react-dom');
import {} from 'react-bootstrap';
import StripeButton from '../Payments/StripeButton.js'



export default class ProductMainContinaer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			product : {}
		}
	}

	componentDidMount(){
		
	}



	render() {
		return (
			<div className = "container" id = "product-page-container">
				<h1>
					{this.props.product_id}
				</h1>
				<StripeButton price = "500"/>
			</div>
		);
	}
}