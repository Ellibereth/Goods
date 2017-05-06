var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;

// import {Button, Row, Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';
var Link = require('react-router').Link;
import styles from './navbar.css'

import AppStore from '../../stores/AppStore.js';
import AppActions from '../../actions/AppActions.js';

export default class TopNavBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			current_user : null,
			search_input : ""
		}
	}

	componentDidMount(){
		this.setState({current_user : AppStore.getCurrentUser()})
	}

	// handleLogout(){
	// 	this.setState({current_user : null})
	// 	AppActions.removeCurrentUser()
	// 	console.log("current user removed")
	// 	browserHistory.push('/')

	// }

	getRightNav() {
		if (this.props.no_login) {
			return <div/>
		}
		var current_user = this.state.current_user
		if (current_user == {} || !current_user){
			return (
				<div className="collapse navbar-collapse">
					<ul className="nav navbar-nav navbar-right">
						<li><Link href="/register" className = "no-user-link">Register</Link></li>
						<li><Link href="/login" className = "no-user-link">Login</Link></li>
					</ul>
				</div>
			)
		}
		else {
			return (
				<div className="collapse navbar-collapse">
					<ul className="nav navbar-nav navbar-right">
						
						<li> 
							<Link to = "/"> 
								<span className = "glyphicon glyphicon-home nav-icon"/>
								<span className = "nav-icon-text"> Home </span>
							</Link>
						</li>
						<li> 
							<Link to = "/myCart"> 
								<span className = "glyphicon glyphicon-shopping-cart nav-icon"/> 
								<span className = "nav-icon-text"> Cart </span>
							</Link>
						</li>
						<li>

							<a href="#" className="dropdown-toggle" 
							data-toggle="dropdown" role="button" aria-haspopup="true"
							aria-expanded="false"> 
							 	<span className = "nav-icon">
								 	<span className = "glyphicon glyphicon-user"/> 
								</span>
								<span className = "nav-icon-text"> You <span className = "caret"/> </span>
							</a>

							<ul className="dropdown-menu"> 
								<li> <a> Hello, {current_user.name} </a> </li>
								<li role="separator" className="divider"></li>
								<li><Link to ="/settings"> Settings </Link> </li>
								<li role="separator" className="divider"></li>
								<li> <Link to = "/logout"> Logout </Link></li>
							</ul>
						</li>
					</ul>
				</div>
				
			)
		}	
	}

	render() {
		var current_user = this.state.current_user
		var brand_class = (current_user == {} || !current_user) ? "navbar-brand-no-user" : "navbar-brand-with-user"
		var right_nav = this.getRightNav()
		return (
			<nav className="navbar navbar-inverse top-navbar">
				<div className="container-fluid">
				
					<div className="navbar-header">
						<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
							<span className="sr-only">Toggle navigation</span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
						</button>
						<a className="navbar-brand" href="/">Edgar USA</a>
					</div>

					{right_nav}
					
				</div>
			</nav>
		);
	}
}