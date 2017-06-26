var React = require('react');
var Link = require('react-router').Link;
export default class Footer extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			ready : false
		}
	}

	componentDidMount(){
		setTimeout( function() {
			this.setState({ready : true}) 
		}.bind(this), 1000);
	}

	render() {
		if (!this.state.ready) return <div/>
		return(	
				<div className="container-fluid">
					<footer className = "row edgarusa-footer">
						<ul className ="nav navbar-nav">
							<li><a href="/">© 2017 Edgar USA</a></li>
							<li><a href="/">Home</a></li>
							<li><a href="/terms">Terms</a></li>
							<li><a href="/privacy">Privacy</a></li>
							<li><a href="/contact">Contact Us</a></li>
							<li><a href="/about">About Us</a></li>
							<li><a href="/requestProduct">Request a Product</a></li>
						</ul>
					</footer>
				</div>
		);
	}
}