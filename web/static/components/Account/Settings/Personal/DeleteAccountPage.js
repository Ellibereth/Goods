var React = require('react');
var ReactDOM = require('react-dom');
import DeleteAccountForm from './DeleteAccountForm.js'
import PageContainer from '../../../Misc/PageContainer'
var browserHistory = require('react-router').browserHistory;

export default class DeleteAccountPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}


	render() {
		return (
			<PageContainer component = {
				<div className = "container">
					<DeleteAccountForm />
				</div>
			}/>
		)
	}
}

