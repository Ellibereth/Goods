var React = require('react');
var ReactDOM = require('react-dom');
var Config = require('Config')
var url = Config.serverUrl
import AppStore from '../../../stores/AppStore.js';
import TopNavBar from '../../Misc/TopNavBar'
var browserHistory = require('react-router').browserHistory;

export default class ViewCartPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cards : []	
		}
	}

		render() {

		return (
			<div>

				<TopNavBar />
				
					
			</div>	
		)
	}
}

