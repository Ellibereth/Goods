var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;
var Link = require('react-router').Link;
import AppStore from '../../stores/AppStore.js';
import AppActions from '../../actions/AppActions.js';
import NavCartIcon from './NavCartIcon'


export default class LargeNavBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			current_user : null,
			search_input : "",
		}
	}

	componentDidMount(){
		
	}

	getRightNav() {
		var search_bar = this.props.getSearchBar()
		var current_user = AppStore.getCurrentUser()
		if (current_user == {} || !current_user || current_user.is_guest){
			return (
				
					<ul className="nav navbar-nav navbar-right">
						<li> {search_bar} </li>
						{/* <li> 
							<NavCartIcon show_text = {true}/>
						</li> */}
						<li><a href="/register" className = "no-user-link">Sign Up</a></li>
						<li><a href ="/login" className = "no-user-link">Login</a></li>
					</ul>
			)
		}
		else {
			return (
				<ul className="nav navbar-nav navbar-right">
					<li> {search_bar} </li>
					<NavCartIcon show_text = {true}/> 
						<li className = "dropdown">
							<a href="#"
							 className="dropdown-toggle" data-toggle="dropdown" 
							 aria-haspopup="true" aria-expanded="false"> 
							 	<span className = "nav-icon">
								 	<span className = "glyphicon glyphicon-user"/> 
								</span>
								<span className = "nav-icon-text"> You <span className = "caret"/> </span>
							</a>
							<ul className="dropdown-menu"> 
								<li> <a href ="/settings"> Account </a> </li>
								<li> <a href = '/myOrders'> Past Orders </a> </li>
								<li> <a href ="/support">Support</a></li>
								<li> <a href = "/logout"> Sign Out </a></li>
							</ul>
						</li>
					<li>
						<span className = "nav-greetings-text">
							 Hello, {current_user.name.split(' ')[0]}! 
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
			<nav 
				className= {this.props.visible ? "navbar navbar-fixed-top navbar-edgarusa top-navbar" 
				: "navbar navbar-fixed-top navbar-edgarusa top-navbar none"}>
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
						{right_nav}
					</div>
				</div>	
			</nav>
		);
	}
}