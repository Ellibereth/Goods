var React = require('react');
var ReactDOM = require('react-dom');
var Link = require('react-router').Link;
var browserHistory = require('react-router').browserHistory;
import AppStore from '../../../../stores/AppStore.js';


// takes orders as prop
export default class OrdersPreview extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}

	render() {
		
		return (
			<div className = "container-fluid">
					
				<div className="panel panel-default">
					<div className = "panel-heading">
						<div> Your Orders </div>
					</div>
					<div className="panel-body">
							<span className = "block-span"> You have {this.props.orders.length} orders </span>
							{
								this.props.orders.length > 0 ?
								<span className = "block-span"> <Link to = "/myOrders"> View Orders </Link> </span>
								:
								<span className = "block-span"> Buy something! </span>
							}
					</div>
				</div>
			</div>

			
						
		)
	}
}

