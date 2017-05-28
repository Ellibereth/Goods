var React = require('react');
var ReactDOM = require('react-dom');

var browserHistory = require('react-router').browserHistory
var Link = require('react-router').Link
import createHistory from 'history/createBrowserHistory'
const history = createHistory()

import {} from 'react-bootstrap';
import Breadcrumbs from './Breadcrumbs'


export default class SiteMap extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pathname : location.pathname.split('/')[1]
		}
		this.getSiteMap = this.getSiteMap.bind(this)
	}

	componentDidMount(){
		history.listen((location, action) => {
			console.log(`The current URL is ${location.pathname}${location.search}${location.hash}`)
			console.log(`The last navigation action was ${action}`)
		})
	}

	getSiteMap(){
		var pathname = this.state.pathname
		var routes = []
		var labels = []
		switch(pathname) {
			case "search":
				routes = [pathname]
				labels = ["Search"]
				break;
			case "Support":
				routes = [pathname]
				labels = ["Support"]
				break;
			case "recovery":
				routes = [pathname]
				labels = ["Set Password"]
				break;
			case "recoverAccount":
				routes = [pathname]
				labels = ["Recover Account"]
				break;
			case "confirmRequest":
				routes = [pathname]
				labels = ["Confirm Request"]
				break;
			case "confirmEmail":
				routes = [pathname]
				labels = ["Confirm Email"]
				break;
			case "privacy":
				routes = [pathname]
				labels = ["Privacy Policy"]
				break;
			case "terms":
				routes = [pathname]
				labels = ["Terms of Service"]
				break;
			case "eg":
				routes = [pathname]
				labels = ["Product"]
				break;
			case "register":
				routes = [pathname]
				labels = ["Register"]
				break;
			case "login":
				routes = [pathname]
				labels = ["Login"]
				break;
			case "settings":
				routes = [pathname]
				labels = ["Settings"]
				break;
			case "updateSettings":
				routes = ["settings", pathname]
				labels = ["Settings" , "Update Settings"]
				break;
			case "changePassword":
				routes = ["settings", pathname]
				labels = ["Settings" , "Change Password"]
				break;
			case "myOrders":
				routes = ["settings", pathname]
				labels = ["Settings" , "Past Orders"]
				break;
			case "billing":
				routes = ["settings", pathname]
				labels = ["Settings" , "Add Billing"]
				break;
			case "shipping":
				routes = ["settings", pathname]
				labels = ["Settings" , "Add Shipping"]
				break;
			case "myPlaces":
				routes = ["settings", pathname]
				labels = ["Settings" , "My Places"]
				break;
			case "myCards":
				routes = ["settings", pathname]
				labels = ["Settings" , "My Cards"]
				break;
			case "deleteAccount":
				routes = ["settings", pathname]
				labels = ["Settings" , "Delete Account"]
				break;
			case "myCart":
				routes = [pathname]
				labels = ["My Cart"]
				break;
			case "checkout":
				routes = [pathname]
				labels = ["Checkout"]
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