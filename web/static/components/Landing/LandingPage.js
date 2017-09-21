var React = require('react');
var ReactDOM = require('react-dom');
import Modal from 'react-bootstrap/lib/Modal'
import HomePage from '../Home/HomePage'

export default class LandingPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			result_text : "",
			sent_success : false
		}
	}

	onEmailChange(event) {
		this.setState({email : event.target.value})
	}
	
	onLandingClick() {
		ga('send', {
			hitType: 'event',
			eventCategory: 'Landing',
			eventAction: 'subscribe attempt',
			eventLabel: localStorage.ab_group
		});

		var form_data = JSON.stringify({
			email : this.state.email
		})
		$.ajax({
			type: "POST",
			url: "/signUpForLandingList",
			data : form_data,
			success: function(data) {
				if (data.success) {
					$("#success_text").addClass("email-success")
					$("#success_text").removeClass("email-success-hidden")

					this.setState({
						email : "", 
						result_text : " Thank you for your interest!",
						sent_success : true
					})

					ga('send', {
						hitType: 'event',
						eventCategory: 'Landing',
						eventAction: 'subscribe success',
						eventLabel: localStorage.ab_group
					});

				}
				else {
					$("#success_text").addClass("email-success")
					$("#success_text").removeClass("email-success-hidden")
					this.setState({result_text : data.error})
					setTimeout(function(){ 
						$("#success_text").addClass("email-success-hidden")
						$("#success_text").removeClass("email-success")
					}.bind(this), 5000)
					ga('send', {
						hitType: 'event',
						eventCategory: 'Landing',
						eventAction: 'subscribe failure',
						eventLabel: localStorage.ab_group + " - " + data.error
					});
				}

			}.bind(this),
			error : function(){
			},
			dataType: "json",
			contentType : "application/json; charset=utf-8"
		});
	}

	startOver() {
		this.setState({sent_success : false})
		$("#success_text").removeClass("email-success")	
		$("#success_text").addClass("email-success-hidden")

	}

	handleKeyPress(event) {
		if  (event.key == 'Enter'){
			this.onLandingClick.bind(this)()
		}
	}
	
	render() {
		var add_another_text = localStorage.ab_group == 0 ? "Click to Subscribe with Another Email" : "Click to Subscribe Another Email"
		var another_button_class = "landing-send-another-button btn " + (this.state.sent_success ? " show-another " : " hidden-another ")
		return (
			<div>
				<Modal show = {true}>
					<Modal.Body>
					<div className = "landing-container">
						<div className = "landing-card col-sm-12 col-md-12 col-lg-12">
						<div className = "row">
							<img className = "landing-page-logo"
							src = "https://s3-us-west-2.amazonaws.com/edgarusahomepage/linda5.png"/>
						</div>
						<div className = "row">
							<div className = "landing-desc">
								A Made in USA ONLY Deals Store
							</div>
						</div>
						<div style = {{"marginTop": "16px"}}/>
						<div className = "landing-after-title-text">
							Exclusive Prices & New Selection Weekly
						</div>
						<div className = "small-buffer"/>
						<div className = "landing-after-title-text">
							Great American Vendors and Designers
						</div>
					
						<div className = "hidden-sm hidden-md hidden-lg top-buffer"/>
						
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

						
						{!this.state.sent_success  &&
							<div className = "row hidden-xs">
								<div style = {{"marginTop" : "16px"}}/>
								<div className = "col-sm-8 col-md-8 col-lg-8 col-sm-offset-2 col-md-offset-2 col-lg-offset-2">
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
								<div style = {{"marginBottom" : "4px"}}/>
							</div>
						}

						<div className = "row">
							<div style = {{"marginTop" : "8px"}}/>
							<span id = "success_text" className = " email-success-hidden ">
								<span className = {this.state.sent_success ? " sent-success-text " : ""}>
									{this.state.result_text}
								</span>
							</span>
							<div style = {{"marginBottom" : "8px"}}/>
						</div>

						<div>
							<div className = "row hidden-xs">
								<div style = {{"marginTop" : "4px"}}/>
								<div className = "col-sm-8 col-md-8 col-lg-8 col-sm-offset-2 col-md-offset-2 col-lg-offset-2">
									<button onClick = {this.startOver.bind(this)}
									 className = {another_button_class}> 
									 	{add_another_text}
									 </button>	
								</div>
							</div>
						</div>

						


						
						{this.state.sent_success 
							? 
							<div style = {{"marginTop" : "12px"}}/> 	
							: 
							 <div style = {{"marginTop" : "0px"}}/>
						}

						<div className = "row">
							<div className = "landing-after-input-text">
								Coming soon, October 2017
							</div>
						</div>

						<div className = "small-buffer"/>
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