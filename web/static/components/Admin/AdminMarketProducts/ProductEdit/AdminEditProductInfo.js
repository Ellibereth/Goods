var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory
import AdminActivateProduct from './AdminActivateProduct'
import AdminTextInput from '../../../Input/AdminTextInput.js'
const form_fields = ['name', 'manufacturer', 'price', 'description', 'sale_end_date', 'story_text', 'story_template', 'product_template', 'num_items_limit']
const form_labels = ['Name', 'Manufacturer', 'Price', 'Description', "Sale End Date", 'Story Text', 'Story Template', 'Product Template', 'Item Limit']
const input_types = ['text', 'text', 'text', 'textarea', 'datetime-local', 'textarea', 'text', 'text', 'text', 'text']

export default class AdminEditProductInfo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			product : {}
		}
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
		swal({
		  title: "ARE YOU SURE?",
		  text: "ONCE YOU HIT OKAY, THIS CHANGE WILL BE SEEN LIVE",
		  showCancelButton: true,
		  confirmButtonColor: "#DD6B55",
		  confirmButtonText: "Yes",
		  cancelButtonText: "No!",
		  closeOnConfirm: true,
		  closeOnCancel: true
		},
		function () {
			this.submitTextData.bind(this)()
		}.bind(this))
	}

	onToggleProductHasVariants(has_variants){
		swal({
		  title: "ARE YOU SURE?",
		  text: "ONCE YOU HIT OKAY, THIS CHANGE WILL BE SEEN LIVE",
		  showCancelButton: true,
		  confirmButtonColor: "#DD6B55",
		  confirmButtonText: "Yes",
		  cancelButtonText: "No!",
		  closeOnConfirm: true,
		  closeOnCancel: true
		},
		function () {
			this.onToggleProductHasVariants.bind(this)(has_variants)
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
				swal("Complete!", "Product successfully updated", "success")
				setTimeout(function () {location.reload()}, 4000)
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
				this.props.getProductInformation.bind(this)()
				setTimeout(function () {swal("Complete!", "Product successfully updated", "success")}, 500)

			}
			else {
				swal(data.error.title, data.error.text , data.error.type)
			}
			this.props.getProductInformation()
	  	}.bind(this),
	  	error : function(){
	  	},
	  		dataType: "json",
	  		contentType : "application/json; charset=utf-8"
		});
	}

	warningAlertToggleVariants(callback){
		swal({
		  title: "ARE YOU SURE?",
		  text: "ONCE YOU HIT OKAY, THIS CHANGE WILL BE SEEN LIVE",
		  showCancelButton: true,
		  confirmButtonColor: "#DD6B55",
		  confirmButtonText: "Yes",
		  cancelButtonText: "No!",
		  closeOnConfirm: true,
		  closeOnCancel: true
		},
		function () {
			callback()
		}.bind(this))
	}
	
	render() {	
		if (!this.state.product) return <div/>
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

			var toggle_variants = (
				<div>
					<h3> Click to make this a product with variants. Note this will deactivate the product.</h3>
					<button  type = "button" className = "btn btn-default" 
						onClick = {this.warningAlertToggleVariants.bind(this, this.toggleProductHasVariants.bind(this, true))}>
						Allow Variants
					</button>
				</div>
			)
		}

		else {
			input_forms.push(
				<AdminTextInput onTextInputChange = {this.onTextInputChange.bind(this)}
				value = {this.state.product.variant_type_description} field = "variant_type_description"
				label = "Variant Type Description (color, size, etc)"
				input_type = "text"/>

			)
			var toggle_variants = (
				<div>
					<h3> Click to make this a product without variants. Note this will deactivate the product. </h3>
					<button  type = "button" className = "btn btn-default" 
						onClick = {this.warningAlertToggleVariants.bind(this, this.toggleProductHasVariants.bind(this, false))}>
						Remove Variants
					</button>
				</div>
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





		return (
			<div className = "container" id = "admin_edit_product">
				<AdminActivateProduct product = {this.state.product}/>

				<hr/>


				<div className = "row" id = "text_edit">
					<form className ="form-horizonal">
						{input_forms}
						{live_toggle}
						<div className = "form-group">
							<div className = "col-md-10 col-lg-10">
								<button  type = "button" className = "btn btn-default" 
								onClick = {this.onTextSubmitPress.bind(this)}>
									Submit
								</button>
							</div>
						</div>
					</form>
				</div>


				<hr/>

				<div className ="row">
					{toggle_variants}
				</div>

			</div>
		)
	}
}