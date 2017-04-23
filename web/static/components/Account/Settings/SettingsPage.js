var React = require('react');
var ReactDOM = require('react-dom');
var Config = require('Config')
var url = Config.serverUrl
import AppStore from '../../../stores/AppStore.js';
import TopNavBar from '../../Misc/TopNavBar'
import UpdateSettingsPreview from './Personal/UpdateSettingsPreview.js'
import BillingPreview from './Billing/BillingPreview.js'
import PastOrdersPreview from './Orders/PastOrdersPreview.js'
import ShippingPreview from './Shipping/ShippingPreview'
var browserHistory = require('react-router').browserHistory;

export default class SettingsPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cards : [],
			addresses : []
		}
	}

	refreshProductInfo(){
	var form_data = JSON.stringify({
			"account_id" : AppStore.getCurrentUser().account_id,
			"jwt" : localStorage.jwt
		})
		$.ajax({
			type: "POST",
			url: url  + "/getCheckoutInformation",
			data: form_data,
			success: function(data) {
				console.log(data)
				if (data.success) {
					console.log(data)
					this.setState({
						cards : data.cards,
						addresses : data.addresses, 
					})
				}
				else {
					console.log("an error")
				}
			}.bind(this),
			error : function(){
				console.log("an internal server error")
			},
			dataType: "json",
			contentType : "application/json; charset=utf-8"
		});
	}

	componentDidMount(){
		this.refreshProductInfo.bind(this)()
	}

	render() {
		return (
			<div>
				<TopNavBar />
				<div className = "container">
					<h1> Your Account </h1> 
					<br/>

					<UpdateSettingsPreview  />
					<br/>

					<BillingPreview  cards = {this.state.cards} />
					<br />

					<ShippingPreview  addresses = {this.state.addresses}/>
					<br/>

					{/* <PastOrdersPreview /> */}
					

				</div>
			</div>	
		)
	}
}

