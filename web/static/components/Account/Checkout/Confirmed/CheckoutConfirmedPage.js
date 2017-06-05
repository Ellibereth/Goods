var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../../stores/AppStore.js';
import PageContainer from '../../../Misc/PageContainer'
import {Button} from 'react-bootstrap'
var browserHistory = require('react-router').browserHistory;
var Link = require('react-router').Link




export default class CheckoutConfirmedPage extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			
		}
	}

	render() {
		return (
			<PageContainer component = {
				<div id = "checkout-confirmed-container" className = "container">
					<div className = "row">
						<div style = {{"font-size" : "18px"}} className = "col-sm-10 col-md-10 col-lg-10">
							<p> Thanks for ordering! </p>
							<p> You will have received an email with details of your order at {AppStore.getCurrentUser().email} </p>
							<p> You can always view your past orders <a href = "/myOrders"> here </a> </p>
						</div>
					</div>
				</div>
			}/>
		)
	}
}

