var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Link = require('react-router').Link;
var IndexRoute = require('react-router').IndexRoute;
var browserHistory = require('react-router').browserHistory;
import {AlertMessages} from './Misc/AlertMessages'

import AppStore from '../stores/AppStore.js';
import AppActions from '../actions/AppActions.js';
import HomePage from './Home/HomePage.js'
import ProductPage from './Product/ProductPage.js'

import AdminLoginPage from './Admin/AdminLoginPage.js'
import AdminProductPage from './Admin/AdminMarketProducts/ProductEdit/AdminProductPage.js'
import AdminToolsPage from './Admin/AdminToolsPage.js'
import AdminEmailListPage from './Admin/EmailList/AdminEmailListPage'
import PageNotFound from './Misc/PageNotFound.js'

import RegisterPage from './Account/Login/RegisterPage.js'
import LoginPage from './Account/Login/LoginPage.js'
import ViewCartPage from './Account/Checkout/ViewCartPage.js'
import CheckoutPage from './Account/Checkout/CheckoutPage.js'
import LogoutPage from './Misc/LogoutPage.js'

import SettingsPage from './Account/Settings/SettingsPage.js'
import EmailConfirmationPage from './Account/Confirmation/EmailConfirmationPage.js'
import RequestConfirmationPage from './Account/Confirmation/RequestConfirmationPage.js'
import TermsOfServicePage from './Misc/TermsOfServicePage.js'
import PrivacyPolicyPage from './Misc/PrivacyPolicyPage.js'
import UpdatePersonalPage from './Account/Settings/Personal/UpdatePersonalPage.js'
import OrderHistoryPage from './Account/Settings/Orders/OrderHistoryPage.js'
import PleaseConfirmPage    from './Misc/PleaseConfirmPage.js'
import UpdateBillingPage from './Account/Settings/Billing/UpdateBillingPage.js'
import UpdateShippingPage from './Account/Settings/Shipping/UpdateShippingPage.js'
import CheckoutConfirmedPage from './Account/Checkout/Confirmed/CheckoutConfirmedPage'
import SearchPage from './Search/SearchPage'
import SupportPage from './CustomerService/SupportPage'
import RecoveryPage from './Account/Recovery/RecoveryPage'
import RecoveryChangePasswordPage from './Account/Recovery/RecoveryChangePasswordPage'
import LandingPage from './Landing/LandingPage'
import RequestProductPage from './CustomerService/RequestProductPage'
import FaqPage from './CustomerService/FaqPage'
import AboutUsPage from './CustomerService/AboutUsPage'
import ContactUsPage from './CustomerService/ContactUsPage'
import SalesPage from './Sales/SalesPage.js'
import ProductListingsPage from './Listings/ProductListingsPage'
import MadeInUsaPage from './CustomerService/MadeInUsaPage'
import SuggestProductPage from './CustomerService/SuggestProductPage'
import CareersPage from './CustomerService/CareersPage'
import VendorsPage from './CustomerService/VendorsPage'
import SellWithEdgarPage from './CustomerService/SellWithEdgarPage'
import ReturnPolicyPage from './CustomerService/ReturnPolicyPage'


export default class Main extends React.Component {
	
	componentDidMount() {
		var pathname = this.props.location.pathname
		if (pathname != "/checkout"){
			this.getUserInfo()
		}
	}

	getUserInfo(){

		var form_data =  JSON.stringify({
			jwt : localStorage.jwt
		})
		$.ajax({
			type: "POST",
			url: "/getUserInfo",
			data: form_data,
			success: function(data) {
				if (data.success) {
					AppActions.updateCurrentUser(data.user)
					if (data.adjusted_items) {
						var message = ""
						data.adjusted_items.map((item) => {
							if (!item.num_items){
								message = message + "Unfortunately " + item.name + " has been removed from your cart \n"
							}
							else {
								message = message + " We have only " + item.num_items + " of " + item.name + " left \n"
							}
						})
						swal(
							AlertMessages.ITEMS_IN_CART_HAVE_BEEN_MODIFIED(message),
							function (isConfirm) {
								window.location = '/myCart'
							}.bind(this))
						}
					
				}
				else {
					console.log("failure to laod user, logging out")
					AppActions.removeCurrentUser()
					window.location = "/"
				}

			}.bind(this),
			error : function(){
				ga('send', 'event', {
					eventCategory: ' server-error',
					eventAction: 'getUserInfo',
					eventLabel: AppStore.getCurrentUser().email
				});
			},
			dataType: "json",
			contentType : "application/json; charset=utf-8"
		});
	}

	render() {
		console.log(localStorage.jwt, AppStore.getCurrentUser())
		return (
			<div>
				{this.props.children}
			</div>
		);
	}
}

