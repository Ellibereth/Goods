var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;
import AppActions from '../../../../actions/AppActions.js';
import AppStore from '../../../../stores/AppStore.js';
import TextInput from '../../../Input/TextInput.js'
const form_labels = ['Password', 'Confirm Password']
const form_inputs = ["password", "password_confirm"]
const input_types = ['password', 'password']

export default class DeleteAccountForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			password: "",
			password_confirm : "",
		}
	}

	// handle the text input changes
	onTextInputChange(field, value){
		var obj = {}
		obj[field] = value
		this.setState(obj)
	}

	
	handleDeleteClick(){
		swal({
		  title: "You sure?",
		  text: "It will be very difficult to undo this if you change your mind later?",
		  type : "warning",
		  showCancelButton: true,
		  confirmButtonColor: "#DD6B55",
		  confirmButtonText: "Yes",
		  cancelButtonText: "No!",
		  closeOnConfirm: false,
		  closeOnCancel: true
		},
		function () {
			this.deleteAccount.bind(this)()
		}.bind(this))
	}

	deleteAccount(){
		var form_data = JSON.stringify({
				"password" : this.state.password,
				"password_confirm" : this.state.password_confirm,
				"jwt" : localStorage.jwt
			})
			$.ajax({
				type: "POST",
				url: "/softDeleteAccount",
				data: form_data,
				success: function(data) {
					if (!data.success) {
						swal("Sorry!", "It seems there was an error! " + data.error 
							+ ". Please try again!", "warning")
					}
					else {
						AppActions.removeCurrentUser()
						setTimeout(function() {
							window.location = `/`
						}, 2000)

						swal({
						  title: "Thank you!",
						  text: "Your account has been deleted! You will be redirected to home page shortly...",
						  type: "success",
						  confirmButtonText: "Ok!",
						  closeOnConfirm: true,
						})

					}
				}.bind(this),
				error : function(){
					ga('send', 'event', {
						eventCategory: ' server-error',
						eventAction: 'softDeleteAccount',
						eventLabel: AppStore.getCurrentUser().email
					});
				},
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});
	}

	


	render() {
		var text_inputs = form_inputs.map((form_input, index) => {
			return (<TextInput colSize = {"8"} onTextInputChange = {this.onTextInputChange.bind(this)}
				value = {this.state[form_input]} field = {form_input} label = {form_labels[index]}
				input_type = {input_types[index]} required = {true}/>)
		})

		return (
				<form className = "form-horizontal">
					<label className = "control-label"> <span id = "settings-header"> Delete Account </span> </label>
					<br/>
					{text_inputs}
					
					<div className = "form-group">
						
							<div className = "col-sm-4 col-md-4 col-lg-4">
								<button className = "btn btn-default delete-account-button">
								onClick = {this.handleDeleteClick.bind(this)}>
									Delete Account
								</button>
							</div>
							<div className = "col-sm-4 col-md-4 col-lg-4 pull-right text-right" >
								<button className = "btn btn-default" onClick = {() => window.location = '/settings'}>
									Return to settings
								</button>
							</div>
					</div>
					

				</form>
		)
	}
}

