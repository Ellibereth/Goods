var React = require('react');
var ReactDOM = require('react-dom');
var Config = require('Config')
var url = Config.serverUrl

import {Grid, Row, Col} from 'react-bootstrap';
import StripeButton from './ProductPayment/StripeButton.js'
import ProductImageDisplay from './ProductImageDisplay.js'



export default class ProductMainContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			product : {},
			invalid_product: false
		}
	}

	componentDidMount(){
		var form_data = JSON.stringify({
			"product_id" : this.props.product_id
		})
		$.ajax({
		  type: "POST",
		  url: url + "/getMarketProductInfo",
		  data: form_data,
		  success: function(data) {
			if (data == null){
				this.setState({invalid_product : true})

			}
			this.setState({product: data})
		  }.bind(this),
		  error : function(){
			console.log("error")
		  },
		  dataType: "json",
		  contentType : "application/json; charset=utf-8"
		});
	}



	render() {
	
		return (
			<div className = "container" id = "product-page-container">
				{this.state.invalid_product ?
					<h3>
						You've reached a bad product page! Click <a href = "/"> here </a> to return home.
					</h3>

				:


					<Grid className = "fluid">
						<Row>
							<Col className = "text-center" md = {4} lg = {4}>
								<ProductImageDisplay product = {this.state.product}/>
								<StripeButton product = {this.state.product}/>
							</Col>
							<Col md = {8} lg = {8}>
								<div> {this.state.product.name} </div>
								<div> $ {this.state.product.price} </div>
								<div> Product Description : {this.state.product.description} </div>
								<div> Manufacturer : {this.state.product.manufacturer} </div>
							</Col>
						</Row>
					</Grid>
				}	
			</div>
		)
	}
}