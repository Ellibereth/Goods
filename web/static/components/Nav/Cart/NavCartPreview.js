var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;
var Link = require('react-router').Link;
import AppStore from '../../stores/AppStore.js';
import NavCartItem from './NavCartItem'
export default class NavCartPreview extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user : AppStore.getCurrentUser()
		}
	}

	componentDidMount(){
		setInterval(function(){ 
			if (JSON.stringify(this.state.user) === JSON.stringify(AppStore.getCurrentUser())){
				this.setState({user : AppStore.getCurrentUser()})	
			}
		}.bind(this), 1000)
		this.setState({user : AppStore.getCurrentUser()})
	}

	
	render() {

		
		var user = this.state.user
		if (user == null || user == {}) {
			return <div/>
		}
		var cart = user.cart
		var items = cart.items

		var item_display = items.map((item, index) => 
			<NavCartItem item = {item}/>
		)

		return (
			<ul className = "dropdown-menu cart-dropdown">
				{item_display}
				<li>
					<button onClick = {() => window.location = "/checkout"} 
					type = "button" className = "btn btn-default nav-checkout-button">
						Checkout
					</button>
				</li>
			</ul>
		)
	}
}