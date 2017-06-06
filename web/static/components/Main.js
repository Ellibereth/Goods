var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Link = require('react-router').Link;
var IndexRoute = require('react-router').IndexRoute;
var browserHistory = require('react-router').browserHistory;
import AppStore from '../stores/AppStore.js';
import AppActions from '../actions/AppActions.js';
import HomePage from './Home/HomePage.js'
import AdminLoginPage from './Admin/AdminLoginPage.js'
import PageNotFound from './Misc/PageNotFound.js'
import EmailConfirmationPage from './Account/Confirmation/EmailConfirmationPage.js'
import RequestConfirmationPage from './Account/Confirmation/RequestConfirmationPage.js'
import TermsOfServicePage from './Misc/TermsOfServicePage.js'
import PrivacyPolicyPage from './Misc/PrivacyPolicyPage.js'
import ProductPage from './Product/ProductPage.js'
// import StorePage from './Store/StorePage.js'
import RegisterPage from './Account/Register/RegisterPage.js'
import LoginPage from './Account/Login/LoginPage.js'
import SettingsPage from './Account/Settings/SettingsPage.js'
import UpdateSettingsPage from './Account/Settings/Personal/UpdateSettingsPage.js'
import OrderHistoryPage from './Account/Settings/Orders/OrderHistoryPage.js'
import ChangePasswordPage from './Account/Settings/Personal/ChangePasswordPage.js'
import LogoutPage from './Misc/LogoutPage.js'
import AdminProductPage from './Admin/AdminMarketProducts/ProductEdit/AdminProductPage.js'
import PleaseConfirmPage  from './Misc/PleaseConfirmPage.js'
import AdminToolsPage from './Admin/AdminToolsPage.js'
import UpdateBillingPage from './Account/Settings/Billing/UpdateBillingPage.js'
import ManageCardsPage from './Account/Settings/Billing/ManageCardsPage.js'
import UpdateShippingPage from './Account/Settings/Shipping/UpdateShippingPage.js'
import ManageAddressPage from './Account/Settings/Shipping/ManageAddressPage.js'
import ViewCartPage from './Account/Checkout/ViewCartPage.js'
import CheckoutPage from './Account/Checkout/CheckoutPage.js'
import CheckoutConfirmedPage from './Account/Checkout/Confirmed/CheckoutConfirmedPage'
import DeleteAccountPage from './Account/Settings/Personal/DeleteAccountPage'
import SearchPage from './Search/SearchPage'
import SupportPage from './CustomerService/SupportPage'
import RecoveryPage from './Account/Recovery/RecoveryPage'
import RecoveryChangePasswordPage from './Account/Recovery/RecoveryChangePasswordPage'
import ThanksPage from './Misc/ThanksPage'

export default class Main extends React.Component {
	
	componentDidMount() {
		this.getUserInfo()
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
					if (data.adjusted_items) {
						swal({
							title: "Sorry",
							text: "Some items in your cart have been removed due to inventory constraints",
							type : "error"
						})
					}
					AppActions.removeCurrentUser()
					AppActions.addCurrentUser(data.user, data.jwt)
				}

			}.bind(this),
			error : function(){
			},
			dataType: "json",
			contentType : "application/json; charset=utf-8"
		});
	}

	render() {
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
			<IndexRoute  component={HomePage} />
			<Route path = 'yevgeniypoker555/login' component = {AdminLoginPage}/>
			<Route path = 'yevgeniypoker555' onEnter = {checkAdmin} component = {AdminToolsPage}/>
			<Route path= "yevgeniypoker555/editProduct/:product_id" onEnter = {checkAdmin} component={AdminProductPage} />
			<Route path= "confirmRequest/:confirmation_id" component={RequestConfirmationPage}/>
			<Route path= "confirmEmail/:email_confirmation_id" component={EmailConfirmationPage}/>
			<Route path= "privacy" component={PrivacyPolicyPage}/>
			<Route path= "terms" component={TermsOfServicePage}/>
			<Route path= "eg/:product_id" component={ProductPage}/>
			<Route path = "register" component = {RegisterPage}/>
			<Route path = "login" component = {LoginPage}/>
			<Route path = "settings" onEnter = {checkUser} component = {SettingsPage}/>
			<Route path = "updateSettings" onEnter = {checkUser} component = {UpdateSettingsPage}/>
			<Route path = "changePassword" onEnter = {checkUser} component = {ChangePasswordPage}/>
			<Route path = "myOrders" onEnter = {checkUser} component = {OrderHistoryPage}/>
			<Route path= "logout" component={LogoutPage} />
			<Route path = "pleaseConfirm" component = {PleaseConfirmPage}/>
			<Route path = "billing" onEnter = {checkUser} component = {UpdateBillingPage} />
			<Route path = "deleteAccount" onEnter = {checkUser} component = {DeleteAccountPage} />
			<Route path = "myCards" onEnter = {checkUser} component = {ManageCardsPage} />
			<Route path = "shipping" onEnter = {checkUser} component = {UpdateShippingPage}/>
			<Route path = "myPlaces" onEnter = {checkUser} component = {ManageAddressPage}/>
			<Route path = "myCart" onEnter = {checkUser} component = {ViewCartPage} />
			<Route path = "checkout" onEnter = {checkConfirmedUser} component = {CheckoutPage} />
			<Route path = "checkoutConfirmed" onEnter = {checkConfirmedUser} component = {CheckoutConfirmedPage}/>
			<Route path = "search/:search_input" component = {SearchPage}/>
			<Route path = "support" component = {SupportPage}/>
			<Route path = "recoverAccount" component = {RecoveryPage}/>
			<Route path = "recovery/:recovery_pin" component = {RecoveryChangePasswordPage}/>
			<Route path = "thanks" component = {ThanksPage}/>
			<Route path= "*" component={PageNotFound} />
		</Route>
	</Router>, 
document.getElementById('app'));

