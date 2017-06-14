var React = require('react');
var ReactDOM = require('react-dom');
import TextInput from '../../Input/TextInput.js'
const form_labels = ['What is your name?', "What is your email?", "What should we know?"]
const form_inputs = ["name", "email", "feedback_content"]


export default class ProductRequestForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			email: "",
			feedback_content: ""
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
		  title: "Ready?",
		  text: "Are you sure you want to submit?",
		  showCancelButton: true,
		  confirmButtonColor: "#DD6B55",
		  confirmButtonText: "Yes",
		  cancelButtonText: "No!",
		  closeOnConfirm: false,
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
				url: "/addFeedback",
				data: form_data,
				success: function(data) {
					if (!data.success) {
						swal("Sorry!", "It seems there was an error in your submission! Please try again!", "warning")
					}
					else {
						this.props.toggleFeedbackModal()
						swal("Thank you!", "Your feedback has been received", "success")
					}

				}.bind(this),
				error : function(){
					ga('send', 'event', {
						eventCategory: ' server-error',
						eventAction: 'addFeedback',
					});
				},
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});
		}

	render() {
		var text_inputs = form_inputs.map((form_input, index) => {
			var input_type = (form_input == "feedback") ? "textarea" : "text"
			return (<TextInput onTextInputChange = {this.onTextInputChange.bind(this)}
				value = {this.state[form_input]} field = {form_input} label = {form_labels[index]}
				input_type = {input_type}/>)
		})

		return (
			<form onSubmit = {(event) =>  event.preventDefault()} className = "form-horizontal">
				{text_inputs}
				<div className = "form-group">
				<div className = "col-sm-10">
					<button type = "button" className = "btn btn-defauly" onClick = {this.onSubmitPress.bind(this)}>
					Submit!
					</button>
				</div>
				</div>
			</form>
		)
	}
}

