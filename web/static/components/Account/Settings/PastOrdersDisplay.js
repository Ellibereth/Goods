var React = require('react');
var ReactDOM = require('react-dom');
var Config = require('Config')
var url = Config.serverUrl
import {Grid, Row} from 'react-bootstrap'
import OrderDisplay from './OrderDisplay.js'

export default class PastOrdersDisplay extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}





	render() {

	var orders = this.props.past_orders
	var display = orders.map((order, index) => 
			<Row>
				<OrderDisplay order = {order} index = {index} />
			</Row>
		)

		return (
			<div>
				<Grid title = "Your Past Orders">
					{display}
				</Grid>
			</div>	
		)
	}
}

