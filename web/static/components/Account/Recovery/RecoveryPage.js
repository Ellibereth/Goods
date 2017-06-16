
var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../stores/AppStore.js';
var browserHistory = require('react-router').browserHistory;
import TextInput from '../../Input/TextInput'
import PageContainer from '../../Misc/PageContainer'
import AccountInput from '../../Input/AccountInput'
import Spinner from '../../Misc/Spinner'
import AlertMessages from '../../Misc/AlertMessages'

const form_labels = ["Email"]
const form_inputs = ["email"]
const input_types = ['text']

// you type email here
export default class RecoveryPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email : "",
			disabled : false,
			is_loading : false

		}
	}

	componentDidMount(){
		if (AppStore.getCurrentUser()){
			window.location = '/'
		}
	}

	// handle the text input changes
	onTextInputChange(event) {
		var obj = {}
		obj[event.target.name] = event.target.value
		this.setState(obj)
	}


	onSubmitEmail(event){
		event.preventDefault()
		if (!this.state.disabled){
			this.setState({disabled: true, is_loading : true})
			var form_data = JSON.stringify({
				email : this.state.email
			})
			$.ajax({
				type: "POST",
				url: "/setRecoveryPin",
				data: form_data,
				success: function(data) {
					swal(AlertMessages.RECOVERY_PIN_SENT(this.state.email))
					setTimeout( function () {
						window.location = '/'
					}, 2000)
					this.setState({disabled: false, is_loading : false})
				}.bind(this),
				error : function(){
					ga('send', 'event', {
						eventCategory: ' server-error',
						eventAction: 'setRecoveryPin'
					});
				},
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});
		}
	}

	onKeyPress(e){
		if (e.key == "Enter"){
			this.onSubmitEmail.bind(this)(e)
		}
	}

	render() {
		var text_inputs = form_inputs.map((form_input, index) => {
			return (
					<AccountInput 
						index = {index}
						tabindex = {index}
						onKeyPress = {this.onKeyPress.bind(this)}
						field = {form_input}
						name = {form_input}
						type = {input_types[index]}
						onChange = {this.onTextInputChange.bind(this)}
						value = {this.state[form_input]} 
						label = {form_labels[index]}
					/>
				)
		})

		

		return (
			<PageContainer component = {
				<div className = "container">
					{this.state.is_loading && <Spinner />}
						<div className = "container">
							<div className = "col-md-offset-3 col-lg-offset-3 col-md-6 col-lg-6">
								<div className = "panel panel-primary account-panel">

									<div className = "panel-body account-panel-body">
										<h2 className = "account-header"> Recover Account </h2>
										<form className = "form-horizontal" onSubmit = {this.onSubmitEmail.bind(this)} >
											{text_inputs}
											<div className = "form-group row">
												<div className = "col-sm-12 col-md-12 col-lg-12">
													<button className = "btn btn-default" disabled = {this.state.disabled}
													 className = "account-button" onClick = {this.onSubmitEmail.bind(this)}>
														Recover Account
													</button>
												</div>
											</div>
										</form>
									</div>
								</div>
							</div>
						</div>
				</div>
			}/>
		)
	}
}



