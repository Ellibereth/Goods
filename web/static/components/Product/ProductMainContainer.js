var React = require('react');
var ReactDOM = require('react-dom');
import {} from 'react-bootstrap';
import StripeButton from '../Payments/StripeButton.js'
var Config = require('Config')
var url = Config.serverUrl



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
		// something better needs to be done about bad pages, but I'll figure something out soon
		var images = []
		for (var i = 0; i < this.state.product.num_images; i++){
			var src = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/" + this.state.product.product_id + "_" + i
			images.push(
				<img src = {src} className = "product-image"
				/>
			)
		}
		return (
			<div className = "container" id = "product-page-container">
				{this.state.invalid_product ?
					<h3>
						You've reached a bad product page! Click <a href = "/"> here </a> to return home.
					</h3>

				:
					<div>
						<h3> Name : {this.state.product.name} </h3>
						<h3> Price : {this.state.product.price} </h3>
						<h3> Description : {this.state.product.description} </h3>
						<h3> Manufacturer : {this.state.product.manufacturer} </h3>
						<h3> Images:  </h3>
						<div>
							{images}
						</div>

						<StripeButton product = {this.state.product}/>
					</div>
				}	
			</div>
		)
	}
}