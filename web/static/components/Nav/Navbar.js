var React = require('react');
var ReactDOM = require('react-dom');
import AppStore from '../../stores/AppStore'
import AccountDropdown from './AccountDropdown'
import NavbarSearch from './NavbarSearch'
const fab_logo = "https://web.archive.org/web/20140713231906im_/http://dnok91peocsw3.cloudfront.net/relaunch/fab_2_0_logo.png"
const edgar_logo = "https://s3-us-west-2.amazonaws.com/edgarusahomepage/logo.png"


export default class Navbar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cart_badge : 0,
		}
	}

	componentDidMount(){
		setInterval(function(){ 
			var current_cart_size = AppStore.getCurrentUser().cart_size
			if (current_cart_size != this.state.cart_badge){
				this.setState({cart_badge : AppStore.getCurrentUser().cart_size})	
			}
		}.bind(this), 1000)
		this.setState({cart_badge : AppStore.getCurrentUser().cart_size})
	}


	render() {
		var current_user = AppStore.getCurrentUser()
		return (
					<div className = "edgar-navbar">
						<div className = "container-fluid">
							<div className = "row">
								<div className = "col-sm-1 col-md-1 col-lg-1" id = "logo-column">
									<a href = "/">
										<img className = "edgar-logo" src = {edgar_logo}/>
									</a>
								</div>
								<div className = "vcenter col-sm-offset-1 col-md-offset-1 col-lg-offset-1 col-sm-6 col-md-6 col-lg-6">
									<div className="input-group input-group-lg">
										<span className="input-group-addon" id="basic-addon1"><span className = "glyphicon glyphicon-search" /></span>
										<NavbarSearch />
										
									</div>
								</div>
								<div id = "top-right-navigation" className = "col-md-2 col-lg-2 col-sm-2 home-right-nav pull-right">
									<div id="home-top-navigation-wrapper" className = "float-right">
									{ 
										(AppStore.getCurrentUser() && !AppStore.getCurrentUser().is_guest)?
										<ul id = "home-top-navigation">
											<li style = {{"position" :"relative", "top" : "-2px"}}>
												<a href="/myCart">
													<i className = "fa fa-shopping-cart" aria-hidden = {true}/>
													{/* <span className = "glyphicon glyphicon-shopping-cart"/> */}
													{this.state.cart_badge > 0 &&
														<span className="noOfProdInCartIcon crtLstNotification " style= {{"display": "block"}}> 
															{this.state.cart_badge}
														</span>
													}
												</a>
											</li>
											<li> 
												<AccountDropdown user = {AppStore.getCurrentUser()}/>
											</li>
											{/* <li><a href="/settings" id = "home-login-text">Account</a></li> */}
										</ul>
										:
										<ul id = "home-top-navigation">
											<li>
												<a href="/myCart">
													<i className = "fa fa-shopping-cart" aria-hidden = {true}/>
													{/* <span className = "glyphicon glyphicon-shopping-cart"/> */}
													{this.state.cart_badge > 0 &&
														<span className="noOfProdInCartIcon crtLstNotification " style= {{"display": "block"}}> 
															{this.state.cart_badge}
														</span>
													}
												</a>
											</li>
											
											<li><a href="/login" id = "home-login-text">Login</a></li>
										</ul>
									}
									</div>
								</div>
							</div>
							<div className = "small-buffer"/>
							<div className = "row">
								<nav className = "home-sub-menu">
									<div id="home-sub-navigation">
										<ul>
											<li><a href="#">Shop By Department</a></li>
											<li><a href="#">New Arrivals</a></li>
											<li><a href="#">Featured Design Deals</a></li>
											<li><a href="#">Clearance</a></li>
										</ul>
									</div>
								</nav>
							</div>
						</div>
					</div>
		);
	}
}