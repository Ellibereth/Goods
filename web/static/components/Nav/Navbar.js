var React = require('react')
var ReactDOM = require('react-dom')
import AppStore from '../../stores/AppStore'
import AccountDropdown from './AccountDropdown'
import NavbarSearch from './NavbarSearch'
import MobileNavBar from './MobileNavBar'
// const edgar_logo = "https://s3-us-west-2.amazonaws.com/edgarusahomepage/logo.png"
const edgar_logos = ['https://s3-us-west-2.amazonaws.com/edgarusahomepage/linda3.png']

export default class Navbar extends React.Component {
	constructor(props) {
		super(props)
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
		var rand_logo = edgar_logos[Math.floor(Math.random() * edgar_logos.length)]

		return (
			<div>
				<div className = "edgar-navbar hidden-xs">
					<div className = "container-fluid">
						<div className = "row">
							<div className = "col-xs-2 col-sm-1 col-md-1 col-lg-1" id = "logo-column">
								<a href = "/">
									<img className = "edgar-logo" src = {rand_logo}/>
								</a>
							</div>
							<div className = "vcenter col-xs-offset-2 col-sm-offset-1 col-md-offset-1 col-lg-offset-1 col-xs-4 col-sm-6 col-md-6 col-lg-6">
								
									<NavbarSearch 
									/>
							</div>
							<div id = "top-right-navigation" className = "col-xs-4 col-sm-4 col-md-4 col-lg-4g  home-right-nav pull-right">
								<div id="home-top-navigation-wrapper" className = "float-right">
									{ 
										(AppStore.getCurrentUser() && !AppStore.getCurrentUser().is_guest)?
											<ul id = "home-top-navigation">
												<li style = {{'position' :'relative', 'top' : '-2px'}}>
													<a href="/myCart">
														<i style = {{'fontSize' : '21px'}} className = "fa fa-shopping-cart" aria-hidden = {true}/>
														{this.state.cart_badge > 0 &&
														<span className="noOfProdInCartIcon crtLstNotification " style= {{'display': 'block'}}> 
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
														<i style = {{'fontSize' : '21px'}} className = "fa fa-shopping-cart" aria-hidden = {true}/>
														{/* <span className = "glyphicon glyphicon-shopping-cart"/> */}
														{this.state.cart_badge > 0 &&
														<span id = "cart_badge_number" className="noOfProdInCartIcon crtLstNotification" style= {{'display': 'block', 'left' : '215px'}}> 
															{this.state.cart_badge}
														</span>
														}
													</a>
												</li>
												<li><a href="/register" id = "home-register-text">Register</a></li>
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
										<li><a href="/listings/New_Arrivals">New Arrivals</a></li>
										<li><a href="/listings/Flash_Deals">Flash Deals</a></li>
										<li><a href="/listings/Only_On_Edgar_USA">Only on Edgar USA</a></li>
										<li><a href="/listings/All_Products">All Products</a></li>
										<li><a href="/listings/Last_Chance">Last Chance</a></li>
									</ul>
								</div>
							</nav>
						</div>
					</div>
				</div>
				<div className = "hidden-sm hidden-md hidden-lg">
					<MobileNavBar />
				</div>
			</div>
		)
	}
}