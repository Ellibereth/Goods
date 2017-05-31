var React = require('react');
var ReactDOM = require('react-dom');
import {Button} from 'react-bootstrap';

const form_fields = ['variant_type', 'inventory']
const form_labels = ['Variant Type', 'Inventory']
const input_types = ['text', 'text']
import AdminTextInput from '../../../Input/AdminTextInput.js'


// takes product and variant in as props

export default class AdminEditVariant extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			variant : {}
		}
	}

	componentDidMount(){
		this.setState({variant : this.props.variant})
	}

	// handle the text input changes
	onTextInputChange(field, value){
		var obj = this.state.variant
		obj[field] = value
		this.setState({variant: obj})
	}

	activateVariant(variant){
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

	deactivateVariant(variant){
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

	deleteVariant(){
		var form_data = JSON.stringify({
			"product_id" : this.props.product.product_id,
			"variant_id" : this.props.variant.variant_id,
			"jwt" : localStorage.jwt
		})
		$.ajax({
		type: "POST",
	  	url: "/deleteVariant",
	  	data: form_data,
	  	success: function(data) {
			if (data.success){
				this.props.getProductInformation()
				swal("Deleted", "Variant successfully deleted", "success")
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

	updateVariant(){
		var form_data = JSON.stringify({
			"product_id" : this.props.product.product_id,
			"variant" : this.state.variant,
			"jwt" : localStorage.jwt
		})
		$.ajax({
		type: "POST",
	  	url: "/updateVariant",
	  	data: form_data,
	  	success: function(data) {
			if (data.success){
				this.props.getProductInformation()
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

	render() {
		if (!this.state.variant) return <div/>

		var variant = this.state.variant
		var text_inputs = form_fields.map((field, index) =>
			<AdminTextInput onTextInputChange = {this.onTextInputChange.bind(this)}
				field = {field}
				value = {this.state.variant[field]} 
				label = {form_labels[index]}/>
		)

		return (
			<div>
				<div className = "panel panel-default">
					<div className = "panel-body">
						{text_inputs}
					</div>
					<div className = "panel-footer">
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

							
							<button style = {{"margin-left" : "12px"}} 
							className = "btn-sm btn btn-default"
								 onClick = {this.updateVariant.bind(this, variant)}>
								 Update
							</button>

							<button style = {{"margin-left" : "12px"}} 
							className = "btn-sm btn btn-default"
								 onClick = {this.deleteVariant.bind(this, variant)}>
								 Hard Delete
							</button>
					</div>
				</div>
			</div>
		);
	}
}