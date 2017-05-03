var React = require('react');
var ReactDOM = require('react-dom');
import {} from 'react-bootstrap';
import ProductMainContainer from './ProductMainContainer.js'
import TopNavBar from '../Misc/TopNavBar.js'
import Footer from '../Misc/Footer.js'




export default class ProductPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			product : [],
			invalid_product : true,
			is_loading : true
		}
	}

	getProductInformation(){
		var form_data = JSON.stringify({
			"product_id" : this.props.params.product_id,
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
			
		  }.bind(this),
		  error : function(){
			console.log("error")
		  },
		  dataType: "json",
		  contentType : "application/json; charset=utf-8"
		});
	}

	componentDidMount(){
		this.getProductInformation.bind(this)()
	}




	render() {
		console.log(this.state.product)
		return (
				<div>
					<TopNavBar/>
					<ProductMainContainer   
						product = {this.state.product} 
				 		invalid_product = {this.state.invalid_product}
				 		is_loading = {this.state.is_loading}
					/>
				</div>
		);
	}
}