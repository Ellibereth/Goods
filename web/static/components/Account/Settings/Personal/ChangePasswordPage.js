var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../../stores/AppStore.js';
import ChangePasswordForm from './ChangePasswordForm.js'
import PageContainer from '../../../Misc/PageContainer'
var browserHistory = require('react-router').browserHistory;

export default class ChangePasswordPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}


	render() {
		return (
			<PageContainer component = {
				<div className = "container">
					<ChangePasswordForm />
				</div>
			}/>
		)
	}
}

