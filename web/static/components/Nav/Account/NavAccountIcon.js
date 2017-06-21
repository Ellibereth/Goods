var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;
var Link = require('react-router').Link;
import AppStore from '../../../stores/AppStore.js';
// import NavCartPreview from './NavCartPreview'

export default class NavCartIcon extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	componentDidMount(){
		
	}

	
	render() {

		return (
			<li className = "dropdown nav-dropdown account-dropdown">
						<a id = "account_dropdown"  className="dropdown-toggle" 
						data-toggle="dropdown" role="button" aria-haspopup="true"
						aria-expanded="false"> 
						 	<span className = "nav-icon">
							 	<span className = "glyphicon glyphicon-user"/> 
							</span>
							{this.props.show_text && <span className = "nav-icon-text"> You <span className = "caret"/> </span>}
						</a>

						<ul className="dropdown-menu"> 
							<li> <a href ="/settings"> Account </a> </li>
							<li> <a href = '/myOrders'> Past Orders </a> </li>
							<li><a href ="/support" >Support</a></li>
							<li> <a href = "/logout"> Sign Out </a></li>
						</ul>
			</li>
		)
	}
}