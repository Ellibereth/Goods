var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../../stores/AppStore.js';
import AppActions from '../../../actions/AppActions.js';
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
		this.setState({is_loading : true})
		var form_data = JSON.stringify({
				"jwt" : localStorage.jwt
			})
		$.ajax({
			type: "POST",
			url: "/getUserInfo",
			data: form_data,
			success: function(data) {
				if (data.success) {
					AppActions.removeCurrentUser()
					AppActions.addCurrentUser(data.user, data.jwt)

					this.setState({
						cards : data.user.cards,
						addresses : data.user.addresses,
						orders : data.user.orders ,
						cart: data.user.cart
					})
				}
				else {
					console.log("an error")
				}
				this.setState({is_loading : false})
			}.bind(this),
			error : function(){
				console.log("an internal server error")
			},
			dataType: "json",
			contentType : "application/json; charset=utf-8"
		});
	}

	componentDidMount(){
		// this.refreshSettings.bind(this)()
		this.refreshDisplay.bind(this)()
		this.setState({is_loading : false})
	}

	refreshDisplay() {
		var current_user = AppStore.getCurrentUser()
		this.setState({
			cards : current_user.cards,
			orders: current_user.orders,
			addresses: current_user.addresses,
			cart : current_user.cart
		})
	}


	render() {
		console.log(this.state.addresses.length)
		return (
			<PageContainer component = {
				<div id = "settings-container" 
				className = {this.state.is_loading ? "container faded" : "container"}
				>
					<h1> Your Account </h1> 
					<br/>
					<UpdateSettingsPreview  />
					<br/>
					{
						!this.state.is_loading && 
						<div>
							<BillingPreview
								is_loading  = {this.state.is_loading}
								refreshSettings = {this.refreshSettings} 
								cards = {this.state.cards} />
							<br />

							<ShippingPreview 
								is_loading = {this.state.is_loading}
								refreshSettings = {this.refreshSettings}
								addresses = {this.state.addresses}/>
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

