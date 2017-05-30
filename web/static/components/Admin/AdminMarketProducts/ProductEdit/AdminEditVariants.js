var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory

import TextInput from '../../../Input/TextInput.js'
import AdminEditVariant from './AdminEditVariant'
import AddVariantForm from '../ProductAdd/AddVariantForm'

export default class AdminEditVariants extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	

	render() {	
		if (!this.props.product) return <div/>

		if (this.props.product.variants) {
			var inventory_display = this.props.product.variants.map((variant, index) =>
				<AdminEditVariant
					product = {this.props.product}
					variant = {variant} index = {index}
					getProductInformation = {this.props.getProductInformation}
					/>
			)
			if (inventory_display == 0){
				var inventory_display = <div> This product supports variants but has none right now. </div>
			}
		}

		else {
			var inventory_display = <div> This product does not support variants at this time </div>
		}

		
		return (
			<div className = "container">

				<AddVariantForm 
				product = {this.props.product}
				getProductInformation ={this.props.getProductInformation} />
				<br/>
				<hr/>

				<h2> Existing Variants </h2>
				{inventory_display}	




			</div>
		)
	}
}