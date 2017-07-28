var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory

import TextInput from '../../../Input/TextInput.js'
import AdminEditVariant from './AdminEditVariant'
import AddVariantForm from '../ProductAdd/AddVariantForm'
import {AlertMessages} from '../../../Misc/AlertMessages'

export default class AdminEditVariants extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	warningAlertToggleVariants(callback){
		swal(AlertMessages.LIVE_CHANGES_WILL_BE_MADE,
		function () {
			callback()
		}.bind(this))
	}


	toggleProductHasVariants(has_variants){
		var form_data = JSON.stringify({
			"product_id" : this.state.product.product_id,
			"has_variants" : has_variants,
			"jwt" : localStorage.jwt
		})
		$.ajax({
		type: "POST",
	  	url: "/toggleProductHasVariants",
	  	data: form_data,
	  	success: function(data) {
			if (data.success){
				swal(AlertMessages.CHANGE_WAS_SUCCESSFUL)
			}
			else {
				swal(data.error.title, data.error.text , data.error.type)
			}
			
	  	}.bind(this),
	  	error : function(){
	  	},
	  		dataType: "json",
	  		contentType : "application/json; charset=utf-8"
		});
	}


	getVariantToggle() {
		if (this.props.product.has_variants){
			var variant_toggle = (
				<div>
					<h3> Click to make this a product without variants. Note this will deactivate the product. </h3>
					<button  type = "button" className = "btn btn-default" 
						onClick = {this.warningAlertToggleVariants.bind(this, this.toggleProductHasVariants.bind(this, false))}>
						Remove Variants
					</button>
				</div>
			)
		}

		else {
			var variant_toggle = (
			<div>
				<h3> Click to make this a product with variants. Note this will deactivate the product.</h3>
				<button  type = "button" className = "btn btn-default" 
					onClick = {this.warningAlertToggleVariants.bind(this, this.toggleProductHasVariants.bind(this, true))}>
					Allow Variants
				</button>
			</div>
			)
		}
		return variant_toggle
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
			if (inventory_display === 0){
				var inventory_display = <div> This product supports variants but has none right now. </div>
			}
		}

		else {
			var inventory_display = <div> This product does not support variants at this time </div>
		}

		var variant_toggle = this.getVariantToggle.bind(this)()
		
		return (

			<div className = "container">
				<div className = "row">
					{variant_toggle}
				</div>
				<div className = "top-buffer"/>
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