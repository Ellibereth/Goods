var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../../stores/AppStore.js';
import UpdateShippingForm from './UpdateShippingForm'
import TopNavBar from '../../../Misc/TopNavBar'
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
					 
					 {/* Option for styling a header here. This is for Eli to test with! 
					 	Have fun :D
					 <div className = "row">
					 	<div className = "col-md-offset-1 col-md-8 col-lg-offset-1 col-lg-8">
					 		<span className = "settings-title"> Add an address </span>
					 	</div>
					 </div> */}
					 <div className = "row">
					 	<UpdateShippingForm />
					 </div>
				</div>
			</div>	
		)
	}
}

