var React = require('react');
var ReactDOM = require('react-dom');

const form_inputs = ['name']
const form_labels = ["Product Name"]
const input_types = ['text']
import TextInput from '../../../Input/TextInput.js'
import TagsInput from 'react-tagsinput'
var browserHistory = require('react-router').browserHistory
import {AlertMessages} from '../../../Misc/AlertMessages'

export default class AddProductForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
		}
	}

	// handle the text input changes
	onInputChange(field, value){
		var obj = {}
		obj[field] = value
		this.setState(obj)
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
						swal(AlertMessages.CHANGE_WAS_SUCCESFUL)
						setTimeout(function () {
							window.location = '/yevgeniypoker555/editProduct/' + data.product.product_id
						}, 2000)
					}
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

		
		

		return (
			<form className = "form-horizontal">
				<h2> Click to add a blank product </h2>

				<hr/>
				{text_inputs}

				<div className = "form-group">

				<div className = "col-sm-10">
					<button type = "button" className = "btn btn-default" onClick = {this.onSubmitPress.bind(this)}>
					Submit!
					</button>
				</div>
				</div>
			</form>
		)
	}
}

