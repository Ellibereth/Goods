var React = require('react');
var ReactDOM = require('react-dom');

const form_inputs = ['name', 'description', 'manufacturer', 'price', 'category', 'inventory', 'sale_end_date']
const form_labels = ["Product Name", "Product Description", "Manufacturer", "Price", "Category", "Inventory", "Sale End Date"]
const input_types = ['text', 'textarea', 'text', 'text', 'text', 'text', 'datetime-local']
import TextInput from '../../../Input/TextInput.js'
import TagsInput from 'react-tagsinput'

export default class AddProductForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			email: "",
			phone_number : "",
			price_range: "",
			product_description : "",
			brand : "",
			price : "",
			category : "",
			inventory : "",
			has_variants : false,
			tags : [],
			variants : []
		}
	}

	// handle the text input changes
	onInputChange(field, value){
		var obj = {}
		obj[field] = value
		this.setState(obj)
	}

	onVariantChange(event){
		this.setState({
			has_variants : !this.state.has_variants
		})
	}

	handleTagsChange(tags) {
    	this.setState({tags})
 	}

 	handleVariantsChange(variants) {
    	this.setState({variants})
 	}


	onSubmitPress(){
		swal({
		  title: "Confirm",
		  text: "Do you really want to show this product on the market?",
		  showCancelButton: true,
		  confirmButtonColor: "#DD6B55",
		  confirmButtonText: "Yes",
		  cancelButtonText: "No",
		  closeOnConfirm: true,
		  closeOnCancel: true
		},
		function () {
			this.submitData.bind(this)()
		}.bind(this))
	}

	submitData(){
			var data = {}
			var market_product = {}
			for (var i = 0; i < form_inputs.length; i++){
				market_product[form_inputs[i]] = this.state[form_inputs[i]]
			}

			var form_data = JSON.stringify({
				market_product : market_product,
				tags : this.state.tags,
				variant_types : this.state.variants,
				has_variants : this.state.has_variants,
				jwt  : localStorage.jwt
			})
			$.ajax({
				type: "POST",
				url: "/addMarketProduct",
				data: form_data,
				success: function(data) {
					if (!data.success) {
						console.log(data.error)
						swal("Sorry!", "Something went wrong! \n Error : " + data.error, "warning")
					}
					else {
						this.props.toggleAddProductModal()
						swal("Nice man!", "You just added this product to the market"
							, "success")
					}
					this.props.loadProducts()
				}.bind(this),
				error : function(){
					console.log("error")
				},
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});
	}	

	render() {
		var text_inputs = form_inputs.map((form_input, index) => {

			return (<TextInput onTextInputChange = {this.onInputChange.bind(this)}
				value = {this.state[form_input]} field = {form_input} label = {form_labels[index]}
				input_type = {input_types[index]}/>
			)
		})

		var tag_input = (
						<div className="form-group">
							<div className="col-sm-10">
								Tags
							</div>
							<div className ="col-sm-10">
								<TagsInput 
								 value={this.state.tags} onChange={this.handleTagsChange.bind(this)}/>
							</div>
						</div>
			)

		var has_variants_input = (

				<div className="form-group">
					<div className ="col-sm-10">
						<div className = "checkbox"> 
						 	<label>
						 		<input type= "checkbox" name = "has_variants" value={this.state.has_variants} onChange={this.onVariantChange.bind(this)}/>
						 		Will this product have variants (colors, sizes, etc?)
						 	</label>
						</div>
					</div>
				</div>

				)


		var variants_input = (
						<div className="form-group">
							<div className="col-sm-10">
								Variants
							</div>
							<div className ="col-sm-10">
								<TagsInput 
								 value={this.state.variants} onChange={this.handleVariantsChange.bind(this)}/>
							</div>
						</div>
					)
		

		return (
			<form className = "form-horizontal">
				{text_inputs}
				{tag_input}

				{has_variants_input}

				{ this.state.has_variants &&
					<div>
						{variants_input}
					</div>
				}

				

				<div className = "form-group">

				<div className = "col-md-10 col-sm-10">
					<button type = "button" className = "btn btn-default" onClick = {this.onSubmitPress.bind(this)}>
					Submit!
					</button>
				</div>
				</div>
			</form>
		)
	}
}

