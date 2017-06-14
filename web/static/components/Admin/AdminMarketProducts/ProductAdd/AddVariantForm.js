var React = require('react');
var ReactDOM = require('react-dom');

const form_inputs = ['variant_type', 'inventory', 'price']
const form_labels = ["Variant Name", 'Inventory', 'Price']
const input_types = ['text', 'text']
import AdminTextInput from '../../../Input/AdminTextInput.js'

export default class AddVariantForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			variant_type : "",
			price : "",
			inventory : "",
		}
	}

	// handle the text input changes
	onInputChange(field, value){
		var obj = {}
		obj[field] = value
		this.setState(obj)
	}

	onAddPress(){
		swal({
		  title: "Confirm",
		  text: "Do you really want to show this variant on the market?",
		  showCancelButton: true,
		  confirmButtonColor: "#DD6B55",
		  confirmButtonText: "Yes",
		  cancelButtonText: "No",
		  closeOnConfirm: true,
		  closeOnCancel: true
		},
		function () {
			this.addVariant.bind(this)()
		}.bind(this))
	}

	addVariant(){
			var data = {}

			var form_data = JSON.stringify({
				product_id : this.props.product.product_id,
				jwt  : localStorage.jwt,
				price: this.state.price,
				variant_type : this.state.variant_type,
				inventory : this.state.inventory
			})

			$.ajax({
				type: "POST",
				url: "/addProductVariant",
				data: form_data,
				success: function(data) {
					if (!data.success) {
						swal("Sorry!", "Something went wrong! \n Error : " + data.error, "warning")
					}
					else {
						swal("Nice man!", "You just added this product variant to the market"
							, "success")
						this.setState({
							price : "",
							inventory : "",
							variant_type: ""
						})
					}

					this.props.getProductInformation()
				}.bind(this),
				error : function(){
				},
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});
	}	

	render() {
		var text_inputs = form_inputs.map((form_input, index) => {

			return (<AdminTextInput onTextInputChange = {this.onInputChange.bind(this)}
				value = {this.state[form_input]} field = {form_input} label = {form_labels[index]}
				input_type = {input_types[index]}/>
			)
		})

		return (
			<div className = "panel panel-default">
				<div className = 'panel-heading'>
					Add a variant here
				</div>
				<div className = "panel-body">
					{text_inputs}
				</div>
				<div className = "panel-footer">
					
							<button className = "btn btn-default"
							 onClick = {this.onAddPress.bind(this)}>
								Add Variant
							</button>
				</div>
			</div>
		)
	}
}

