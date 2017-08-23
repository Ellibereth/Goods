var React = require('react');
var ReactDOM = require('react-dom');

const form_inputs = ['name']
const form_labels = ["Manufacturer Name"]
const input_types = ['text']
import TextInput from '../../../Input/TextInput.js'
import TagsInput from 'react-tagsinput'
var browserHistory = require('react-router').browserHistory
import {AlertMessages} from '../../../Misc/AlertMessages'

export default class AddManufacturerForm extends React.Component {
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



	submitData(){
			var data = {}
			var manufacturer = {}
			for (var i = 0; i < form_inputs.length; i++){
				manufacturer[form_inputs[i]] = this.state[form_inputs[i]]
			}

			var form_data = JSON.stringify({
				manufacturer : manufacturer,
				jwt  : localStorage.jwt
			})
			$.ajax({
				type: "POST",
				url: "/addManufacturer",
				data: form_data,
				success: function(data) {
					if (!data.success) {
						swal(data.error.title, data.error.text , data.error.type)
					}
					else {
						swal(AlertMessages.CHANGE_WAS_SUCCESSFUL)
						this.setState({name : ""})
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
				<h2> Click to add a blank manufacturer </h2>

				<hr/>
				{text_inputs}

				<div className = "form-group">

				<div className = "col-sm-10">
					<button type = "button" className = "btn btn-default" onClick = {this.submitData.bind(this)}>
					Submit!
					</button>
				</div>
				</div>
			</form>
		)
	}
}

