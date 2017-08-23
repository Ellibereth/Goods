var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory
import AdminActivateProduct from './AdminActivateProduct'
import AdminTextInput from '../../../Input/AdminTextInput.js'
const form_fields = ['name', 'manufacturer', 'manufacturer_email', 'price', 'sale_text_product', 'sale_text_home', 'sale_end_date', 'category', 'product_template', 'num_items_limit', 'manufacturer_fee', 'quadrant1', 'quadrant2', 'quadrant3', 'quadrant4', 'product_search_tags', 'product_listing_tags', 'related_product_tags']
const form_labels = ['Name', 'Manufacturer', 'Manufacturer Emails (separate with commas)', 'Original Price (make sure this is in cents)', 'Sale Red Text Product (this is HTML)', 'Sale Red Text Home (this is HTML)', "Sale End Date", 'Category', 'Product Template', 'Item Limit', 'Manufacturer Fee..this value is stored in ten thousands, so 500 => 5%', 'Quadrant 1', 'Quadrant 2', 'Quadrant 3', 'Quadrant 4', 'Search Tags (Separate by commas)', 'Listing Tags (Separate by commas)', 'Related Product Tags (Separate by commas)']
const input_types = ['text', 'text', 'text', 'text', 'textarea', 'textarea', 'datetime-local', 'text', 'text', 'text', 'text', 'textarea', 'textarea', 'textarea', 'textarea', 'textarea','textarea','textarea']

import {AlertMessages} from '../../../Misc/AlertMessages'
export default class AdminEditProductInfo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			product : {}
		}
	}

	warningAlertToggleVariants(callback){
		swal(AlertMessages.LIVE_CHANGES_WILL_BE_MADE,
		function () {
			callback()
		}.bind(this))
	}

	// handle the text input changes
	onTextInputChange(field, value){
		var obj = this.state.product
		obj[field] = value
		this.setState({product: obj})
	}

	componentDidMount(){
		this.setState({product : this.props.product})	
	}

	componentWillReceiveProps(nextProps){
		this.setState({product : nextProps.product})
	}

	onTextSubmitPress() {
		swal(AlertMessages.LIVE_CHANGES_WILL_BE_MADE,
			function () {
				this.submitTextData.bind(this)()
		}.bind(this))
	}

	
	submitTextData(){
		var form_data = JSON.stringify({
			"product_id" : this.state.product.product_id,
			"product" : this.state.product,
			"jwt" : localStorage.jwt
		})
		$.ajax({
		type: "POST",
	  	url: "/updateProductInfo",
	  	data: form_data,
	  	success: function(data) {
			if (data.success){
				this.setState({product : data.product})
				swal(AlertMessages.CHANGE_WAS_SUCCESSFUL)
				this.props.getProductInformation()
			}
			else {
				swal({title: data.error, type: "error"})
			}
			
	  	}.bind(this),
	  	error : function(){
	  	},
	  		dataType: "json",
	  		contentType : "application/json; charset=utf-8"
		});
	}

	
	
	render() {	
		if (!this.state.product) return <div/>;


		var input_forms = form_fields.map((field, index) => 
				<AdminTextInput onTextInputChange = {this.onTextInputChange.bind(this)}
				value = {this.state.product[field]} field = {field} label = {form_labels[index]}
				input_type = {input_types[index]}/>
			)


		// allow us to edit invetory here for single products
		if (!this.state.product.has_variants) {
			input_forms.push(
				<AdminTextInput onTextInputChange = {this.onTextInputChange.bind(this)}
				value = {this.state.product.inventory} field = "inventory"
				label = "Inventory"
				input_type = "text"/>
			)

		}

		else {
			input_forms.push(
				<AdminTextInput onTextInputChange = {this.onTextInputChange.bind(this)}
				value = {this.state.product.variant_type_description} field = "variant_type_description"
				label = "Variant Type Description (color, size, etc)"
				input_type = "text"/>

			)
			
		}


		var live_toggle = (
				<div className="form-group row">
				<label className="col-md-2 col-lg-2 col-form-label">
					Would you like this product to show up live?
				</label>
					<div className = "col-md-6 col-lg-6">
					 	<select className="form-control" id="sel1" 
					 	value = {this.state.product.live ? this.state.product.live : false}
					 	onChange = {(event) => this.onTextInputChange("live", event.target.value)}>
					 		<option value = {true}> Live </option>
    						<option value = {false}> Not Live </option>
					 	</select>
					</div>
				</div>

			)

		var show_logo_toggle = (
				<div className="form-group row">
				<label className="col-md-2 col-lg-2 col-form-label">
					Would you like to display the manufactuer logo?
				</label>
					<div className = "col-md-6 col-lg-6">
					 	<select className="form-control" id="sel1" 
					 	value = {this.state.product.show_manufacturer_logo ? this.state.product.show_manufacturer_logo : false}
					 	onChange = {(event) => this.onTextInputChange("show_manufacturer_logo", event.target.value)}>
					 		{this.state.product.manufacturer_logo_id && <option value = {true}> Show logo </option>}
    						<option value = {false}> Do not show logo </option>
					 	</select>
					</div>
				</div>

			)




		return (
			<div className = "container" id = "admin_edit_product">
				<AdminActivateProduct product = {this.state.product}/>

				<hr/>


				<div className = "row" id = "text_edit">
					<form className ="form-horizonal">
						{input_forms}
						{live_toggle}
						{show_logo_toggle}
						<div className = "form-group">

							<div className = "col-md-4 col-lg-4">
								<button  type = "button" className = "btn btn-default" 
								onClick = {this.onTextSubmitPress.bind(this)}>
									Submit
								</button>
							</div>
						</div>
					</form>
				</div>


				<hr/>


			</div>
		)
	}
}