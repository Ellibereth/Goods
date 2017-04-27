var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../../stores/AppStore.js';
import CartItemDisplay from './CartItemDisplay'
var browserHistory = require('react-router').browserHistory;
var Link = require('react-router').Link
import {Button} from 'react-bootstrap'

export default class CartDisplay extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			// this is only for the first loading
			has_loaded : false
		}
	}
	
	componentWillReceiveProps(nextProps){
		if (!nextProps.is_loading){
			this.setState({has_loaded : true})
		}
	}

	render() {
		var item_display = this.props.items.map((item, index) =>
				<CartItemDisplay refreshCheckoutInformation = {this.props.refreshCheckoutInformation} item = {item} />
			)

		if (!this.state.has_loaded) {
			return <div/>
		}


		return (
			<div id = "cart_display">
				{item_display.length == 0 ? 
					<div>
						<h2> There are no items in your cart! Check out our store 
						 <Link to = "/store"> here </Link> </h2>
					</div>
				:
					<div>

						<div className = "row">
							<div className = "col-xs-6 col-sm-6 col-md-6 col-lg-6">
								Item Description
							</div>

							<div className = "col-xs-2 col-sm-2 col-md-2 col-lg-2 hcenter">
								Price
							</div>

							<div className = "col-xs-2 col-sm-2 col-md-2 col-lg-2 hcenter">
								Quantity 
							</div>
							<div className = "col-xs-1 col-sm-1 col-md-1 col-lg-1 hcenter1">
								Item Total 
							</div>
							<div className = "col-xs-1 col-sm-1 col-md-1 col-lg-1 hcenter">
								Remove
							</div>
						</div>	

							{item_display}
					
						<hr/>
					</div>
				}
			</div>	
		)
	}
}

