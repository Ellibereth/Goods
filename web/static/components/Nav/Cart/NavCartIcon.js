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

	
	render() {

		return (
			<li className = "dropdown nav-dropdown cart-dropdown">
				<a href = "/myCart"> 
					<span className = "nav-icon">
						<span className = "glyphicon glyphicon-shopping-cart "/> 
						{this.state.cart_badge > 0 && <span className ="badge badge-notify cart-badge"> {this.state.cart_badge} </span>}
					</span>
					{this.props.show_text && <span className = "nav-icon-text"> Cart </span>}
				</a>
				{/* 
					<a href = "/checkout"
					className="dropdown-toggle" 
					data-toggle="dropdown" role="button" aria-haspopup="true"
					aria-expanded="false"> 
					<span className = "nav-icon">
						<span className = "glyphicon glyphicon-shopping-cart "/> 
						{this.state.cart_badge > 0 && <span className ="badge badge-notify cart-badge"> {this.state.cart_badge} </span>}
					</span>
					{this.props.show_text && <span className = "nav-icon-text"> Cart </span>}
				</a>
					{AppStore.getCurrentUser() &&
					<NavCartPreview />}
				*/}
			</li>
		)
	}
}