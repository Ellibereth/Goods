var React = require('react');
var ReactDOM = require('react-dom');
var Config = require('Config')
var url = Config.serverUrl
import AppStore from '../../../stores/AppStore.js';

import SettingsFormPersonal from './SettingsFormPersonal'
import SettingsFormBillingShipping from './SettingsFormBillingShipping'
import TopNavBar from '../../Misc/TopNavBar'
var browserHistory = require('react-router').browserHistory;

export default class SettingsPage extends React.Component {
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
		return (
			<div>

				<TopNavBar />
				<div className = "container">
					 {/* <SettingsFormPersonal /> */}
					<SettingsFormBillingShipping />
				</div>
			</div>	
		)
	}
}

