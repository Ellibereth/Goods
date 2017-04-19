var React = require('react');
var ReactDOM = require('react-dom');
var Config = require('Config')
var url = Config.serverUrl
import AppStore from '../../../stores/AppStore.js';
import UpdateShippingForm from './UpdateShippingForm'
import TopNavBar from '../../Misc/TopNavBar'
var browserHistory = require('react-router').browserHistory;

export default class UpdateShippingPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}

	render() {
		return (
			<div>

				<TopNavBar />
				<div className = "container">
					 {/* <SettingsFormPersonal /> */}
					<UpdateShippingForm />
				</div>
			</div>	
		)
	}
}

