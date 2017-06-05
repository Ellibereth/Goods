var React = require('react');
var ReactDOM = require('react-dom');
var Link = require('react-router').Link;
var browserHistory = require('react-router').browserHistory;
import AppStore from '../../../../stores/AppStore.js';

export default class UpdateSettingsPreview extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}

	render() {
		var current_user = AppStore.getCurrentUser()

		return (
				<div className = "container-fluid">
					<div className = "panel panel-default">
						<div className = "panel-heading">
							<div className = "account-page-text"> Personal </div>
						</div>
						<div className ="panel-body">
							<span className = "account-page-text block-span"> Name: {current_user.name} </span>
							<span className = "account-page-text block-span"> Email: {current_user.email} </span>
							<span className = "block-span"> <div className = "small-buffer"/></span>
							<span className = "block-span"> 
								<button style = {{"margin-right" : "6px"}} className = "btn btn-default btn-sm" id = "edit-address-button"
									onClick = {() => window.location = 'updateSettings'}>
									Edit
								</button>
								<button className = "btn btn-default btn-sm" 
									onClick = {() => window.location = 'deleteAccount'}>
									Delete
								</button>
							</span>
						</div>
					</div>
				</div>
		)
	}
}

