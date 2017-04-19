var React = require('react');
var ReactDOM = require('react-dom');
var Config = require('Config')
var url = Config.serverUrl
import AppStore from '../../../stores/AppStore.js';
import TopNavBar from '../../Misc/TopNavBar'
import UserCardDisplay from './UserCardDisplay.js'
var browserHistory = require('react-router').browserHistory;

export default class UpdateBillingPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cards : []	
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
				url: url  + "/getUserCards",
				data: form_data,
				success: function(data) {
					this.setState({cards : data.cards})
					console.log(data)
				}.bind(this),
				error : function(){
					console.log("error")
				},
				dataType: "json",
				contentType : "application/json; charset=utf-8"
			});

	}

	render() {
		var cards_display = this.state.cards.map((card, index) => 
					<UserCardDisplay card = {card}/>
				)

		return (
			<div>

				<TopNavBar />
				<div className = "container">
					{cards_display}

					
				</div>
			</div>	
		)
	}
}

