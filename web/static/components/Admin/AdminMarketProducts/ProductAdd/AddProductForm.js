var React = require('react');
var ReactDOM = require('react-dom');

const form_inputs = ['name', 'description', 'manufacturer', 'price', 'category', 'inventory', 'sale_end_date']
const form_labels = ["Product Name", "Product Description", "Manufacturer", "Price", "Category", "Inventory", "Sale End Date"]
const input_types = ['text', 'textarea', 'text', 'text', 'text', 'text', 'datetime-local']
import {Form, Col, FormGroup, Button} from 'react-bootstrap'
import TextInput from '../../../Misc/Input/TextInput.js'
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
			tags : []
		}
	}

	// handle the text input changes
	onInputChange(field, value){
		var obj = {}
		obj[field] = value
		this.setState(obj)
	}

	handleTagsChange(tags) {
    	this.setState({tags})
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
				jwt  : localStorage.jwt
			})
			$.ajax({
				type: "POST",
				url: "/addMarketProduct",
				data: form_data,
				success: function(data) {
					if (!data.success) {
						swal("Sorry!", "Something went wrong! \n Error : " + data.error, "warning")
					}
					else {
						this.props.toggleAddProductModal()
						swal("Nice man!", "You just added this product to the market"
							, "success")
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
		
		return (
			<Form horizontal>
				{text_inputs}
				{tag_input}
				<FormGroup controlId = "submit_buton">
				<Col smOffset={0} sm={10}>
					<Button onClick = {this.onSubmitPress.bind(this)}>
					Submit!
					</Button>
				</Col>
				</FormGroup>
			</Form>
		)
	}
}

