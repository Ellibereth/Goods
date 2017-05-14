var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory
import {Col, Form, FormControl, Grid, Row, FormGroup, Button} from 'react-bootstrap';

const form_fields = ['name', 'manufacturer', 'price', 'description', 'sale_end_date', 'inventory', 'story_text', 'story_template', 'product_template', 'num_items_limit']
const form_labels = ['Name', 'Manufacturer', 'Price', 'Description', "Sale End Date", 'Inventory', 'Story Text', 'Story Template', 'Product Template', 'Item Limit']
const input_types = ['text', 'text', 'text', 'textarea', 'datetime-local', 'text', 'textarea', 'text', 'text', 'text']
import TextInput from '../../../Input/TextInput.js'
import UploadMarketPhoto from '../ProductAdd/UploadMarketPhoto.js'
import AdminEditPhotos from './AdminEditPhotos.js' 
import UploadStoryPhoto from '../ProductAdd/UploadStoryPhoto'


export default class AdminEditProduct extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			product : {},
			variants : [],
			new_variant_type : ""
		}
	}

	// handle the text input changes
	onTextInputChange(field, value){
		var obj = this.state.product
		obj[field] = value
		this.setState({product: obj})
	}

	onVariantInputChange(field, value){
		var obj = this.state.variants
		for (var i = 0; i < obj.length; i++){
			if (obj[i]['variant_type'] == field){
				obj[i]['inventory'] = value
			}
		}
		this.setState({variants : obj})
	}

	onNewVariantChange(field, value){
		this.setState({
			new_variant_type : value
		})
	}

	componentDidMount(){
		this.setState({product : this.props.product})	
		this.setState({variants : this.props.product.variants})
	}

	componentWillReceiveProps(nextProps){
		this.setState({product : nextProps.product})
		this.setState({variants : nextProps.product.variants})
	}

	onTextSubmitPress(){
		swal({
		  title: "Ready?",
		  text: "Ready to update?",
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
				swal("Complete!", "Product successfully updated", "success")
			}
			else {
				swal("Something went wrong!", data.error, "error")
			}
	  	}.bind(this),
	  	error : function(){
	  		console.log("error")
	  	},
	  		dataType: "json",
	  		contentType : "application/json; charset=utf-8"
		});
	}

	onUpdateVariantInventory(){
		var form_data = JSON.stringify({
			"product_id" : this.state.product.product_id,
			"variants" : this.state.variants,
			"jwt" : localStorage.jwt
		})
		$.ajax({
		type: "POST",
	  	url: "/updateVariantInventory",
	  	data: form_data,
	  	success: function(data) {
			if (data.success){
				this.setState({product : data.product})
				this.setState({product : data.product.variants})
				this.props.getProductInformation.bind(this)()
				swal("Complete", "Product variant inventory successfully updated", "success")
			}
			else {
				swal("Something went wrong!", data.error, "error")
			}
	  	}.bind(this),
	  	error : function(){
	  		console.log("error")
	  	},
	  		dataType: "json",
	  		contentType : "application/json; charset=utf-8"
		});	
	}

	addProductVariant(){
		var form_data = JSON.stringify({
			"product_id" : this.state.product.product_id,
			"new_variant_type" : this.state.new_variant_type,
			"jwt" : localStorage.jwt
		})
		$.ajax({
		type: "POST",
	  	url: "/addProductVariant",
	  	data: form_data,
	  	success: function(data) {
			if (data.success){
				location.reload()
			}
			else {
				swal("Something went wrong!", data.error, "error")
			}
	  	}.bind(this),
	  	error : function(){
	  		console.log("error")
	  	},
	  		dataType: "json",
	  		contentType : "application/json; charset=utf-8"
		});	
	}

	activateVariant(){
		var form_data = JSON.stringify({
			"variant_id" : variant.variant_id,
			"jwt" : localStorage.jwt
		})
		$.ajax({
		type: "POST",
	  	url: "/activateVariant",
	  	data: form_data,
	  	success: function(data) {
			if (data.success){
				location.reload()
			}
			else {
				swal("Something went wrong!", data.error, "error")
			}
	  	}.bind(this),
	  	error : function(){
	  		console.log("error")
	  	},
	  		dataType: "json",
	  		contentType : "application/json; charset=utf-8"
		});	
	}

	deactivateVariant(){
		var form_data = JSON.stringify({
			"variant_id" : variant.variant_id,
			"jwt" : localStorage.jwt
		})
		$.ajax({
		type: "POST",
	  	url: "/deactivateVariant",
	  	data: form_data,
	  	success: function(data) {
			if (data.success){
				location.reload()
			}
			else {
				swal("Something went wrong!", data.error, "error")
			}
	  	}.bind(this),
	  	error : function(){
	  		console.log("error")
	  	},
	  		dataType: "json",
	  		contentType : "application/json; charset=utf-8"
		});	
	}

	

	render() {	
		// edit text fields
		// delete / add images
		// on image add/delete reload page
		if (!this.state.product) return <div/>

		var input_forms = form_fields.map((field, index) => 
				// if (!this.state.product.has_variants && field != "inventory") {
					<TextInput onTextInputChange = {this.onTextInputChange.bind(this)}
					value = {this.state.product[field]} field = {field} label = {form_labels[index]}
					input_type = {input_types[index]}/>
				// }
			)

		if (this.state.product.variants){
			var variant_inventory = this.state.product.variants.map((variant, index) =>
					<div>
						<div className = "row">
							{ variant.active ?
							<button className = "btn-sm btn btn-default"
							 onClick = {this.activateVariant.bind(this, variant)}>
							 Activate  
							 </button>
							 :
							 <button className = "btn-sm btn btn-default"
							 onClick = {this.deactivateVariant.bind(this, variant)}>
							 Dectivate  
							 </button>
							}
						</div>
						<TextInput onTextInputChange = {this.onVariantInputChange.bind(this)}
						field = {variant.variant_type}
						value = {variant.inventory} label = {variant.variant_type + " inventory"}/>
					</div>
				)

			var add_variant = (
					<TextInput onTextInputChange = {this.onNewVariantChange.bind(this)}
					value = {this.state.new_variant_type} label = {"New Variant Type"}/>	
				)
		}
		else {
			var variant_inventory = <div/>
			var add_variant = <div/>
		}

		return (
			<div className = "container" id = "admin_edit_product">
				<div className = "row" id = "add_story">
					<UploadStoryPhoto product = {this.props.product}/>
				</div>
				
				<hr/>
					<div className = "row" id = "text_edit">
						<Form horizontal>
							{input_forms}

							<FormGroup controlId = "submit_button">
							<Col smOffset={0} sm={10}>
								<Button onClick = {this.onTextSubmitPress.bind(this)}>
								Submit
								</Button>
							</Col>
							</FormGroup>
						</Form>
					</div>

				<hr/>
				<div className = "row">
					<Form horizontal>
						{variant_inventory}
						<FormGroup controlId = "submit_button">
							<Col smOffset={0} sm={10}>
								<Button onClick = {this.onUpdateVariantInventory.bind(this)}>
								Submit
								</Button>
							</Col>
						</FormGroup>
					</Form>
				</div>

				<hr/>

				<div className = "row">
					<Form horizontal>
						{add_variant}
						<FormGroup controlId = "submit_button">
							<Col smOffset={0} sm={10}>
								<Button onClick = {this.addProductVariant.bind(this)}>
								Add Variant
								</Button>
							</Col>
						</FormGroup>
					</Form>
				</div>
				
				
				<div className = "row" id = "image_edit">
					<UploadMarketPhoto product = {this.props.product}/>
					<AdminEditPhotos getProductInformation = {this.props.getProductInformation} 
						product = {this.props.product}/>
				</div>
			</div>
		)
	}
}