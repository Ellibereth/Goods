var React = require('react');
var ReactDOM = require('react-dom');
import Modal from 'react-bootstrap/lib/Modal'
import HomePage from '../Home/HomePage'

export default class LandingPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
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
					swal({
						title: "Thanks! We'll e-mail you when we're live",
						type: "success"
					})
					this.setState({email : ""})
				}
				else {
					swal({
						title : data.error,
						type : "error"
					})
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

	

	render() {
		

		var image_style = {
			// backgroundImage : "url(" + PHOTO_SRC + ")",
			// backgroundRepeat: "no-repeat",
			// backgroundSize: "100% 100%",
			height : "500px"
		}


		return (
			<div>
				<Modal show = {true}>
					<Modal.Body>
					<div className = "landing-container" style = {image_style}>
						<div className = "landing-card col-sm-12 col-md-12 col-lg-12"
						>
								<div className = "landing-title">
							Edgar USA
						</div>
						<div className = "landing-after-title-text">
							Buying, redefined
						</div>
						<div className = "small-buffer"/>
						<div className = "landing-middle-text">
							Need stuff? 
						</div>
						
						<div className = "landing-middle-text">
							Buy it now, pay for it later
						</div>
						<div className = "top-buffer"/>
						<div className = "landing-above-input-text">
							Sign up to get notified when we launch
						</div>
						<div className = "small-buffer"/>
						<div className = "row">
							<div className = "col-md-12 col-lg-8 col-md-offset-0 col-lg-offset-2">
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
						<div className = "top-buffer"/>
						<div className = "landing-privacy-policy-notice">
							<a href = '/privacy'>Privacy Policy </a>
						</div>
						</div>
					</div>
					</Modal.Body>
					</Modal>
				<HomePage />
			</div>
		);
	}
}