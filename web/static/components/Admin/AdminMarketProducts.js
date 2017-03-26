var React = require('react');
var ReactDOM = require('react-dom');
import {Button} from 'react-bootstrap'
const product_variables = ['product_id', 'name', 'product_description', 'manufacturer', 'brand', 'price', 'time_stamp']
const headers = ['Product Id', 'Name', 'Desctiption', 'Manufacturer', 'Brand', 'Price', 'Time Stamp']
var Config = require('Config')
var url = Config.serverUrl
import AddProductModal from './AddProductModal.js'

export default class AdminMarketProducts extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			market_products : [],
			show_modal : false
		}
	}

	componentDidMount(){	
			var product_requests = []
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

	// index isn't used right now, but might be used later
	onAddMarketProductClick(){
		swal({
		  title: "Ready?",
		  text: "Are you sure you want to delete this?",
		  showCancelButton: true,
		  confirmButtonColor: "#DD6B55",
		  confirmButtonText: "Yes",
		  cancelButtonText: "No!",
		  closeOnConfirm: true,
		  closeOnCancel: true
		},
		function () {
			var temp = this.state.product_requests
			temp.splice(index, 1)
			this.setState({product_requests : temp})
			this.submitData.bind(this)(s_id)
		}.bind(this))
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
				{
					console.log(product)
					var rows = product_variables.map((attr) => {

						return (
							<td className = "admin-table-cell" id = {product['product_id'] + "_" + attr} p_id = {product['product_id']}
							attr = {attr} index = {index}>  {product[attr]} </td> 
							)
						})
					return (
						<tr>
							{rows}
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

