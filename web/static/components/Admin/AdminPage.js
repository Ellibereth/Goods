var React = require('react');
var ReactDOM = require('react-dom');
var Config = require('Config')
var url = Config.serverUrl

import AppActions from '../../actions/AppActions.js'
import AppStore from '../../stores/AppStore.js'

import AdminLogin from './AdminLogin.js'
import AdminTabs from './AdminTabs.js'
import AdminProductRequests from './AdminProductRequests/AdminProductRequests.js'
import AdminMarketProducts from './AdminMarketProducts/AdminMarketProducts.js'


export default class AdminPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			access_granted : false,
			current_user : {},
			selected_tab : "market_products"
		}
	}

	// this has to be moved to the server side, will do when I'm back from dinner 3/11
	onLoginSubmit(username, password) {
		var form_data = JSON.stringify({
			'username' : username,
			'password' : password 
		})
		$.ajax({
			type: "POST",
			data: form_data,
			url: url + "/checkAdminLogin",
			success: function(data) {
				if (data.success) {
					AppActions.addCurrentUser({isAdmin : true})
					// var test = AppStore.getCurrentUser()
					this.setState({access_granted : true})
				}
				else {
					swal("nice try!")
				}
			}.bind(this),
			dataType: "json",
			contentType : "application/json; charset=utf-8"
		})
	}

	switchTabs(tab){
		this.setState({selected_tab : tab})
	}
	

	getActiveTab(){
		var active_tab;
		switch(this.state.selected_tab) {
		    case "requests":
		        active_tab = <AdminProductRequests />
		        break;
		    case "market_products":
		        active_tab = <AdminMarketProducts />
		        break;
		    default:
		        active_tab = <AdminProductRequests />
		        break;
		}
		return active_tab
	}
	

	componentDidMount() {	
		var current_user = AppStore.getCurrentUser()
		this.setState({current_user : current_user})
		if (current_user != ""){
			if (current_user['isAdmin']){
				this.setState({access_granted : true})
			}
		}
	}

	render() {
		var active_tab = this.getActiveTab.bind(this)()
		return (
			<div>
				{ !this.state.access_granted && <AdminLogin onLoginSubmit = {this.onLoginSubmit.bind(this)}/> }
				{ this.state.access_granted &&  
					<div>
						<AdminTabs selectedTab = {this.state.selected_tab} switchTabs = {this.switchTabs.bind(this)}/>
						{active_tab}
					</div>
				}
			</div>
		);
	}
}