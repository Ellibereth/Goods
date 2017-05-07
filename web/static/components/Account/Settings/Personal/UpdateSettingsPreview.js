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
							<div> Personal </div>
						</div>
						<div className ="panel-body">
							<span className = "block-span"> Name: {current_user.name} </span>
							<span className = "block-span"> Email: {current_user.email} </span>
							<span className = "block-span"> 
								<button className = "btn btn-default" 
									onClick = {() => browserHistory.push('updateSettings')}>
									Edit Settings
								</button>
							</span>
						</div>
					</div>
				</div>
		)
	}
}

