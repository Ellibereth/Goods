var React = require('react');
var ReactDOM = require('react-dom');

import {Grid, Col, Row} from 'react-bootstrap';
var browserHistory = require('react-router').browserHistory;


export default class SearchProductPreview extends React.Component {
  	constructor(props) {
		super(props);
		this.state = {
			product : {},
			invalid_product : true

		}
  	}

  	goToProduct(){
  		browserHistory.push('/eg/' + this.props.product_id)
  	}

  	componentDidMount(){
	  	var form_data = JSON.stringify({
				"product_id" : this.props.product_id
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
				this.setState({product: data.product, invalid_product : false})
				
			}
			
		  }.bind(this),
		  error : function(){
			console.log("error")
		  },
		  dataType: "json",
		  contentType : "application/json; charset=utf-8"
		})
	}

  	render() {
  		// hard coded for now
  		var date = this.state.product.sale_end_date
  		if (this.state.invalid_product) return <div/>
  		var col_size = this.props.col_size
		return (

			<div 
			id = {this.state.product.product_id} 
			onClick = {this.goToProduct.bind(this)}
			className = {"product-preview-home col-md-" + col_size + " col-lg-" + col_size}
			>
				<div className = "row">
					<Col xs = {4} s = {4} md = {4} lg= {4}>
					{this.state.product.images.length == 0 ? 
						<div> No Image For This Product </div>

							:
						<img 
						src = {"https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/" 
						+ this.state.product.main_image}
						className = "img-responsive img-rounded product-preview-image"/>
					}
					</Col>

					<Col xs = {8} s = {8} md = {8} lg = {8}>
						<span className = "row-fluid"> Name: {this.state.product.name} </span> <br/>
						<span className = "row-fluid"> Price: ${this.state.product.price} </span> <br/>
						<span className = "row-fluid"> Manufacturer: {this.state.product.manufacturer} </span> <br/>
					</Col>
				</div>
			</div>
		);
	}
}