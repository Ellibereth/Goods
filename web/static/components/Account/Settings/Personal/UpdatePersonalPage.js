var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../../stores/AppStore.js';
import AccountCard from './AccountCard'
import PageContainer from '../../../Misc/PageContainer'
var browserHistory = require('react-router').browserHistory;

export default class UpdateSettings extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		}
	}

	render() {
		return (
			<PageContainer component = {
				<div className = "container">
					 {/* <SettingsFormPersonal /> */}
					<AccountCard />
				</div>
			}/>
			
		)
	}
}

