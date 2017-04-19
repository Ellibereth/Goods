var React = require('react');
var ReactDOM = require('react-dom');
var Config = require('Config')
var url = Config.serverUrl
import AppStore from '../../../stores/AppStore.js';
import TopNavBar from '../../Misc/TopNavBar'
import UpdateSettingsPreview from './UpdateSettingsPreview.js'
import BillingPreview from './BillingPreview.js'
import PastOrdersPreview from './PastOrdersPreview.js'
import ShippingPreview from './ShippingPreview'
var browserHistory = require('react-router').browserHistory;

export default class SettingsPage extends React.Component {
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
					<h1> Your Account </h1> 
					<br/>

					<UpdateSettingsPreview />
					<br/>

					<BillingPreview />
					<br />

					<ShippingPreview />
					<br/>

					{/* <PastOrdersPreview /> */}
					

				</div>
			</div>	
		)
	}
}

