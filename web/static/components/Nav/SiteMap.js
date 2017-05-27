var React = require('react');
var ReactDOM = require('react-dom');

var browserHistory = require('react-router').browserHistory
var Link = require('react-router').Link
import {} from 'react-bootstrap';


export default class SiteMap extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
		this.getSiteMap = this.getSiteMap.bind(this)
	}

	getSiteMap(){
		var pathname = location.pathname
		var first_path = pathname.split('/')
		switch(pathname) {
			case "search":
				return <Link to = {'/' + pathname}> Search </Link>
			case "Support":
				return <Link to = {'/' + pathname}> Support </Link>
			case "recovery":
				return <Link to = {'/' + pathname}> Change Password </Link>
			case "recoverAccount":
				return <Link to = {'/' + pathname}> Recover Account </Link>
			case "confirmRequest":
				return <Link to = {'/' + pathname}> Confirm Request </Link>
			case "confirmEmail":
				return <Link to = {'/' + pathname}> Confirm Email </Link>
			case "privacy":
				return <Link to = {'/' + pathname}> Privacy Policy </Link>
			case "terms":
				return <Link to = {'/' + pathname}> Terms of Service </Link>
			case "eg":
				return <Link to = {'/' + pathname}> Product </Link>
			case "register":
				return <Link to = {'/' + pathname}> Register </Link>
			case "login":
				return <Link to = {'/' + pathname}> Login </Link>
			case "settings":
				return <Link to = {'/' + pathname}> Settings </Link>
			case "updateSettings":
				return <Link to = {'/' + pathname}> Personal </Link>
			case "changePassword":
				return <Link to = {'/' + pathname}> Change Password </Link>
			case "myOrders":
				return <Link to = {'/' + pathname}> Past Orders </Link>
			case "billing":
				return <Link to = {'/' + pathname}> Add Billing </Link>
			case "shipping":
				return <Link to = {'/' + pathname}> Add Shipping </Link>
			case "myPlaces":
				return <Link to = {'/' + pathname}> Shipping </Link>
			case "myCards":
				return <Link to = {'/' + pathname}> Billing </Link>
			case "deleteAccount":
				return <Link to = {'/' + pathname}> Delete Account </Link>
			case "myCart":
				return <Link to = {'/' + pathname}> My Cart </Link>
			case "checkout":
				return <Link to = {'/' + pathname}> Checkout </Link>
			default:
				return <Link to = {'/'}> Home </Link>
		}

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