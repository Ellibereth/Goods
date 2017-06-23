var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;
var Link = require('react-router').Link;
import AppStore from '../../../stores/AppStore.js';

export default class AboutIcon extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	componentDidMount(){
	}

	
	render() {

		return (
			<li>
				<a href = "/about"> 
					<span className = "nav-icon">
						<span className = "glyphicon glyphicon-question-sign"/> 
					</span>
					{this.props.show_text && <span className = "nav-icon-text">About Us</span>}
				</a>
			</li>
		)
	}
}