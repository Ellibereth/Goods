var React = require('react');
var ReactDOM = require('react-dom');
var Link = require('react-router').Link;
var browserHistory = require('react-router').browserHistory;
import AppStore from '../../../../stores/AppStore.js';
import {formatPrice, formatCurrentPrice} from '../../../Input/Util.js'
var dateFormat = require('dateformat');


// takes orders as prop
export default class OrderItemDisplay extends React.Component {
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
		var local_date = new Date(order.date_created)
		var formatted_date = dateFormat(local_date, "dddd, mmmm dS, yyyy, h:MM:ss TT");
		return (
				<div className = "col-md-4 col-lg-4 col-sm-4">
					<div className="table-responsive">
        				<table className="table table-bordered order-preview-table">
        					<thead>
        						<tr className = "noborder">
        							<th className = "order-image-table-row">
        								<a href = {'/eg/' + this.props.order.product_id}> 
        									<img 
        									className = "order-preview-image" src = {src_base + order.main_image} />
        								</a>
        							</th>
        							<th className = "table-header-vertical-align-center">
        								<a href = {'/eg/' + this.props.order.product_id}>
	        								<div> {order.name} </div>
	        								<div> Quantity: {order.num_items} @ ${formatPrice(order.price)} (each) </div>
        								</a>
        							</th>
        						</tr>
        					</thead>
	    					{/*<tbody>
	        					<tr>
	        						<td className = "light-grey-background grey-text">  DATE  </td>
	    							<td> {formatted_date}  </td>
	        					</tr>
	    					</tbody>*/}
        				</table>
        			</div>
        		</div>			
		)
	}
}

