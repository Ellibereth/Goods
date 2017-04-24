var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../../stores/AppStore.js';
import ChangePasswordForm from './ChangePasswordForm.js'
import TopNavBar from '../../../Misc/TopNavBar'
var browserHistory = require('react-router').browserHistory;

export default class ChanagePasswordPage extends React.Component {
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
					<ChangePasswordForm />
				</div>
			</div>	
		)
	}
}

