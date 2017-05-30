var React = require('react');
var ReactDOM = require('react-dom');

import AddProductModal from './ProductAdd/AddProductModal.js'

import {Button} from 'react-bootstrap'
var Link = require('react-router').Link;
import AdminProductPreviewRow from './AdminProductPreviewRow'
const headers = ['Go To This Product', 'Image', 'Name', "Inventory",  'Id', 'Description', 'Manufacturer', 'Price', '# of Images', 'Date Added', 'Sale End Date']
const product_variables = ['name', 'inventory', 'description', 'manufacturer', 'price',  'num_images', 'date_created', 'sale_end_date'] 

export default class AdminMarketProducts extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			market_products : [],
			show_modal : false
		}
		this.loadProducts = this.loadProducts.bind(this)
	}

	loadProducts(){
		var form_data = JSON.stringify({
			"jwt" : localStorage.jwt
		})
			$.ajax({
			  type: "POST",
			  url: "/getMarketProducts",
			  data : form_data,
			  success: function(data) {
				this.setState({market_products: data})
			  }.bind(this),
			  error : function(){
				console.log("error")
			  },
			  dataType: "json",
			  contentType : "application/json; charset=utf-8"
			});
	}

	componentDidMount(){
		this.loadProducts.bind(this)()
	}


	toggleAddProductModal(){
		this.setState({show_modal : !this.state.show_modal})
	}




	render() {
		var market_products = this.state.market_products
		var table_headers = headers.map((header) => 
				<th> {header} </th>
			)

		var table_entries = market_products.map((product, index) => 
				<AdminProductPreviewRow 
				product_variables = {product_variables}
				product = {product} index = {index}/>
			)


		return (

				<div className = "container">
					<AddProductModal loadProducts = {this.loadProducts} show = {this.state.show_modal} toggleAddProductModal = {this.toggleAddProductModal.bind(this)}/>
					<div className="col-md-12">
						<Button onClick = {this.toggleAddProductModal.bind(this)}>
							Add a market product 
						</Button>     
						<table className ="table table-bordered">
							<thead>
								<tr>
									{table_headers}
								</tr>
							</thead>
							<tbody>
								{table_entries}
							</tbody>
						</table>
					</div>
				</div>
		);
	}
}

