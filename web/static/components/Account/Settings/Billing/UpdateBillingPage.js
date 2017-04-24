var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../../stores/AppStore.js';
import UpdateBillingForm from './UpdateBillingForm'
import TopNavBar from '../../../Misc/TopNavBar'
var browserHistory = require('react-router').browserHistory;

export default class UpdateBillingPage extends React.Component {
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
					<UpdateBillingForm />
				</div>
			</div>	
		)
	}
}

