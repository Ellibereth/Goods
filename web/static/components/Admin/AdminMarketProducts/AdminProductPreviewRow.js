var React = require('react');
var ReactDOM = require('react-dom');

import AddProductModal from './ProductAdd/AddProductModal.js'
import {formatDate, formatPrice} from '../../Input/Util'

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

	getCellContents(product, attr) {
		if (product[attr] == null) {
			return "null"
		}
		else if (product[attr] === false || product[attr] === true) {
			return product[attr].toString()
		}
		else if (attr == "product_id") {
			return <a href = {'/eg/' + product[attr]}> {'/eg/' + product[attr]} </a>
		}

		else if (attr == 'date_created' || attr == 'sale_end_date') {
			return formatDate(product[attr])
		}
		else if (attr == "price") {
			return "$" + formatPrice(product.price)
		}
		else {
			return product[attr]
		}
	}


	render() {
		
		var product = this.props.product
		var index = this.props.index
		var product_variables = this.props.product_variables
		var row = product_variables.map((attr) =>  {
				var cell_contents = this.getCellContents(product, attr)
				return (
					<td className = "admin-table-cell-short" id = {product['product_id'] + "_" + attr} 
					p_id = {product['product_id']}
					attr = {attr} index = {index}>
						{cell_contents}
					</td>
				)
			})
	


		row.unshift(
			this.generateImagePreview.bind(this)(product, index)
		)

		row.unshift (
			<td className = "admin-table-cell-short" id = {product['product_id']}
			attr = "go_to" index = {index}>
				<a href = {"/yevgeniypoker555/editProduct/" + product.product_id}> Go to! </a>
			</td>
		)


		return (
			<tr>
				{row}
			</tr>
		)

	}
}

