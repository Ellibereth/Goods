var React = require('react');
var ReactDOM = require('react-dom');

var browserHistory = require('react-router').browserHistory
import {} from 'react-bootstrap';
import PageContainer from '../Misc/PageContainer'

export default class SupportPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			feedback_content: "",
			email : "",
			name: ""
		}
		this.onChange = this.onChange.bind(this)
		this.sendFeedback = this.sendFeedback.bind(this)
	}

	componentDidMount(){	

	}

	onChange(event){
		var obj = this.state
		obj[event.target.name] = event.target.value
		this.setState(obj)
	}

	sendFeedback(){
		var form_data = JSON.stringify({
			feedback_content : this.state.feedback_content,
			email : this.state.email,
			name : this.state.name
		})
		$.ajax({
			type: "POST",
			data: form_data,
			url: "/addFeedback",
			success: function(data) {
				if (data.success) {
					swal("Your feedback is appreaciated", "Redirecting you to the homepage shorlty", "success")
					setTimeout(function (){
						browserHistory.push('/')
					}, 2000)

				}
				else {
					swal("nice try, but something went wrong...")
				}
			}.bind(this),
			dataType: "json",
			contentType : "application/json; charset=utf-8"
		})
	}




	render() {
		var component = (
			<div className = "container">
				<div className = "row">
					<div className = "col-sm-6 col-md-6 col-lg-6 col-md-offset-3 col-lg-offset-3 col-sm-offset-3">
						<div className = "panel panel-default ">
							<div className = "panel-body support-panel-body" >
								<div className = "row">
									 <h2> <b> Dear Edgar, </b> </h2> 
								</div>
								<div className = "row">
									I'm writing to you about 
								</div>

								<div className = "row">
									<div className = "form-group">
										<textarea className="form-control textarea-resize-vertical"
										 rows="8" onChange = {this.onChange} name = "feedback_content"/> 
									</div>
								</div>

								<div className = "row">
									<form className="form-inline">
										<div className = "form-group" style = {{"padding-right" : "6px"}}>
											<p className = "form-control-static"> {"You can write back to me at"} </p>
										</div>
											<div className = "form-group">
												<input type="text" className = "form-control" placeholder = "email"
												 onChange = {this.onChange} name = "email" />
											</div>
									</form>
								</div>
								<div className = "top-buffer"/>
								<div className = "row">
									<div className = "form-group">
										<label> Sincerely, </label>
										<input name = "name" type="text" onChange = {this.onChange}
										className="form-control" style = {{"width" : "35%"}} placeholder = "name"/>
									</div>
								</div>

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

		)

		return (
				<PageContainer component = {component}/>
		);
	}
}