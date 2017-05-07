var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../stores/AppStore.js';
import PageContainer from '../../Misc/PageContainer'
import UpdateSettingsPreview from './Personal/UpdateSettingsPreview.js'
import BillingPreview from './Billing/BillingPreview.js'
import ShippingPreview from './Shipping/ShippingPreview'
import OrdersPreview from './Orders/OrdersPreview'
var browserHistory = require('react-router').browserHistory;

export default class SettingsPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cards : [],
			addresses : [],
			orders: [],
			is_loading : true
		}
		this.refreshSettings = this.refreshSettings.bind(this)
	}

	refreshSettings(){
		this.setState({is_loading : false})
		$('#settings-container').addClass("faded");
		var form_data = JSON.stringify({
				"account_id" : AppStore.getCurrentUser().account_id,
				"jwt" : localStorage.jwt
			})
		$.ajax({
			type: "POST",
			url: "/getSettingsInformation",
			data: form_data,
			success: function(data) {
				if (data.success) {
					this.setState({
						cards : data.cards,
						addresses : data.addresses,
						orders : data.orders 
					})
				}
				else {
					console.log("an error")
				}
				this.setState({is_loading : false})
				$('#settings-container').removeClass("faded");
			}.bind(this),
			error : function(){
				console.log("an internal server error")
			},
			dataType: "json",
			contentType : "application/json; charset=utf-8"
		});
	}

	componentDidMount(){
		this.refreshSettings.bind(this)()
	}

	render() {
		return (
			<PageContainer component = {
				<div id = "settings-container" className = "container faded">
					<h1> Your Account </h1> 
					<br/>
					<UpdateSettingsPreview  />
					<br/>
					{
						!this.state.is_loading && 
						<div>
							<BillingPreview refreshSettings = {this.refreshSettings} cards = {this.state.cards} />
							<br />

							<ShippingPreview refreshSettings = {this.refreshSettings} addresses = {this.state.addresses}/>
							<br/>

							<OrdersPreview orders = {this.state.orders} />
							<br/>
						</div>
					}
				</div>
			}/>
		)
	}
}

