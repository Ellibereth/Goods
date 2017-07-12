var React = require('react');
var ReactDOM = require('react-dom');

import ProductTitle from './ProductTitle'
import ProductDetails from './ProductDetails'
import ProductExtraInfo from './ProductExtraInfo'

export default class ProductTemplate1 extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	render() {

		return (

			<div>
				<ProductTitle product = {this.props.product}/>
				<ProductDetails product = {this.props.product}/>
				<ProductExtraInfo product = {this.props.product}/>
			</div>
		
		);
	}
}
