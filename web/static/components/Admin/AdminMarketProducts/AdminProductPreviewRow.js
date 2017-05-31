var React = require('react');
var ReactDOM = require('react-dom');

import AddProductModal from './ProductAdd/AddProductModal.js'

import {Button} from 'react-bootstrap'
var Link = require('react-router').Link;


const src_base = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"

export default class AdminProductPreviewRow extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}

	componentDidMount(){
		
	}


	generateImagePreview(product, index){
		return (
			<td className = "admin-table-cell-short" 
				p_id = {product['product_id']}
				index = {index}>
				{product.main_image ? 
					<img src = {src_base + product.main_image} 
					className = "admin-product-image" />
				:
					<div> Main image unavailable </div>
				}

			</td> 
		)
	}


	render() {
		
		var product = this.props.product
		var index = this.props.index
		var product_variables = this.props.product_variables
		var row = product_variables.map((attr) => 
				<td className = "admin-table-cell-short" id = {product['product_id'] + "_" + attr} 
				p_id = {product['product_id']}
				attr = {attr} index = {index}>

					{product[attr] && product[attr].toString()}
				</td> 
			)
	


		row.unshift(
			this.generateImagePreview.bind(this)(product, index)
		)

		row.unshift (
			<td className = "admin-table-cell-short" id = {product['product_id']}
			attr = "go_to" index = {index}>
				<Link to = {"/yevgeniyzone555/" + product.product_id}> Go to! </Link>
			</td>
		)


		return (
			<tr>
				{row}
			</tr>
		)

	}
}

