var React = require('react');
var ReactDOM = require('react-dom');
import Modal from 'react-bootstrap/lib/Modal'
import HomePage from '../Home/HomePage'

export default class LandingPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			result_text : ""
		}
	}

	onEmailChange(event) {
		this.setState({email : event.target.value})
	}
	
	onLandingClick() {
		var form_data = JSON.stringify({
			email : this.state.email
		})
		$.ajax({
			type: "POST",
			url: "/signUpForLandingList",
			data : form_data,
			success: function(data) {
				if (data.success) {
					if (this.state.result_text) {
						$("#success_text").removeClass("email-success")	
						$("#success_text").addClass("straight-hidden")	

						setTimeout(function() {
							$("#success_text").removeClass("straight-hidden")	
							$("#success_text").addClass("email-success")

						},100)
					}
					else {
						$("#success_text").addClass("email-success")
						$("#success_text").removeClass("email-success-hidden")	
					}
					
					this.setState({email : "", result_text : " Thanks for your interest! We'll let you know when we launch."})

				}
				else {
					$("#success_text").addClass("email-success")
					$("#success_text").removeClass("email-success-hidden")
					this.setState({result_text : data.error})
					setTimeout(function(){ 
						$("#success_text").addClass("email-success-hidden")
						$("#success_text").removeClass("email-success")
					}.bind(this), 5000)
				}

			}.bind(this),
			error : function(){
			},
			dataType: "json",
			contentType : "application/json; charset=utf-8"
		});
	}

	handleKeyPress(event) {
		if  (event.key == 'Enter'){
			this.onLandingClick.bind(this)()
		}
	}

	// for image 1, slightly more spacing between lines, larger, 
	// 	thinner font, black is fine, more spacing above input box
	// , 20px border radius for the left input and right corners
	//  of button, "Auguest", no periods, be consistent with capitalization


	
	render() {
		
		return (
			<div>
				<Modal show = {true}>
					<Modal.Body>
					<div className = "landing-container">
						<div className = "landing-card col-sm-12 col-md-12 col-lg-12">
						<div className = "row">
							<img className = "landing-page-logo"
							src = "https://s3-us-west-2.amazonaws.com/edgarusahomepage/landing_logo.png"/>
						</div>
						<div className = "row">
							<div className = "landing-desc">
								A Made in USA ONLY Deals Store
							</div>
						</div>
						<div className = "top-buffer"/>
						<div className = "landing-after-title-text">
							Exclusive Prices & New Selection Weekly
						</div>
						<div className = "small-buffer"/>
						<div className = "landing-after-title-text">
							Great American Vendors and Designers
						</div>
						<div className = "top-buffer"/>
						
						

				
						<div className = "row hidden-xs">
							<div className = "col-sm-10 col-md-10 col-lg-10 col-sm-offset-1 col-md-offset-1 col-lg-offset-1">
								<div className="input-group landing-subscribe-container">
									<input tabindex = {1} onKeyPress = {this.handleKeyPress.bind(this)} 
									value = {this.state.email} onChange = {this.onEmailChange.bind(this)} type="text" 
									className="form-control landing-subscribe-input" placeholder="Type your email here" />
									<div className="input-group-btn">
										<button tabindex = {2} onClick = {this.onLandingClick.bind(this)}
										type="button" className="landing-subscribe-button btn ">
											Notify Me!
										</button>
									</div>
								</div>
							</div>
						</div>

						<div className = "row hidden-sm hidden-md hidden-lg">
							<div className = " col-xs-12">
								<div className="input-group-lg landing-subscribe-container">
									<input tabindex = {1} onKeyPress = {this.handleKeyPress.bind(this)} 
									value = {this.state.email} onChange = {this.onEmailChange.bind(this)} type="text" 
									className="form-control landing-subscribe-input" placeholder="Type your email here" />
								</div>
							</div>
						</div>
						<div className = "hidden-sm hidden-md hidden-lg top-buffer"/>
						<div className = "row hidden-sm hidden-md hidden-lg">
							<div className = "col-xs-12">
								<button tabindex = {2} onClick = {this.onLandingClick.bind(this)}
								type="button" className="landing-subscribe-button btn ">
									Notify Me!
								</button>
							</div>
						</div>
						<div className = "top-buffer"/>
						<div className = "row">
							<span id = "success_text" className = "email-success-hidden">{this.state.result_text}</span>
						</div>

						<div className = "top-buffer"/>

						<div className = "row">
							<div className = "landing-after-input-text">
								Coming soon, August 2017
							</div>
						</div>
						</div>
					</div>
					</Modal.Body>
					</Modal>
				<div className="landing-floating-footer hidden-xs">
					<a className = "no-link" href="#">©Edgar USA, 2017</a>
					<a href="/support">Contact Us</a>
				</div>
				<div className = "hidden-xs">	
					<HomePage />
				</div>
			</div>
		);
	}
}