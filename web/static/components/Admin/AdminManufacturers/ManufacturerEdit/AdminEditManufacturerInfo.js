var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory
import AdminTextInput from '../../../Input/AdminTextInput.js'
const form_fields = ['name', 'description', 'notes', 'fee']
const form_labels = ['Name', 'Description', 'Notes', 'Fee (note this is a percentage in integers ex. 500 => 5%']
const input_types = ['text', 'textarea', 'textarea', 'text']

import {AlertMessages} from '../../../Misc/AlertMessages'
export default class AdminEditManufacturerInfo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			manufacturer : {}
		}
	}

	warningAlertToggleVariants(callback){
		swal(AlertMessages.LIVE_CHANGES_WILL_BE_MADE,
		function () {
			callback()
		}.bind(this))
	}

	// handle the text input changes
	onTextInputChange(field, value){
		var obj = this.state.manufacturer
		obj[field] = value
		this.setState({manufacturer: obj})
	}

	componentDidMount(){
		this.setState({manufacturer : this.props.manufacturer})	
	}

	componentWillReceiveProps(nextProps){
		this.setState({manufacturer : nextProps.manufacturer})
	}

	onTextSubmitPress() {
		swal(AlertMessages.LIVE_CHANGES_WILL_BE_MADE,
			function () {
				this.submitTextData.bind(this)()
		}.bind(this))
	}

	
	submitTextData(){
		var form_data = JSON.stringify({
			"manufacturer_id" : this.state.manufacturer.manufacturer_id,
			"manufacturer" : this.state.manufacturer,
			"jwt" : localStorage.jwt
		})
		$.ajax({
		type: "POST",
	  	url: "/updateManufacturerInfo",
	  	data: form_data,
	  	success: function(data) {
			if (data.success){
				this.setState({manufacturer : data.manufacturer})
				swal(AlertMessages.CHANGE_WAS_SUCCESSFUL)
				this.props.getManufacturerInformation()
			}
			else {
				swal({title: data.error, type: "error"})
			}
			
	  	}.bind(this),
	  	error : function(){
	  	},
	  		dataType: "json",
	  		contentType : "application/json; charset=utf-8"
		});
	}

	
	
	render() {	
		if (!this.state.manufacturer) return <div/>;


		var input_forms = form_fields.map((field, index) => 
				<AdminTextInput onTextInputChange = {this.onTextInputChange.bind(this)}
				value = {this.state.manufacturer[field]} field = {field} label = {form_labels[index]}
				input_type = {input_types[index]}/>
			)

		return (
			<div className = "container" id = "admin_edit_product">
				<div className = "row" id = "text_edit">
					<form className ="form-horizonal">
						{input_forms}
						<div className = "form-group">

							<div className = "col-md-4 col-lg-4">
								<button  type = "button" className = "btn btn-default" 
								onClick = {this.onTextSubmitPress.bind(this)}>
									Submit
								</button>
							</div>
						</div>
					</form>
				</div>


				<hr/>


			</div>
		)
	}
}