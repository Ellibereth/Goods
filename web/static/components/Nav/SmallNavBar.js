var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;
var Link = require('react-router').Link;
import AppStore from '../../stores/AppStore.js';
import AppActions from '../../actions/AppActions.js';
import NavCartIcon from './NavCartIcon'

export default class SmallNavBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			current_user : null,
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

		var search_bar = this.props.getSearchBar()

		var current_user = AppStore.getCurrentUser()
		if (current_user == {} || !current_user || current_user.is_guest){
			return (
				
					<ul className="nav navbar-nav navbar-right">
						<li>
							{search_bar}
						</li>

						{/* <li> 
							<NavCartIcon show_text = {false}/>
						</li> */}
						<li><a href="/register" className = "no-user-link">Sign Up</a></li>
						<li><a href ="/login" className = "no-user-link">Login</a></li>
					</ul>
			)
		}
		else {
			return (
				<ul className="nav navbar-nav navbar-right">
					<li>
						{search_bar}
					</li>
					
					<NavCartIcon show_text = {false}/>

					<li className = "dropdown account-dropdown">
						<a id = "account_dropdown"  className="dropdown-toggle" 
						data-toggle="dropdown" role="button" aria-haspopup="true"
						aria-expanded="false"> 
						 	<span className = "nav-icon">
							 	<span className = "glyphicon glyphicon-user"/> 
							</span>
						</a>

						<ul className="dropdown-menu"> 
							<li> <a href ="/settings"> Account </a> </li>
							<li> <a href = '/myOrders'> Past Orders </a> </li>
							<li><a href ="/support" >Support</a></li>
							<li> <a href = "/logout"> Sign Out </a></li>
						</ul>
					</li>
				</ul>
			)
		}	
	}


	render() {
		var current_user = AppStore.getCurrentUser()
		var brand_class = "navbar-brand navbar-brand-small"
		var right_nav = this.getRightNav()
		return (
			<div>
				<nav style = {{"height" : "59px", "padding-top" : "3px"}}
				className={this.props.visible 
					? "navbar navbar-edgarusa-small navbar-fixed-top" 
					:  "navbar navbar-edgarusa-small navbar-fixed-top none"}
					>
					<div className="container-fluid">
						<div className="navbar-header">
							<a className= {brand_class} href="/"> Edgar USA </a>
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