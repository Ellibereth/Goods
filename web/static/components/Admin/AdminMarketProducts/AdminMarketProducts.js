var React = require('react');
var ReactDOM = require('react-dom');
var Config = require('Config')
var url = Config.serverUrl

import AddProductModal from './ProductAdd/AddProductModal.js'
import UploadMarketPhoto from './ProductAdd/UploadMarketPhoto.js'
import {Button} from 'react-bootstrap'

const product_variables = ['product_id', 'name', 'product_description', 'manufacturer', 'brand', 'price',  'num_images', 'time_stamp']
const headers = ['Product Id', 'Name', 'Desctiption', 'Manufacturer', 'Brand', 'Price', '# of Images', 'Time Stamp']

export default class AdminMarketProducts extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			market_products : [],
			show_modal : false
		}
	}

	componentDidMount(){	
			$.ajax({
			  type: "POST",
			  url: url + "/getMarketProducts",
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


	toggleAddProductModal(){
		this.setState({show_modal : !this.state.show_modal})
	}

	toggleClass(id){
		$("#" + id).toggleClass("admin-table-cell-short")
	}



	render() {
		var market_products = this.state.market_products
		var table_headers = headers.map((header) => 
				<th> {header} </th>
			)

		table_headers.unshift(
				<th> Add Photo </th>
			)

		var table_entries = market_products.map((product, index) => 
				{
					var row = product_variables.map((attr) => {
						var id = product['product_id'] + "_" + attr
						return (
							<td className = "admin-table-cell-short" id = {id} 
							p_id = {product['product_id']}
							attr = {attr} index = {index}
							onClick = {this.toggleClass.bind(this, id)}>
							 {product[attr]} </td> 
							)
						})
					row.unshift(
							<td className = "admin-table-cell-short" s_id = {product['product_id']}
							attr = "addPhoto" index = {index}> 
								<UploadMarketPhoto product = {product}/>
							 </td> 
						)
					return (
						<tr>
							{row}
						</tr>
				)
			})


		return (
			<div className = "container">
				<AddProductModal show = {this.state.show_modal} toggleAddProductModal = {this.toggleAddProductModal.bind(this)}/>
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

