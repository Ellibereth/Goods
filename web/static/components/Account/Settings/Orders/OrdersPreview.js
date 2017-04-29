var React = require('react');
var ReactDOM = require('react-dom');
var Link = require('react-router').Link;
var browserHistory = require('react-router').browserHistory;
import AppStore from '../../../../stores/AppStore.js';
import {Grid, Row, Button, Col} from 'react-bootstrap'


// takes orders as prop
export default class OrdersPreview extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}

	render() {
		
		return (
			<div>
				<Grid>
					<Row>
						<Col sm = {10} lg = {10} md = {10}>
							<h4> Past Orders </h4>
						</Col>
					</Row>
					<Row>
						<div className = "setting-preview-box">
							<h5>
								<p> You have {this.props.orders.length} orders </p>
								{
									this.props.orders.length > 0 ?
									<p> <Link to = "/myOrders"> View Orders </Link> </p>
									:
									<p> Buy something! </p>
								}
							</h5>
						</div>
					</Row>
				</Grid>
			</div>	
		)
	}
}

