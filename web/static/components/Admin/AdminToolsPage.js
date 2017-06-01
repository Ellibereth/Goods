var React = require('react');
var ReactDOM = require('react-dom');

import AppActions from '../../actions/AppActions.js'
import AppStore from '../../stores/AppStore.js'

import AdminTabs from './AdminTabs.js'
import AdminProductRequests from './AdminProductRequests/AdminProductRequests.js'
import AdminMarketProducts from './AdminMarketProducts/AdminMarketProducts.js'

import PageContainer from '../Misc/PageContainer'

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
		var form_data = JSON.stringify({"jwt" : localStorage.jwt})
		$.ajax({
			type: "POST",
			url: "/checkAdminJwt",
			data: form_data,
			success: function(data) {
				if (!data.success){
					browserHistory.push('/')	
				}
			}.bind(this),
			error : function(){
				replace('/')
		  	},
			dataType: "json",
			contentType : "application/json; charset=utf-8"
		});
	}

	render() {
		var active_tab = this.getActiveTab.bind(this)()
		return (
			<PageContainer component = {
				<div className = "container">
					<AdminTabs selectedTab = {this.state.selected_tab} switchTabs = {this.switchTabs.bind(this)}/>
					{active_tab}
				</div>
			}/>
			
		);
	}
}