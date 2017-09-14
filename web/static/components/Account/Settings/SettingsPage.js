var React = require('react')
var ReactDOM = require('react-dom')
import AppStore from '../../../stores/AppStore.js'
import AppActions from '../../../actions/AppActions.js'
import PageContainer from '../../Misc/PageContainer'
import UpdateSettingsPreview from './Personal/UpdateSettingsPreview.js'
import BillingPreview from './Billing/BillingPreview.js'
import ShippingPreview from './Shipping/ShippingPreview'
import OrdersPreview from './Orders/OrdersPreview'
var browserHistory = require('react-router').browserHistory

export default class SettingsPage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			cards : [],
			addresses : [],
			orders: [],
			is_loading : true,
		}
		this.refreshSettings = this.refreshSettings.bind(this)
	}

	refreshSettings(){
		this.setState({is_loading : true})
		var form_data = JSON.stringify({
			'jwt' : localStorage.jwt
		})
		$.ajax({
			type: 'POST',
			url: '/refreshCheckoutInfo',
			data: form_data,
			success: function(data) {
				if (data.success) {
					AppActions.updateCurrentUser(data.user)
					this.setState({
						cards : data.user.cards,
						addresses : data.user.addresses,
						orders : data.user.orders ,
						cart: data.user.cart
					})
					this.refreshDisplay.bind(this)()
				}
				else {
				}
				this.setState({is_loading : false})
			}.bind(this),
			error : function(){
				ga('send', 'event', {
					eventCategory: ' server-error',
					eventAction: 'getUserInfo',
					eventLabel: AppStore.getCurrentUser().email
				})
			},
			dataType: 'json',
			contentType : 'application/json; charset=utf-8'
		})
	}

	componentDidMount(){
		this.refreshDisplay.bind(this)()
		
		this.setState({is_loading : false})

		if (AppStore.getCurrentUser().cards.length == 0 &&
			AppStore.getCurrentUser().addresses.length == 0) {
			this.refreshSettings.bind(this)()
		}
		
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

	setLoading(is_loading){
		this.setState({is_loading : is_loading})
	}


	render() {
		return (
			<PageContainer is_loading = {this.state.is_loading}>
				<div id = "settings-container">
					<h1 style = {{'margin-left': '14px'}}> Your Account </h1> 
					<br/>
					<UpdateSettingsPreview  />
					<br/>
					<div>
						<ShippingPreview 
							setLoading = {this.setLoading.bind(this)}
							is_loading = {this.state.is_loading}
							refreshSettings = {this.refreshSettings}
							addresses = {this.state.addresses}/>
						<br/>
						<BillingPreview
							setLoading = {this.setLoading.bind(this)}
							is_loading  = {this.state.is_loading}
							refreshSettings = {this.refreshSettings} 
							cards = {this.state.cards} />
						<br />
						<OrdersPreview orders = {this.state.orders} />
						<br/>
					</div>
				</div>
			</PageContainer>
		)
	}
}

