var React = require('react');
var ReactDOM = require('react-dom');

import AddProductModal from './ProductAdd/AddProductModal.js'

import {Button} from 'react-bootstrap'
var Link = require('react-router').Link;
import AdminProductPreviewRow from './AdminProductPreviewRow'
const headers = ['Go To This Product', 'Image', 'Name', "Inventory", 'Description', 'URL', 'On Home Page', 'Is Active','Manufacturer', 'Price', '# of Images', 'Date Added', 'Sale End Date']
const product_variables = ['name', 'inventory', 'description', 'product_id', 'live', 'active', 'manufacturer', 'price',  'num_images', 'date_created', 'sale_end_date'] 

export default class AdminMarketProducts extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			show_modal : false
		}
	}


	componentDidMount(){

	}


	filterProducts(products, active) {
		var filtered_products = []
		products.map((product, index) => {
			if (product.active == active) {
				filtered_products.push(product)
			}
		})
		return filtered_products
	}

	render() {

		var products = this.filterProducts(this.props.products, this.props.active)

		var table_headers = headers.map((header) => 
				<th> {header} </th>
			)


		var table_entries = products.map((product, index) => 
				<AdminProductPreviewRow 
				product_variables = {product_variables}
				product = {product} index = {index}/>
			)


		return (

				<div className = "container">
					<div className="col-md-12">
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

