var React = require('react');
var ReactDOM = require('react-dom');

var browserHistory = require('react-router').browserHistory
import TrimmedPageContainer from '../Misc/TrimmedPageContainer'
import AppStore from '../../stores/AppStore'


// const PURCHASE_CATEGORY = "A Purchase"
// const SITE_CATEGORY = "Your Site"
// const ACCOUNT_CATEGORY = "My Account"
// const OTHER_CATEGORY = 'Something Else'
// const categories = ['', PURCHASE_CATEGORY, SITE_CATEGORY, ACCOUNT_CATEGORY, OTHER_CATEGORY]
import {AlertMessages} from '../Misc/AlertMessages'

export default class SupportPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			feedback_content: "",
			email : "",
			name: "",
			category: "",
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
					$("#success_text").addClass("email-success")
					$("#success_text").removeClass("email-success-hidden")

					this.setState({
						success_text : "Your feedback has been received", 
						feedback_content : "",
						email : ""
					})
				}
				else {
					$("#success_text").addClass("email-success")
					$("#success_text").removeClass("email-success-hidden")
					this.setState({success_text : "Something didn't work...perhaps your input was blank"})
					setTimeout(function(){ 
						// this.setState({result_text : ""})
						$("#success_text").addClass("email-success-hidden")
						$("#success_text").removeClass("email-success")	
					}.bind(this), 5000)
				}
			}.bind(this),
			dataType: "json",
			contentType : "application/json; charset=utf-8"
		})
	}

// for image 2, don't break lines between questions, 
// more padding between edges of box and inside content
// , font change, use placeholder instead of "Message", 
// and the page could use a header saying "Support"


	render() {


		return (
				<TrimmedPageContainer>
					<div className = "container">
						<div className = "row">
							<div className = "col-sm-6 col-md-6 col-lg-6 col-md-offset-3 col-lg-offset-3 col-sm-offset-3">
								<div className = "panel panel-default support-panel">
									<div className = "panel-body support-panel-body" >
										<div className = "top-buffer"/>
										<div className = "row">
											<div className = "support-text">Anything you want us to carry? </div>
											<div className = "support-text">Want to work with us?</div> <br/>
											<div className = "support-text">Any other questions, comments, or suggestions?</div>
											<div className = "support-text">Let us know! We'll get back to you.</div>
										</div>
										
										<div className = "top-buffer"/>

										<div className = "top-buffer"/>

										<div className = "row">
											<span className = "support-text">Message</span>
										</div>

										<div className = "small-buffer"/>

										<div className = "row">
											<div className = "form-group">
												<textarea className="form-control textarea-resize-vertical"
												 rows="8" value = {this.state.feedback_content} onChange = {this.onChange} name = "feedback_content"/> 
											</div>
										</div>

										<div className = "top-buffer"/>

										<div className = "row">
											<form onSubmit = {(event) =>  event.preventDefault()} className="form-inline">
													<div className = "form-group" style = {{"padding-right" : "6px"}}>
														<p className = "form-control-static"> {"Email: "} </p>
													</div>
													<div className = "form-group">
														<input
														style = {{'width' : '300px', 'fontSize' : "16px"}}
														 type="text" className = "form-control" 
														 onChange = {this.onChange} name = "email" value = {this.state.email} />
													</div>
											</form>
										</div>

										
										<div className = "top-buffer"/>

										<div className = "row">
											<button onClick = {this.sendFeedback} type = "button" className = "btn send-feedback-button">
												Send
											</button>
										</div>
										<div className = "top-buffer"/>
										<div className = "row">
											<span id = "success_text" className = "email-success-hidden">{this.state.success_text}</span>
										</div>

										<div className = "small-buffer"/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</TrimmedPageContainer>
		);
	}
}