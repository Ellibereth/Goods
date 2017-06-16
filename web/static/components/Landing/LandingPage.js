var React = require('react');
var ReactDOM = require('react-dom');



export default class HomePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	

	render() {
		
		var PHOTO_SRC = "https://s3-us-west-2.amazonaws.com/edgarusahomepage/3.jpg"
		var image_style = {
			backgroundImage : "url(" + PHOTO_SRC + ")",
			backgroundRepeat: "no-repeat",
			backgroundSize: "100% 100%",
			height : "1000px"
		}


		return (
			<div className = "landing-container" style = {image_style}>
				
				<div className = "landing-card col-sm-4 col-md-4 col-lg-4 col-sm-offset-4 col-md-offset-4 col-lg-offset-4">
						<div className = "landing-title">
							Edgar USA
						</div>
						<div className = "landing-after-title-text">
							Live All-American
						</div>
						<div className = "small-buffer"/>
						<div className = "landing-middle-text">
							Buy goods Made in the USA for the cheapest prices on the web.  
						</div>
						
						<div className = "landing-middle-text">
							Featuring a rapidly rotating inventory from top American makers and manufacturers.
						</div>
						<div className = "top-buffer"/>
						<div className = "landing-above-input-text">
							Coming July 2017 - Sign up to be notified for when we launch.
						</div>
						<div className = "small-buffer"/>
						<div className = "row">
							<div className = "col-md-12 col-lg-8 col-md-offset-0 col-lg-offset-2">
								<div className="input-group landing-subscribe-container">
									<input type="text" className="form-control landing-subscribe-input" placeholder="Type your email here" aria-describedby="basic-addon2"/>
									<span className="input-group-addon landing-subscribe-button" >Notify Me!</span>
								</div>
							</div>
						</div>
						<div className = "top-buffer"/>
						<div className = "landing-privacy-policy-notice">
							<a href = '/privacy'>Privacy Policy </a>
						</div>
				</div>
			</div>
		);
	}
}