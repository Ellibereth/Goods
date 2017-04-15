var React = require('react');
var ReactDOM = require('react-dom');
var Config = require('Config')
var url = Config.serverUrl

import AppActions from '../../actions/AppActions.js'
import AppStore from '../../stores/AppStore.js'

import AdminTabs from './AdminTabs.js'
import AdminProductRequests from './AdminProductRequests/AdminProductRequests.js'
import AdminMarketProducts from './AdminMarketProducts/AdminMarketProducts.js'


export default class AdminToolsPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			current_user : {},
			selected_tab : "market_products"
		}
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
				<div>
					<AdminTabs selectedTab = {this.state.selected_tab} switchTabs = {this.switchTabs.bind(this)}/>
					{active_tab}
				</div>
			</div>
		);
	}
}