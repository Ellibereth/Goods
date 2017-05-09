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
			search_input : "",
			cart_badge: 0
		}
	}

	componentDidMount(){
		setInterval(function(){ 
			var current_cart_size = AppStore.getCurrentUser().cart_size
			if (current_cart_size != this.state.cart_badge){
				this.setState({cart_badge : AppStore.getCurrentUser().cart_size})	
			}
		}.bind(this), 1000)
		this.setState({cart_badge : AppStore.getCurrentUser().cart_size})
	}




	getRightNav() {
		if (this.props.no_login) {
			return <div/>
		}
		var current_user = AppStore.getCurrentUser()
		if (current_user == {} || !current_user){
			return (
				
					<ul className="nav navbar-nav navbar-right">
						<li><Link href="/register" className = "no-user-link">Sign Up</Link></li>
						<li><Link href="/login" className = "no-user-link">Login</Link></li>
					</ul>
			)
		}
		else {
			return (
					<ul className="nav navbar-nav navbar-right">
						
							
						{/* <li> 
							<Link to = "/"> 
								<span className = "glyphicon glyphicon-home nav-icon"/>
								<span className = "nav-icon-text"> Home </span>
							</Link>
						</li> */}
						<li> 
							<Link to = "/myCart"> 
								<span className = "nav-icon">
									<span className = "glyphicon glyphicon-shopping-cart "/> 
									{this.state.cart_badge > 0 && <span className ="badge badge-notify cart-badge"> {this.state.cart_badge} </span>}
								</span>

								<span className = "nav-icon-text"> Cart </span>
							</Link>
						</li>
						<li>
							<a id = "account_dropdown" href="#" className="dropdown-toggle" 
							data-toggle="dropdown" role="button" aria-haspopup="true"
							aria-expanded="false"> 
							 	<span className = "nav-icon">
								 	<span className = "glyphicon glyphicon-user"/> 
								</span>
								<span className = "nav-icon-text"> You <span className = "caret"/> </span>
							</a>

							<ul className="dropdown-menu"> 
								<li><Link to ="/settings"> Settings </Link> </li>
								<li> <Link to = "/logout"> Logout </Link></li>
							</ul>
						</li>
						<li>
							<span className = "nav-greetings-text">
								 Hello {current_user.name.split(' ')[0]}! 
							</span>
						</li>
					</ul>
				
			)
		}	
	}

	render() {
		var current_user = AppStore.getCurrentUser()
		var brand_class = (current_user == {} || !current_user) ? "navbar-brand navbar-brand-no-user" : "navbar-brand navbar-brand-with-user"
		var right_nav = this.getRightNav()

		return (
			<nav className="navbar navbar-edgarusa top-navbar">
				<div className="container-fluid">
					
						<div className="navbar-header">
							<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
								<span className="sr-only">Toggle navigation</span>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
							</button>
							<a className= {brand_class} href="/">Edgar USA</a>
						</div>

					<div className="collapse navbar-collapse">
						
						<form className="navbar-form navbar-left search-bar-with-user" role="search">
							<div className="input-group nav-search-bar">
								<input type="text" className="form-control" placeholder="Search" name="srch-term" id="srch-term"/>
								<div className="input-group-btn nav-search-icon">
									<button className="btn btn-default" type="submit"><i className="glyphicon glyphicon-search"></i></button>
								</div>
							</div>
						</form>
						

					{right_nav}
					</div>
				</div>	
			</nav>
		);
	}
}