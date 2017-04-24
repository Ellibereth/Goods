var React = require('react');
var ReactDOM = require('react-dom');
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
				<div>
					<CartItemDisplay refreshProductInfo = {this.props.refreshProductInfo} item = {item} />
					<div className = "top-buffer"/>
				</div>
			)


		return (
			<div>
				{item_display.length == 0 ? 
					<div>
						<h2> There are no items in your cart! Check out our store 
						 <Link to = "/store"> here </Link> </h2>
					</div>
				:
				<div className = "col-xs-8 col-sm-8 col-md-8 col-lg-8">
						{item_display}
				
					<br/>
					<div>
						<b> Total Cart Price: {this.props.price} </b>
					</div>
				</div>
				}
			</div>	
		)
	}
}

