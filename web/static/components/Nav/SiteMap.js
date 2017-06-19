var React = require('react');
var ReactDOM = require('react-dom');

var browserHistory = require('react-router').browserHistory
var Link = require('react-router').Link
import createHistory from 'history/createBrowserHistory'
const history = createHistory()

import Breadcrumbs from './Breadcrumbs'


export default class SiteMap extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pathname : location.pathname
		}
		this.getSiteMap = this.getSiteMap.bind(this)
	}

	componentDidMount(){
		
	}

	getSiteMap(){
		var pathname = this.state.pathname.split('/')
		var routes = []
		var labels = []
		switch(pathname[1]) {
			case "yevgeniypoker555":
				routes = [pathname[1]]
				labels = ["Admin"]
				if (pathname[2]) {
					switch (pathname[2]) {
						case "editProduct":
							routes.push(pathname[1] + "/" + pathname[2])
							labels.push("Product")
							break;
					}
				}
				
				break;

			case "search":
				routes = [pathname[1]]
				labels = ["Search"]
				break;
			case "support":
				routes = [pathname[1]]
				labels = ["Support"]
				break;
			case "recovery":
				routes = [pathname[1]]
				labels = ["Set Password"]
				break;
			case "recoverAccount":
				routes = [pathname[1]]
				labels = ["Recover Account"]
				break;
			case "confirmRequest":
				routes = [pathname[1]]
				labels = ["Confirm Request"]
				break;
			case "confirmEmail":
				routes = [pathname[1]]
				labels = ["Confirm Email"]
				break;
			case "privacy":
				routes = [pathname[1]]
				labels = ["Privacy Policy"]
				break;
			case "terms":
				routes = [pathname[1]]
				labels = ["Terms of Service"]
				break;
			case "eg":
				routes = [pathname[1]]
				labels = ["Product"]
				break;
			case "register":
				routes = [pathname[1]]
				labels = ["Register"]
				break;
			case "login":
				routes = [pathname[1]]
				labels = ["Login"]
				break;
			case "settings":
				routes = [pathname[1]]
				labels = ["Account"]
				break;
			case "updateSettings":
				routes = ["settings", pathname[1]]
				labels = ["Account" , "Update Settings"]
				break;
			case "changePassword":
				routes = ["settings", pathname[1]]
				labels = ["Account" , "Change Password"]
				break;
			case "myOrders":
				routes = ["settings", pathname[1]]
				labels = ["Account" , "Past Orders"]
				break;
			case "billing":
				routes = ["settings", pathname[1]]
				labels = ["Account" , "Add Billing"]
				break;
			case "shipping":
				routes = ["settings", pathname[1]]
				labels = ["Account" , "Add Shipping"]
				break;
			case "myPlaces":
				routes = ["settings", pathname[1]]
				labels = ["Account" , "My Places"]
				break;
			case "myCards":
				routes = ["settings", pathname[1]]
				labels = ["Account" , "My Cards"]
				break;
			case "deleteAccount":
				routes = ["settings", pathname[1]]
				labels = ["Account" , "Delete Account"]
				break;
			case "myCart":
				routes = [pathname[1]]
				labels = ["My Cart"]
				break;
			case "checkout":
				routes = ["myCart", pathname[1]]
				labels = ["My Cart", "Checkout"]
				break;
			default:
				return <div/>
		}

		labels.unshift("Home")
		routes.unshift("")

		return <Breadcrumbs labels = {labels} routes = {routes}/>

	}

	render() {
		var site_map = this.getSiteMap()

		return (
			<div className = "container-fluid">
				{site_map}
				<div className = "top-buffer"/>
			</div>
		)
	}
}