var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;

// import {Button, Row, Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';
var Link = require('react-router').Link;
import styles from './navbar.css'

import AppStore from '../../stores/AppStore.js';
import AppActions from '../../actions/AppActions.js';


export default class SmallNavBar extends React.Component {
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

	onSearchChange(event){
		this.setState({search_input : event.target.value})
	}



	getRightNav() {
		if (this.props.no_login) {
			return <div/>
		}
		var current_user = AppStore.getCurrentUser()
		if (current_user == {} || !current_user){
			return (
				
					<ul className="nav navbar-nav navbar-right">
						<li><Link to="/register" className = "no-user-link">Sign Up</Link></li>
						<li><Link to ="/login" className = "no-user-link">Login</Link></li>
					</ul>
			)
		}
		else {
			return (
					<ul className="nav navbar-nav navbar-right">
						<li>
							<form onSubmit = {this.searchProducts.bind(this)}
								 className="navbar-form navbar-left" role="search">
								<div className="input-group ">
									<input  onChange = {this.onSearchChange.bind(this)} type="text" className="form-control" placeholder="Search" name="srch-term" id="srch-term"/>
									<div className="input-group-btn nav-search-icon">
										<button className="btn btn-default" type="submit"><i className="glyphicon glyphicon-search"></i></button>
									</div>
								</div>
							</form>
						</li>
						
							
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
							</Link>
						</li>
						<li>
							<a id = "account_dropdown" href="#" className="dropdown-toggle" 
							data-toggle="dropdown" role="button" aria-haspopup="true"
							aria-expanded="false"> 
							 	<span className = "nav-icon">
								 	<span className = "glyphicon glyphicon-user"/> 
								</span>
							</a>

							<ul className="dropdown-menu"> 
								<li> <Link to ="/settings"> Settings </Link> </li>
								<li> <Link to = '/myOrders'> Past Orders </Link> </li>
								<li> <Link to = "/logout"> Logout </Link></li>
							</ul>
						</li>
					</ul>
				
			)
		}	
	}

	searchProducts(event){
		window.location.href = '/search/' + this.state.search_input
		
		event.preventDefault()
	}

	render() {
		var current_user = AppStore.getCurrentUser()
		var brand_class = "navbar-brand navbar-brand-small"
		var right_nav = this.getRightNav()
		return (
			<div>
				<nav 
				className={this.props.visible 
					? "navbar navbar-edgarusa-small navbar-fixed-top" 
					:  "navbar navbar-edgarusa-small navbar-fixed-top none"}
					>
					<div className="container">
							<div className="navbar-header">
								<a className= {brand_class} href="/"> E </a>
							</div>

						<div className="collapse navbar-collapse">
							
							

						{right_nav}
						</div>
					</div>	
				</nav>
				
			</div>
		);
	}
}