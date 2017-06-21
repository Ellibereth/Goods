var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;
var Link = require('react-router').Link;
import AppStore from '../../stores/AppStore.js';
import {formatPrice} from '../Input/Util'

export default class NavCartItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			current_user : []
		}
	}

	componentDidMount(){
	
	}

	
	render() {
		var item = this.props.item
		return (
			<li>
				<a>
				<div className = "container-fluid">

					<div className = "row">
						<div className = "col-md-4">
						 	<img 
								src = {"https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/" 
								+ item.main_image}
								className = "img-responsive nav-cart-item-image"/>
						</div>
					</div>

					<div className = "row">
						<div className = "col-md-8">
							<div className = "row"> {item.name} </div>
							<div className = "row">
								<div className = "col-md-4">
									Qty: {item.num_items} 
								</div>
								<div className = "col-md-4">
									Remove 
								</div>
								<div className = "col-md-4">
									${formatPrice(item.price)} 
								</div>
							</div>
						</div>
					</div>
				</div>
				</a>
			</li>
		)
	}
}