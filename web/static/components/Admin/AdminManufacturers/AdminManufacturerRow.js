var React = require('react');
var ReactDOM = require('react-dom');

import {formatDate, formatPrice} from '../../Input/Util'

var Link = require('react-router').Link;

const src_base = "https://s3-us-west-2.amazonaws.com/publicmarketmanufacturerphotos/"

export default class AdminManufacturerRow extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}

	componentDidMount(){
		
	}


	generateImagePreview(manufacturer, index){
		return (
			<td className = "admin-table-cell-short" 
				p_id = {manufacturer['manufacturer_id']}
				index = {index}>
				{manufacturer.main_image ? 
					<img src = {src_base + manufacturer.main_image} 
					className = "admin-manufacturer-image" />
				:
					<div> Main image unavailable </div>
				}

			</td> 
		)
	}

	getCellContents(manufacturer, attr) {
		if (manufacturer[attr] == null) {
			return "null"
		}
		else if (manufacturer[attr] === false || manufacturer[attr] === true) {
			return manufacturer[attr].toString()
		}
		else {
			return manufacturer[attr]
		}
	}


	render() {
		
		var manufacturer = this.props.manufacturer
		var index = this.props.index
		var manufacturer_variables = this.props.manufacturer_variables
		var row = manufacturer_variables.map((attr) =>  {
				var cell_contents = this.getCellContents(manufacturer, attr)
				return (
					<td className = "admin-table-cell-short" id = {manufacturer['manufacturer_id'] + "_" + attr} 
					p_id = {manufacturer['manufacturer_id']}
					attr = {attr} index = {index}>
						{cell_contents}
					</td>
				)
			})
	

		row.unshift (
			<td className = "admin-table-cell-short" id = {manufacturer['manufacturer_id']}
			attr = "go_to" index = {index}>
				<a href = {"/yevgeniypoker555/editManufacturer/" + manufacturer.manufacturer_id}> Go to! </a>
			</td>
		)


		return (
			<tr>
				{row}
			</tr>
		)

	}
}

