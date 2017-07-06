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
			pathname : location.pathname,
			product_name : ""
		}
		this.getSiteMap = this.getSiteMap.bind(this)
	}

	componentDidMount(){
		var pathname = this.state.pathname.split('/')
		if (pathname[1] == "eg"){
			this.getProductName(pathname[2])
		}
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
						case "editEmailList":
							routes.push(pathname[1] + "/" + pathname[2])
							labels.push("Email List")
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
				var product_name = this.state.product_name
				if (!product_name) {
					product_name = "Product"
				}
				routes = [pathname[1]]
				labels = [product_name]
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
			case "updatePersonal":
				routes = ["settings", pathname[1]]
				labels = ["Account" , "Personal"]
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
			case "myCart":
				routes = [pathname[1]]
				labels = ["My Cart"]
				break;
			case "checkout":
				routes = ["myCart", pathname[1]]
				labels = ["My Cart", "Checkout"]
				break;

			case "faq":
				routes = [pathname[1]]
				labels = ["FAQ"]
				break;

			case "about":
				routes = [pathname[1]]
				labels = ["About Us"]
				break;

			case "contact":
				routes = [pathname[1]]
				labels = ["Contact Us"]
				break;

			case "requestProduct":
				routes = [pathname[1]]
				labels = ["Request Product"]
				break;

			default:
				return <div/>
		}

		labels.unshift("Home")
		routes.unshift("")

		return ( 
			<div>
				<Breadcrumbs labels = {labels} routes = {routes}/>
				<div className = "top-buffer"/>
			</div>
		)

	}


	getProductName(product_id) {
		var form_data = JSON.stringify({
			"product_id" : product_id,
		})

		$.ajax({
		  type: "POST",
		  url: "/getMarketProductInfo",
		  data: form_data,
		  success: function(data) {
			if (data.success) {
				this.setState({product_name : data.product.name})
			}
		}.bind(this),
		error : function(){
			ga('send', 'event', {
				eventCategory: ' server-error',
				eventAction: 'getMarketProductInfo'
			});
		},
		dataType: "json",
		contentType : "application/json; charset=utf-8"
		});
	}

	render() {
		var site_map = this.getSiteMap.bind(this)()

		return (
			<div className = "container-fluid">
				{site_map}
			</div>
		)
	}
}