var React = require('react');
var ReactDOM = require('react-dom');
var Link = require('react-router').Link;
var browserHistory = require('react-router').browserHistory;
import AppStore from '../../../../stores/AppStore.js';
import {Col} from 'react-bootstrap'
import {formatPrice} from '../../../Input/Util.js'
var dateFormat = require('dateformat');
import OrderItemDisplay from './OrderItemDisplay'

// takes orders as prop
export default class OrdersPreview extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}

	render() {
		var items = this.props.items
		var order_items = []
		for (var i = 0; i < this.props.items.length; i++){
			order_items.push(<OrderItemDisplay order = {items[i]}/>)
		}

		return (
			<div className="panel panel-default">
				<div className = "panel-heading">
					<div> {"Order " + this.props.order_id}  </div>
				</div>
				

				<div className = "panel-body">
					<div className = "container">
						{order_items}
					</div>
				</div>


			</div>
						
		)
	}
}

