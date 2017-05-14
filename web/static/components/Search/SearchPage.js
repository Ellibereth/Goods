var React = require('react');
var ReactDOM = require('react-dom');

import {} from 'react-bootstrap';
import PageContainer from '../Misc/PageContainer'
import ProductPreview from '../Home/ProductPreview'


export default class HomePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			products : []
		}
	}
	componentDidMount(){
		this.loadProducts.bind(this)(this.props.params.search_input)
	}

	componentWilReceiveProps(nextProps){
		console.log(nextProps.search_input)
		this.loadProducts.bind(this)(nextProps.search_input)
	}

	loadProducts(search_input){
		console.log("loading products with search ", search_input)
		var form_data = JSON.stringify({
			'search_input' : search_input
		})
		$.ajax({
			type: "POST",
			data: form_data,
			url: "/searchProducts",
			success: function(data) {
				if (data.success) {
					this.setState({products: data.products})
				}
				else {
					swal("nice try!")
				}
			}.bind(this),
			dataType: "json",
			contentType : "application/json; charset=utf-8"
		})
	}


	render() {

		var products = this.state.products

		if (!products) return <PageContainer component = {<div/>}/>
		if (products.length > 0) {
			var products_display = products.map((product, index)=>
				<div className = "row search-row">
					<div className = "col-md-6 col-lg-6 col-sm-6"> 
					<ProductPreview product_id = {product.product_id} index = {index}/>
					</div>
				</div>
			)
		}
		else {
			var products_display = <div className = "row"> No products for this search </div>
		}
		var component = (
					<div className = "container">
						{products_display}
					</div>
				)

		return (
				<PageContainer component = {component}/>
		);
	}
}