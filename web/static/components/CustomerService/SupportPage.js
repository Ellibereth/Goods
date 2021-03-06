var React = require('react');
var ReactDOM = require('react-dom');

var browserHistory = require('react-router').browserHistory
import PageContainer from '../Misc/PageContainer'
import AppStore from '../../stores/AppStore'


const PURCHASE_CATEGORY = "A Purchase"
const SITE_CATEGORY = "Your Site"
const ACCOUNT_CATEGORY = "My Account"
const OTHER_CATEGORY = 'Something Else'
const categories = ['', PURCHASE_CATEGORY, SITE_CATEGORY, ACCOUNT_CATEGORY, OTHER_CATEGORY]
import {AlertMessages} from '../Misc/AlertMessages'

export default class SupportPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			feedback_content: "",
			email : "",
			name: "",
			category: categories[0],
			order_id : ""
		}
		this.onChange = this.onChange.bind(this)
		this.sendFeedback = this.sendFeedback.bind(this)
	}

	componentDidMount(){	
		var current_user = AppStore.getCurrentUser()
		if (current_user){
			this.setState({
				name : current_user.name,
				email : current_user.email
			})
		}
	}


	onChange(event){
		var obj = this.state
		obj[event.target.name] = event.target.value
		this.setState(obj)
	}

	sendFeedback(event){
		event.preventDefault()
		var form_data = JSON.stringify({
			feedback_content : this.state.feedback_content,
			email : this.state.email,
			name : this.state.name,
			category : this.state.category,
			order_id : this.state.order_id
		})
		$.ajax({
			type: "POST",
			data: form_data,
			url: "/addFeedback",
			success: function(data) {
				if (data.success) {
					swal(AlertMessages.SUCCESFUL_FEEDBACK_COMPLETION,
						function (isConfirm) {
							if (isConfirm) {
								window.location = '/'
							}
						})
				}
				else {
					swal({
						title : data.error.title, 
						text : data.error.text,
						type:  data.error.type,
						confirmButtonColor: "#DD6B55",
						confirmButtonText: "Ok",
						closeOnConfirm: true
					})
				}
			}.bind(this),
			dataType: "json",
			contentType : "application/json; charset=utf-8"
		})
	}




	render() {

		var select_options = categories.map((category, index)=>
				<option value = {category} index = {index}> {category} </option>
			)

		return (
				<PageContainer>
					<div className = "container">
				<div className = "row">
					<div className = "col-sm-6 col-md-6 col-lg-6 col-md-offset-3 col-lg-offset-3 col-sm-offset-3">
						<div className = "panel panel-default ">
							<div className = "panel-body support-panel-body" >
								<div className = "top-buffer"/>
								<div className = "row">
									 <form onSubmit = {this.sendFeedback.bind(this)} className="form-inline">
										<div className = "form-group" style = {{"padding-right" : "6px"}}>
											<p className = "form-control-static"> {"Topic: "} </p>
										</div>
										<div className = "form-group">
											<select className = "form-control" 
											 onChange = {this.onChange} name = "category">
											 	{select_options}
											 </select>
										</div>
									</form>
								</div>
								<div className = "top-buffer"/>

								{
									this.state.category == PURCHASE_CATEGORY &&
									<div>
										<div className = "row">
											<form className="form-inline">
												<div className = "form-group" style = {{"padding-right" : "6px"}}>
													<p className = "form-control-static"> {"Order Id: "} </p>
												</div>
													<div className = "form-group">
														<input type="text" className = "form-control" 
														 onChange = {this.onChange} name = "order_id" value = {this.state.order_id} />
													</div>
											</form>
										</div>
									</div>
								}

								<div className = "top-buffer"/>

								<div className = "row">
									Message
								</div>

								<div className = "small-buffer"/>

								<div className = "row">
									<div className = "form-group">
										<textarea className="form-control textarea-resize-vertical"
										 rows="8" onChange = {this.onChange} name = "feedback_content"/> 
									</div>
								</div>

								{!AppStore.getCurrentUser()&&
									<div className = "row">
										<form onSubmit = {(event) =>  event.preventDefault()} className="form-inline">
												<div className = "form-group" style = {{"padding-right" : "6px"}}>
													<p className = "form-control-static"> {"Email: "} </p>
												</div>
												<div className = "form-group">
													<input
													style = {{'width' : '300px'}}
													 type="text" className = "form-control" 
													 onChange = {this.onChange} name = "email" value = {this.state.email} />
												</div>
										</form>
									</div>
								}
								<div className = "top-buffer"/>

								{!AppStore.getCurrentUser() && 
									<div className = "row">
										<form className="form-inline">
												<div className = "form-group" style = {{"padding-right" : "6px"}}>
													<p className = "form-control-static"> {"Name: "} </p>
												</div>
												<div className = "form-group">
													<input
													style = {{'width' : '300px'}}
													 type="text" className = "form-control" 
													 onChange = {this.onChange} name = "name" value = {this.state.name} />
												</div>
										</form>
									</div>
								}
								
								<div className = "top-buffer"/>

								<div className = "row">
									<button onClick = {this.sendFeedback} type = "button" className = "btn send-feedback-button">
										Send
									</button>
								</div>
								<div className = "small-buffer"/>
							</div>
						</div>
					</div>
				</div>
			</div>
			</PageContainer>
		);
	}
}