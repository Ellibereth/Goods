var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;
var Link = require('react-router').Link;
import styles from './navbar.css'
import AppStore from '../../stores/AppStore.js';
import AppActions from '../../actions/AppActions.js';

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
		if (current_user == {} || !current_user){
			return (
				
					<ul className="nav navbar-nav navbar-right">
						<li>
							{search_bar}
						</li>

						<li><Link to="/register" className = "no-user-link">Sign Up</Link></li>
						<li><Link to ="/login" className = "no-user-link">Login</Link></li>
					</ul>
			)
		}
		else {
			return (
				<ul className="nav navbar-nav navbar-right">
					<li>
						{search_bar}
					</li>
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
							<li><Link to ="/support" >Support</Link></li>
							<li> <Link to = "/logout"> Logout </Link></li>
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