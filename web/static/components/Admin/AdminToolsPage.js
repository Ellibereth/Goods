var React = require('react');
var ReactDOM = require('react-dom');

import AppActions from '../../actions/AppActions.js'
import AppStore from '../../stores/AppStore.js'

import AdminProductRequests from './AdminProductRequests/AdminProductRequests.js'
import AdminMarketProducts from './AdminMarketProducts/AdminMarketProducts.js'

import PageContainer from '../Misc/PageContainer'

const REQUEST_INDEX = 0
const ACTIVE_PRODUCT_INDEX = 1
const INACTIVE_PRODUCT_INDEX = 2

import {Nav, NavItem} from 'react-bootstrap'

export default class AdminToolsPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			current_user : {},
			selected_tab : ACTIVE_PRODUCT_INDEX,
			products:  [],
		}
	}



	switchTabs(tab){
		this.setState({selected_tab : tab})
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
				else {
					this.initializeInformation.bind(this)()
				}
			}.bind(this),
			error : function(){
				replace('/')
				},
			dataType: "json",
			contentType : "application/json; charset=utf-8"
		});
	}

	initializeInformation() {
		var form_data = JSON.stringify({
			"jwt" : localStorage.jwt
		})
			$.ajax({
			  type: "POST",
			  url: "/getMarketProducts",
			  data : form_data,
			  success: function(data) {
				this.setState({
					products: data,

				})
			  }.bind(this),
			  error : function(){
				console.log("error")
			  },
			  dataType: "json",
			  contentType : "application/json; charset=utf-8"
			});
	}


	render() {
		return (
			<PageContainer component = {
				<div className = "container">
					<Nav bsStyle="pills" activeKey={this.state.selected_tab} onSelect={this.switchTabs.bind(this)}>
						<NavItem eventKey= {REQUEST_INDEX}> Requests </NavItem>
						<NavItem eventKey= {ACTIVE_PRODUCT_INDEX}> Active Products </NavItem>	
						<NavItem eventKey= {INACTIVE_PRODUCT_INDEX}> Not Active Products </NavItem>	
					</Nav>
					<div className = "top-buffer"/>
					<div className = {this.state.selected_tab != REQUEST_INDEX && "none"} > 
						<AdminProductRequests />
					</div>
					<div className = {this.state.selected_tab != ACTIVE_PRODUCT_INDEX && "none"} > 
						<AdminMarketProducts products = {this.state.products} active = {true}/>
					</div>
					<div className = {this.state.selected_tab != INACTIVE_PRODUCT_INDEX && "none"} > 
						<AdminMarketProducts products = {this.state.products} active = {false} />
					</div>
					
				</div>
			}/>
			
		);
	}
}