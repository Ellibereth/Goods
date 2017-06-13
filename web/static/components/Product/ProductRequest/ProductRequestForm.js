var React = require('react');
var ReactDOM = require('react-dom');

import TextInput from '../../Input/TextInput.js'


const form_labels = ['What is your name?', "What is your email?", "Phone Number? (Optional)", "How much would you like to pay?", "What are you looking for?"]
const form_inputs = ["name", "email", "phone_number", "price_range", "description"]


export default class ProductRequestForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			email: "",
			phone_number : "",
			price_range: "",
			description : "",
		}
	}

	// handle the text input changes
	onTextInputChange(field, value){
		var obj = {}
		obj[field] = value
		this.setState(obj)
	}

	onSubmitPress(){
		swal({
		  title: "Confirm",
		  text: "Is your request ready to submit?",
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
			for (var i = 0; i < form_inputs.length; i++){
				var key = form_inputs[i]
				data[key] = this.state[key]
			}
			var form_data = JSON.stringify(data)
			$.ajax({
				type: "POST",
				url: "/addProductRequest",
				data: form_data,
				success: function(data) {
					if (!data.success) {
						swal("Sorry!", "It seems the email you submitted was invalid", "warning")
					}
					else {
						this.props.toggleRequestFormModal()
						swal("Thank you!", "You will receive a confirmation email regarding your product request. You might have to check your spam folder"
							, "success")
					}
				}.bind(this),
				error : function(){
					ga('send', 'event', {
						eventCategory: ' server-error',
						eventAction: 'addProductRequest',
						eventLabel: AppStore.getCurrentUser().email
					});
				},
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});
	}	

	render() {
		var text_inputs = form_inputs.map((form_input, index) => {
			var input_type = form_input == "product_description" ? "textarea" : "text"
			return (<TextInput onTextInputChange = {this.onTextInputChange.bind(this)}
				value = {this.state[form_input]} field = {form_input} label = {form_labels[index]}
				input_type = {input_type}/>
			)
		})

		return (
			<form className = "form-horizonal">
				{text_inputs}
				<div className = "form-group">
					<div className = "col-sm-10">
						<button className = "btn btn-default" onClick = {this.onSubmitPress.bind(this)}>
						Submit!
						</button>
					</div>
				</div>
			</form>
		)
	}
}

