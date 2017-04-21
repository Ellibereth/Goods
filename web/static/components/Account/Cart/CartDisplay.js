var React = require('react');
var ReactDOM = require('react-dom');
var Config = require('Config')
var url = Config.serverUrl
import AppStore from '../../../stores/AppStore.js';
import TopNavBar from '../../Misc/TopNavBar'
import CartItemDisplay from './CartItemDisplay'
var browserHistory = require('react-router').browserHistory;
var Link = require('react-router').Link

export default class CartDisplay extends React.Component {
	constructor(props){
		super(props);
		this.state = {
		}
	}


	render() {
		var item_display = this.props.items.map((item, index) =>
				<CartItemDisplay refreshProductInfo = {this.props.refreshProductInfo} item = {item} />
			)


		return (
			<div>
				{item_display.length == 0 && 
					<div>
						<h2> There are no items in your cart! Check out our store 
						 <Link to = "/store"> here </Link> </h2>
					</div>
				}
				{item_display}
			</div>	
		)
	}
}

