var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;
var Link = require('react-router').Link;
import AppStore from '../../stores/AppStore.js';
import AppActions from '../../actions/AppActions.js';
import NavCartIcon from './Cart/NavCartIcon'
import NavAccountIcon from './Account/NavAccountIcon'
import FaqIcon from './Icon/FaqIcon'
import AboutIcon from './Icon/AboutIcon'

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
						<AboutIcon show_text = {true}/>
						<FaqIcon show_text = {true}/>
						<NavCartIcon show_text = {true}/>
						<li><a href="/register" className = "nav-no-user-link">Sign Up</a></li>
						<li><a href ="/login" className = "nav-no-user-link">Login</a></li>
					</ul>
			)
		}
		else {
			return (
				<ul className="nav navbar-nav navbar-right">
					
					<li> {search_bar} </li>
					<AboutIcon show_text = {true}/>
					<FaqIcon show_text = {true}/>
					<NavCartIcon show_text = {true}/> 
					<NavAccountIcon show_text = {true}/>
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
		var brand_class = (current_user == {} || !current_user) ? "navbar-brand navbar-brand-edgarusa" : "navbar-brand navbar-brand-edgarusa"
		var right_nav = this.getRightNav()
		return (
			<nav 
				className= {this.props.visible ? "navbar navbar-fixed-top navbar-edgarusa top-navbar" 
				: "navbar navbar-fixed-top navbar-edgarusa top-navbar none"}>
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
			</nav>
		);
	}
}