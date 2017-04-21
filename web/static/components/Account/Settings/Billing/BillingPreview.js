var React = require('react');
var ReactDOM = require('react-dom');
var Config = require('Config')
var url = Config.serverUrl
var Link = require('react-router').Link;
var browserHistory = require('react-router').browserHistory;
import AppStore from '../../../../stores/AppStore.js';
import {Grid, Row, Button, Col} from 'react-bootstrap'

export default class BillingPreview extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}

	render() {
		var current_user = AppStore.getCurrentUser()

		return (
			<div>
				<Grid>
					<Row>
						<Col sm = {10} lg = {10} md = {10}>
							<h4> Billing and Shipping </h4>
						</Col>
						<Col sm = {2} lg ={2} md = {2} className = "pull-right text-right">
							<Button onClick = {() => browserHistory.push('/billing')} > Add </Button>
						</Col>
					</Row>
					<Row>
						<div className = "setting-preview-box">
							<h5>
								<p> Placeholder for other previews for now</p>
								<p> <Link to = "/yourCards"> Manage Cards </Link> </p>
							</h5>
						</div>
					</Row>
				</Grid>
			</div>	
		)
	}
}

