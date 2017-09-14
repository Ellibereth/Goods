var React = require('react')
var ReactDOM = require('react-dom')
var browserHistory = require('react-router').browserHistory
var Link = require('react-router').Link
import AppStore from '../../stores/AppStore.js'
import AppActions from '../../actions/AppActions.js'

const edgar_logo = 'https://s3-us-west-2.amazonaws.com/edgarusahomepage/linda3.png'
export default class MobileNavBar extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
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
		var current_user = AppStore.getCurrentUser()
		if (current_user == {} || !current_user || current_user.is_guest){
			return (
				
				<ul className="nav navbar-nav navbar-mobile-right-dropdown">
					<li><a href="/faq">FAQ</a></li>
					<li><a href="/myCart">Cart</a></li>
					<li><a href="/register">Sign Up</a></li>
					<li><a href ="/login">Login</a></li>
				</ul>
			)
		}
		else {
			return (
				<ul className="nav navbar-nav navbar-mobile-right-dropdown">
					<li><a href="/faq">FAQ</a></li>
					<li><a href="/myCart">Cart</a></li>
					<li className="dropdown">
						<a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
						You <span className="caret"></span>
						</a>
						<ul className="dropdown-menu navbar-mobile-account-dropdown">
							<li><a href="/settings">Account <span className = "glyphicon glyphicon-user"/></a></li>
							<li><a href="/myOrders">Past Orders <span className = "glyphicon glyphicon-list-alt"/></a></li>
							<li><a href="/support">Support <span className = "glyphicon glyphicon-info-sign"/></a></li>
							<li><a href="/logout">Sign Out <span className = "glyphicon glyphicon-log-out"/></a></li>
						</ul>
					</li>
				</ul>
			)
		}	
	}

	render() {
		var right_nav = this.getRightNav()
		return (
			<nav className = "nav navbar-default navbar-mobile">
				<div className = "container-fluid">
					<div style = {{'backgroundColor' : 'white'}} className="navbar-header mobile">
						<button type="button" className="navbar-toggle collapsed navbar-mobile-dropdown-toggle" data-toggle="collapse"
							 data-target=".mobile-nav-menu" aria-expanded="false" aria-controls="navbar">
							<span className="sr-only">Toggle navigation</span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
						</button>
						<a className = "navbar-brand mobile" href="/"><img className = "mobile-logo" src = {edgar_logo}/></a>
					</div>
					<div id = "mobile-nav" 
						className = "navbar-collapse collapse mobile-nav-menu"
						 aria-expanded = "false">
						{right_nav}
					</div>
				</div>
			</nav>
		)
	}
}