const checkUser = (nextState, replace) => {
	var target = nextState.location.pathname.replace("/", "")
	var thisUser = AppStore.getCurrentUser();
	if (!thisUser) {
		replace({pathname: '/login', query: { target: target}})
	} 
	else  if (thisUser.is_guest) {
		replace({pathname: '/login', query: { target: target}})	
	}
	else if (thisUser.is_admin){
		replace({pathname: '/login', query: { target: target}})	
	}
}

const checkUserAllowGuest = (nextState, replace) => {
	var target = nextState.location.pathname.replace("/", "")
	var thisUser = AppStore.getCurrentUser();
	if (!thisUser) {
		replace({pathname: '/login', query: { target: target}})
	} 
} 

const checkConfirmedUser = (nextState, replace) => {
	var target = nextState.location.pathname.replace("/", "")
	var thisUser = AppStore.getCurrentUser();
	if (!thisUser) {
		replace({pathname: '/login', query: { target: target}})
	}
	else if (!thisUser.email_confirmed) {
		replace(`/pleaseConfirm`);
	}
}

const checkAdmin = (nextState, replace) => {
	var thisUser = AppStore.getCurrentUser();
	if (!thisUser) {
		replace(`/`)
	}
	if (!thisUser.is_admin) {
		replace(`/`);
	}
}


ReactDOM.render(    
	<Router history={ browserHistory }>
		<Route path='/' component={ Main }>
			<IndexRoute component={HomePage} />
			

			<Route path = "landing" component = {LandingPage}/>
			<Route path = "support" component = {SupportPage}/>
			<Route path= "privacy" component={PrivacyPolicyPage}/>
			
			<Route path= "terms" component={TermsOfServicePage}/>
			
			<Route path = "contact" component = {ContactUsPage}/>
			<Route path = "about" component = {AboutUsPage}/>
			<Route path = "usa" component = {MadeInUsaPage}/>
				
			<Route path= "eg/:product_id" component={ProductPage}/>
			<Route path = 'yevgeniypoker555/login' component = {AdminLoginPage}/>
			<Route path = 'yevgeniypoker555' onEnter = {checkAdmin} component = {AdminToolsPage}/>
			<Route path= "yevgeniypoker555/editProduct/:product_id" onEnter = {checkAdmin} component={AdminProductPage} />
			<Route path= "yevgeniypoker555/editEmailList/:email_list_id" onEnter = {checkAdmin} component={AdminEmailListPage} />
			<Route path= "logout" component={LogoutPage} />
			<Route path = "register" component = {RegisterPage}/>
			<Route path = "login" component = {LoginPage}/>
			<Route path = "myCart" component = {ViewCartPage} />
			<Route path = "checkout" onEnter = {checkConfirmedUser} component = {CheckoutPage} />
			<Route path = "settings" onEnter = {checkUser} component = {SettingsPage}/>
			<Route path= "confirmRequest/:confirmation_id" component={RequestConfirmationPage}/>
			<Route path= "confirmEmail/:email_confirmation_id" component={EmailConfirmationPage}/>
			
			<Route path = "updatePersonal" onEnter = {checkUser} component = {UpdatePersonalPage}/>
			<Route path = "myOrders" onEnter = {checkUser} component = {OrderHistoryPage}/>
			<Route path = "pleaseConfirm" component = {PleaseConfirmPage}/>
			<Route path = "billing" onEnter = {checkUser} component = {UpdateBillingPage} />
			<Route path = "shipping" onEnter = {checkUser} component = {UpdateShippingPage}/>
			<Route path = "checkoutConfirmed" onEnter = {checkConfirmedUser} component = {CheckoutConfirmedPage}/>
			<Route path = "search/:search_input" component = {SearchPage}/>
			
			<Route path = "recoverAccount" component = {RecoveryPage}/>
			<Route path = "recovery/:recovery_pin" component = {RecoveryChangePasswordPage}/>
			<Route path = "requestProduct" component = {RequestProductPage}/>
			<Route path = "faq" component = {FaqPage}/>
			<Route path = "sales" component = {SalesPage}/> 
			<Route path = "listings/:tag" component = {ProductListingsPage}/>
			<Route path = "suggestProduct" component = {SuggestProductPage}/>
			<Route path = "careers" component = {CareersPage}/>
			<Route path = "vendors" component = {VendorsPage}/>
			<Route path = "sellWithEdgar" component = {SellWithEdgarPage}/>
			<Route path = "returnPolicy" component = {ReturnPolicyPage}/>
			<Route path= "*" component={PageNotFound} />  
			
		</Route>
	</Router>, 
document.getElementById('app'));

