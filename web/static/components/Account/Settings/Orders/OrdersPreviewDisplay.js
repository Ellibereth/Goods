var React = require('react');
var ReactDOM = require('react-dom');
var Link = require('react-router').Link;
var browserHistory = require('react-router').browserHistory;
import AppStore from '../../../../stores/AppStore.js';
import {Col} from 'react-bootstrap'
import {formatPrice} from '../../../Input/Util.js'


// takes orders as prop
export default class OrdersPreview extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}

	render() {
		var order = this.props.order
		var first_col_size = 3
		var second_col_size =  12 - first_col_size
		var src_base = "https://s3-us-west-2.amazonaws.com/publicmarketproductphotos/"
		console.log(order)
		return (
			<div className = "row">
				<div className = "col-md-5 col-lg-5 col-sm-5">
					<div className="table-responsive">
        				<table className="table table-bordered order-preview-table">
        					<thead>
        						<tr className = "noborder">
        							<th> <img className = "order-preview-image" src = {src_base + order.main_image} /> </th>
        							<th className = "table-header-vertical-align-center">  
        								<div> {order.name} </div>
        								<div> Quantity: {order.num_items} @ ${formatPrice(order.price)} </div>
        							</th>
        						</tr>
        					</thead>
        					<tbody>
	        					<tr>
	        						<td className = "light-grey-background grey-text">  DATE  </td>
        							<td> {order.date_created}  </td>
	        					</tr>
	        					<tr>
	        						<td className = "light-grey-background grey-text">  PRICE  </td>
        							<td>  ${formatPrice(order.total_price)} </td>
	        					</tr>
	        					<tr>
	        						<td className = "light-grey-background grey-text"> ORDER#  </td>
        							<td className = "clickable-text">  {order.order_id} </td>
	        					</tr>
        					</tbody>
        				</table>
        			</div>
        		</div>
        	</div>						
		)
	}
}

