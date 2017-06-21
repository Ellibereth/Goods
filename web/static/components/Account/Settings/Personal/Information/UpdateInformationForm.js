var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;
import AppActions from '../../../../../actions/AppActions.js';
import AppStore from '../../../../../stores/AppStore.js';
import SettingsInput from '../../../../Input/SettingsInput.js'
import {AlertMessages} from '../../../../Misc/AlertMessages'

const form_labels = ['Name', "Email"]
const form_inputs = ["name", "email"]
const input_types = ['text', 'text']



export default class UpdateInformationForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			email: "",
		}
	}

	// handle the text input changes
	onTextInputChange(field, value){
		var obj = {}
		obj[field] = value
		this.setState(obj)
	}

	componentDidMount(){
		var current_user = AppStore.getCurrentUser()
		this.setState({name : current_user.name})
		this.setState({email : current_user.email})
	}

	updateSettings(event){
		event.preventDefault()
			var new_settings = {}
			for (var i = 0; i < form_inputs.length; i++){
				var key = form_inputs[i]
				new_settings[key] = this.state[key]
			}

			var form_data = JSON.stringify({
				"new_settings" : new_settings,
				"jwt" : localStorage.jwt
			})
			$.ajax({
				type: "POST",
				url: "/updateSettings",
				data: form_data,
				success: function(data) {
					if (!data.success) {
						swal(data.error.title, data.error.text , data.error.type)
					}
					else {
						this.setState({
							name : data.user.name,
							email : data.user.email,
						})
						this.props.setEditableIndex()
						this.props.getUserInfo()
						swal(AlertMessages.CHANGE_WAS_SUCCESSFUL)
					}
				}.bind(this),
				error : function(){
					ga('send', 'event', {
						eventCategory: ' server-error',
						eventAction: 'updateSettings',
						eventLabel: AppStore.getCurrentUser().email
					});
				},
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});
		}
	

	render() {
		var text_inputs = form_inputs.map((form_input, index) => {
			return (<SettingsInput  
				tabindex = {index}
				onChange = {this.onTextInputChange.bind(this)}
				value = {this.state[form_input]} field = {form_input} 
				label = {form_labels[index]}
				input_type = {input_types[index]}
				label_col_size = "1"/>
			)
		})

		return (
			
				<form onSubmit = {this.updateSettings.bind(this)} className = "form-horizontal" >
					<br/>
					{text_inputs}
					

					<div className = "form-group">
						
							<div className = "col-sm-4 col-md-4 col-lg-4">
								<button className = "btn btn-default" onClick = {this.updateSettings.bind(this)}>
									Save
								</button>
							</div>
					</div>
					

				</form>
		)
	}
}

