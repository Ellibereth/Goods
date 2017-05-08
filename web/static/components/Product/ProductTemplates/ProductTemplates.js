var React = require('react');
var ReactDOM = require('react-dom');
var Link = require('react-router').Link;

import {Button} from 'react-bootstrap';
import ProductTemplate1 from './ProductTemplate1/ProductTemplate1'

export default class ProductTemplates extends React.Component {
	// takes props template number
	// product, is_loading, 
	constructor(props) {
		super(props);
		this.state = {
			
		}
		this.getTemplate = this.getTemplate.bind(this)
	}


	


	getTemplate(product){
		var template = product.product_template;
		switch (template){
			case 1:
				return <ProductTemplate1 
					product = {this.props.product}
					is_loading = {this.props.is_loading}
					/>
				break;
			default:
				return <div/>;
		}
	}

	render(){
		if (this.props.product){
			var this_template = this.getTemplate.bind(this)(this.props.product)
		}
		else {
			var this_template = <div/>
		}

		return (
			<div>
				{this_template}
			</div>
		)

	}
}