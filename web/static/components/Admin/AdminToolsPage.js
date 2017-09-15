var React = require('react')
var ReactDOM = require('react-dom')

import AppActions from '../../actions/AppActions.js'
import AppStore from '../../stores/AppStore.js'

import AdminProductRequests from './AdminProductRequests/AdminProductRequests.js'
import AdminMarketProducts from './AdminMarketProducts/AdminMarketProducts.js'
import AdminHome from './AdminHome'
import PageContainer from '../Misc/PageContainer'
import AddProductForm from './AdminMarketProducts/ProductAdd/AddProductForm'
import AddManufacturerForm from './AdminManufacturers/ManufacturerAdd/AddManufacturerForm'
import AdminManufacturers from './AdminManufacturers/AdminManufacturers'

import Nav, NavItem, Button from 'react-bootstrap'

const REQUEST_INDEX = 0
const ACTIVE_PRODUCT_INDEX = 1
const INACTIVE_PRODUCT_INDEX = 2
const ADD_PRODUCT_INDEX = 3
const MANUFACTURER_INDEX = 4
const ADD_MANUFACTURER_INDEX = 5

export default class AdminToolsPage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			current_user : {},
			selected_tab : ACTIVE_PRODUCT_INDEX,
			products:  [],
			email_list_data : [],
			manufacturers : []
		}
	}



	switchTabs(tab){
		this.setState({selected_tab : tab})
	}
	

	componentDidMount() {	
		var form_data = JSON.stringify({'jwt' : localStorage.jwt})
		$.ajax({
			type: 'POST',
			url: '/checkAdminJwt',
			data: form_data,
			success: function(data) {
				if (!data.success){
					window.location = '/'
				}
				else {
					this.initializeData.bind(this)()
				}
			}.bind(this),
			error : function(){
				window.location = '/'
			},
			dataType: 'json',
			contentType : 'application/json; charset=utf-8'
		})
	}

	initializeData(){
		this.initializeProducts.bind(this)()
		this.initializeEmailList.bind(this)()
		this.initializeManufacturers.bind(this)()
	}

	initializeEmailList() {
		var form_data = JSON.stringify({'jwt' : localStorage.jwt})
		$.ajax({
			type: 'POST',
			url: '/getAllEmailListData',
			data: form_data,
			success: function(data) {
				this.setState({
					email_list_data : data.email_list_data
				})
			}.bind(this),
			error : function(){

			},
			dataType: 'json',
			contentType : 'application/json; charset=utf-8'
		})
	}

	initializeManufacturers() {
		var form_data = JSON.stringify({
			'jwt' : localStorage.jwt
		})
		$.ajax({
			  type: 'POST',
			  url: '/getManufacturers',
			  data : form_data,
			  success: function(data) {
				this.setState({
					manufacturers: data,
				})
			  }.bind(this),
			  error : function(){

			  },
			  dataType: 'json',
			  contentType : 'application/json; charset=utf-8'
		})
	}

	initializeProducts() {
		var form_data = JSON.stringify({
			'jwt' : localStorage.jwt
		})
		$.ajax({
			  type: 'POST',
			  url: '/getMarketProducts',
			  data : form_data,
			  success: function(data) {
				this.setState({
					products: data,

				})
			  }.bind(this),
			  error : function(){

			  },
			  dataType: 'json',
			  contentType : 'application/json; charset=utf-8'
		})
	}


	render() {
		return (
			<PageContainer>
				<div className = "container">
					<Nav bsStyle="pills" activeKey={this.state.selected_tab} onSelect={this.switchTabs.bind(this)}>
						<NavItem eventKey= {REQUEST_INDEX}> Requests </NavItem>
						<NavItem eventKey= {ACTIVE_PRODUCT_INDEX}> Active Products </NavItem>	
						<NavItem eventKey= {INACTIVE_PRODUCT_INDEX}> Not Active Products </NavItem>	
						<NavItem eventKey= {MANUFACTURER_INDEX}> Manufacturers </NavItem>	
						<NavItem eventKey= {ADD_PRODUCT_INDEX}> Add Product </NavItem>
						<NavItem eventKey= {ADD_MANUFACTURER_INDEX}> Add Manufacturer </NavItem>	
						
					</Nav>
					<div className = "top-buffer"/>
					<div className = {this.state.selected_tab != REQUEST_INDEX && 'none'} > 
						<AdminProductRequests />
					</div>
					<div className = {this.state.selected_tab != ACTIVE_PRODUCT_INDEX && 'none'} > 
						<AdminMarketProducts products = {this.state.products} active = {true}/>
					</div>
					<div className = {this.state.selected_tab != INACTIVE_PRODUCT_INDEX && 'none'} > 
						<AdminMarketProducts products = {this.state.products} active = {false} />
					</div>

					<div className = {this.state.selected_tab != MANUFACTURER_INDEX && 'none'} > 
						<AdminManufacturers manufacturers = {this.state.manufacturers} />
					</div>

					<div className = {this.state.selected_tab != ADD_PRODUCT_INDEX && 'none'} > 
						<AddProductForm  />
					</div>

					<div className = {this.state.selected_tab != ADD_MANUFACTURER_INDEX && 'none'} > 
						<AddManufacturerForm  />
					</div>


					

				</div>
			</PageContainer>	
		)
	}
}