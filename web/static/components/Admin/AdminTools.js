var React = require('react');
var ReactDOM = require('react-dom');
import {} from 'react-bootstrap'
import AdminNavBar from './AdminNavBar.js'
import AdminProductRequests from './AdminProductRequests.js'
import AdminMarketProducts from './AdminMarketProducts.js'
var Config = require('Config')
var url = Config.serverUrl
export default class AdminTools extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selected_tab : "requests"
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
	

	render() {

		var active_tab = this.getActiveTab.bind(this)()

		return (
			<div>
				<AdminNavBar  switchTabs = {this.switchTabs.bind(this)}/>
				{active_tab}
			</div>
		)
	}
}

