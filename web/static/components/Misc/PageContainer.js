var React = require('react');
var ReactDOM = require('react-dom');
import TopNavBar from '../Nav/TopNavBar.js'
import Footer from '../Nav/Footer.js'
// import BottomNavBar from '../Nav/BottomNavBar'




export default class ProductPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			minHeight : 0
		}
	}

	componentDidMount(){
		$(document).ready(function() {
			// executes when HTML-Document is loaded and DOM is ready
			var height = $(window).height();
			this.setState({minHeight : height})
		}.bind(this));
		
		$( window ).resize(function() {
			var height = $(window).height();
			this.setState({minHeight : height})
		}.bind(this));
	}




	render() {

		var content_style = {
				minHeight : this.state.minHeight * 0.78
			};
		
		return (
				<div className = "body-container">
					<TopNavBar/>
						<div id="content" style = {content_style}>
							{this.props.component}
						</div>
					<Footer/>
				</div>
		);
	}
}