var React = require('react');
var ReactDOM = require('react-dom');
var Config = require('Config')
var url = Config.serverUrl
import AppStore from '../../../stores/AppStore.js';
import TopNavBar from '../../Misc/TopNavBar'
import UserAddressDisplay from './UserAddressDisplay.js'
var browserHistory = require('react-router').browserHistory;

export default class ManageAddressPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			addresses : []	
		}
	}

	componentDidMount() {
		// first check the password
		var form_data = JSON.stringify({
			"account_id" : AppStore.getCurrentUser().account_id,
			"jwt" : localStorage.jwt
		})
		$.ajax({
				type: "POST",
				url: url  + "/getUserAddress",
				data: form_data,
				success: function(data) {
					if (data) {
						this.setState({addresses : data.addresses})
						console.log(data)	
					}
					
				}.bind(this),
				error : function(){
					console.log("error")
				},
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});

	}

	render() {
		var address_display = this.state.addresses.map((address, index) => 
					<UserAddressDisplay address = {address}/>
				)

		return (
			<div>

				<TopNavBar />
				<div className = "container">
					{address_display}

					
				</div>
			</div>	
		)
	}
}

