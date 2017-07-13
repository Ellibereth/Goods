var React = require('react');
var ReactDOM = require('react-dom');
import Footer from '../Nav/Footer'
import Navbar from '../Nav/Navbar'





export default class PageContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	componentDidMount(){
		
	}




	render() {

		return (
				<div>
					<div className = "page-top-row">
						<div className = "page-wrapper">
							<div className = "top-row-inner">
								<span className = "top-row-text"> Free Shipping. Free Returns. Smiles Guaranteed.</span>
								<span id = "top-contact-us" className = "top-row-text float-right" onClick = {() => window.location = "/contact"}> 
									<span id = "top- email-glyph"className = "glyphicon glyphicon-envelope top-row-envelope-icon"/>
								 	<span>Contact Us</span>
								</span>
							</div>
						</div>
					</div>
					<div className = "page-wrapper">
						<Navbar />
						<div className = "content-wrapper"> 
							{!this.props.no_add_buffer && <div className = "content-buffer"/>}
							{this.props.children}
						</div>
					</div>
					<div className = "top-buffer"/>
					<Footer />
					<div className = "top-buffer"/>
				</div>
		);
	}
}