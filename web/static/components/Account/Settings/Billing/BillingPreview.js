var React = require('react');
var ReactDOM = require('react-dom');
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
							<h4> Billing  </h4>
						</Col>
						<Col sm = {2} lg ={2} md = {2} className = "pull-right text-right">
							<Button onClick = {() => browserHistory.push('/billing')} > Add </Button>
						</Col>
					</Row>
					<Row>
						<div className = "setting-preview-box">
							<h5>
								<p> You have {this.props.cards.length} cards </p>
								{
									this.props.cards.length > 0 ?
										<p> <Link to = "/yourCards"> Manage Cards </Link> </p>
									:
										<p> Add some cards first! </p>

								}
							</h5>
						</div>
					</Row>
				</Grid>
			</div>	
		)
	}
}

