var React = require('react');
var ReactDOM = require('react-dom');
var Link = require('react-router').Link;

import {Button} from 'react-bootstrap';
import ProductTemplate1 from './ProductTemplate1'

export default class ProductTemplates extends React.Component {
	// takes props template number
	// product, is_loading, 
	constructor(props) {
		super(props);
		this.state = {
			product : [],
			invalid_product : true,
			is_loading : true
		}
		this.getTemplate = this.getTemplate.bind(this)
	}


	getProductInformation(product_id){

		$('#product-page-container').addClass("faded");
		var form_data = JSON.stringify({
			"product_id" : product_id,
			"jwt" : localStorage.jwt
		})
		$.ajax({
		  type: "POST",
		  url: "/getMarketProductInfo",
		  data: form_data,
		  success: function(data) {
			if (!data.success){
				this.setState({invalid_product : true})
			}
			else {
				this.setState({
					invalid_product : false,
					product: data.product,
					is_loading : false
	 			})
			}
			$('#product-page-container').removeClass("faded");
		  }.bind(this),
		  error : function(){
			console.log("error")
		  },
		  dataType: "json",
		  contentType : "application/json; charset=utf-8"
		});
	}

	componentWillReceiveProps(nextProps){
		this.getProductInformation.bind(this)(nextProps.product_id)
	}

	componentDidMount(){
		this.getProductInformation.bind(this)(this.props.product_id)	
	}


	getTemplate(product){
		var template = product.template;
		switch (template){
			case 1:
				return <ProductTemplate1 
					product = {product}
					is_loading = {this.state.is_loading}
					invalid_product = {this.state.invalid_product}
					/>
				break;
			default:
				return <div/>;
		}
	}

	render(){
		
		if (this.state.product){
			var this_template = this.getTemplate.bind(this)(this.state.product)
		}

		return (
			<div>
				{this_template}
			</div>
		)

	}
}