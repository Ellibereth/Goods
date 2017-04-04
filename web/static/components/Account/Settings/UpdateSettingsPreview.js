var React = require('react');
var ReactDOM = require('react-dom');
var Config = require('Config')
var url = Config.serverUrl
var Link = require('react-router').Link;
var browserHistory = require('react-router').browserHistory;
import AppStore from '../../../stores/AppStore.js';
import {Grid, Row, Button, Col} from 'react-bootstrap'

export default class UpdateSettingsPreview extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}

	// no need to be on settings if no one is logged in
	componentWillMount(){
		var current_user = AppStore.getCurrentUser()
		if (current_user == null || !current_user || current_user == {}){
			browserHistory.push('/')
		}

	}



	render() {
		var current_user = AppStore.getCurrentUser()

		return (
			<div>
				<Grid>
					<Row>
						<Col lg = {10} md = {10} className = "pull-left">
							<h3> Your Info </h3>
						</Col>
						<Col lg ={2} md = {2} className = "pull-right">
							<span className = "align-middle">
								<Button onClick = {() => browserHistory.push('/updateSettings')} > Edit </Button>
							</span>
						</Col>
					</Row>
					<Row>
						<div className = "setting-preview-box">
							<h5>
								<p>  Name : {current_user.name} </p>
								<p>   Email : {current_user.email} </p>
							</h5>
						</div>
					</Row>
				</Grid>
			</div>	
		)
	}
}

