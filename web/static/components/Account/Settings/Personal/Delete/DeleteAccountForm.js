var React = require('react')
var ReactDOM = require('react-dom')
var browserHistory = require('react-router').browserHistory
import AppActions from '../../../../../actions/AppActions.js'
import AppStore from '../../../../../stores/AppStore.js'
import SettingsInput from '../../../../Input/SettingsInput.js'
const form_labels = ['Password', 'Confirm Password']
const form_inputs = ['password', 'password_confirm']
const input_types = ['password', 'password']
import {AlertMessages} from '../../../../Misc/AlertMessages'
import FadingText from '../../../../Misc/FadingText'
export default class DeleteAccountForm extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			password: '',
			password_confirm : '',
			fading_text : '',
			show_fading_text : false,
			is_success : false,
		}
	}
	setFadingText(fading_text, is_success) {
		this.setState({
			fading_text : fading_text,
			show_fading_text : true,
			is_success : is_success
		})
	}

	// handle the text input changes
	onTextInputChange(event){
		var obj = {}
		obj[event.target.name] = event.target.value
		this.setState(obj)
	}

	
	handleDeleteClick(event){
		event.preventDefault()
		this.deleteAccount.bind(this)()
	}

	deleteAccount(){
		var form_data = JSON.stringify({
			'password' : this.state.password,
			'password_confirm' : this.state.password_confirm,
			'jwt' : localStorage.jwt
		})
		$.ajax({
			type: 'POST',
			url: '/softDeleteAccount',
			data: form_data,
			success: function(data) {
				if (!data.success) {
					this.setFadingText(data.error.title, false)
				}
				else {
					AppActions.removeCurrentUser()
					setTimeout(function() {
						window.location = '/'
					}, 2000)

					this.setFadingText(AlertMessages.ACCOUNT_DELETE_SUCCESS.text, true)

				}
			}.bind(this),
			error : function(){
				ga('send', 'event', {
					eventCategory: ' server-error',
					eventAction: 'softDeleteAccount',
					eventLabel: AppStore.getCurrentUser().email
				})
			},
			dataType: 'json',
			contentType : 'application/json; charset=utf-8'
		})
	}

	


	render() {
		var user = AppStore.getCurrentUser()
		if (!user.fb_id) {
			var text_inputs = form_inputs.map((form_input, index) => {
				return (<SettingsInput onChange = {this.onTextInputChange.bind(this)}
					value = {this.state[form_input]} field = {form_input} label = {form_labels[index]}
					input_type = {input_types[index]}
					name = {form_input}
					label_col_size = "3" />)
			})
		}

		return (
			<form onSubmit = {this.handleDeleteClick.bind(this)} className = "form-horizontal">
					
				{text_inputs}
					
				<div className = "form-group row">
					<button className = "btn btn-default delete-account-button" 
						onClick = {this.handleDeleteClick.bind(this)}>
							Delete Account
					</button>
				</div>
				<div className = "row">
					<FadingText show = {this.state.show_fading_text} height_transition = {true}>
						<span className = {this.state.is_success ? 'alert-success-text' : 'alert-error-text'}>{this.state.fading_text}</span>
					</FadingText>
				</div>

			</form>
		)
	}
}

