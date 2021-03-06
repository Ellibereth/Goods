var React = require('react');
var ReactDOM = require('react-dom');

const form_inputs = ['name', 'description', 'manufacturer', 'price', 'category', 'inventory', 'sale_end_date']
const form_labels = ["Product Name", "Product Description", "Manufacturer", "Price", "Category", "Inventory", "Sale End Date"]
const input_types = ['text', 'textarea', 'text', 'text', 'text', 'text', 'datetime-local']
import TextInput from '../../../Input/TextInput.js'
import TagsInput from 'react-tagsinput'
import {AlertMessages} from '../../../Misc/AlertMessages'

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
		swal(AlertMessages.LIVE_CHANGES_WILL_BE_MADE,
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
						swal(data.error.title, data.error.text , data.error.type)
					}
					else {
						this.props.toggleAddProductModal()
						swal(AlertMessages.CHANGE_WAS_SUCCESSFUL)
					}
					this.props.loadProducts()
				}.bind(this),
				error : function(){
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

