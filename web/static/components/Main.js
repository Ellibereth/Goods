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
import EmailConfirmationPage from './Confirmation/EmailConfirmation/EmailConfirmationPage.js'
import RequestConfirmationPage from './Confirmation/RequestConfirmation/RequestConfirmationPage.js'
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

export default class Main extends React.Component {
	
	componentWillMount() {
		var form_data =  JSON.stringify({
			jwt : localStorage.jwt
		})
		$.ajax({
			type: "POST",
			url: "/getUserInfo",
			data: form_data,
			success: function(data) {
				if (data.success) {
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

const checkConfirmedUser = (nextState, replace) => {
	var thisUser = AppStore.getCurrentUser();
	if (!thisUser) {
		replace(`/`)
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
			<Route path = 'adminLogin' component = {AdminLoginPage}/>
			<Route path = 'adminTools' onEnter = {checkAdmin} component = {AdminToolsPage}/>
			<Route path= "confirmRequest/:confirmation_id" component={RequestConfirmationPage}/>
			<Route path= "confirmEmail/:email_confirmation_id" component={EmailConfirmationPage}/>
			<Route path= "privacy" component={PrivacyPolicyPage}/>
			<Route path= "terms" component={TermsOfServicePage}/>
			<Route path= "eg/:product_id" component={ProductPage}/>
			<Route path = "register" component = {RegisterPage}/>
			<Route path = "login" component = {LoginPage}/>
			<Route path = "settings" onEnter = {checkConfirmedUser} component = {SettingsPage}/>
			<Route path = "updateSettings" onEnter = {checkConfirmedUser} component = {UpdateSettingsPage}/>
			<Route path = "changePassword" onEnter = {checkConfirmedUser} component = {ChangePasswordPage}/>
			<Route path = "myOrders" onEnter = {checkConfirmedUser} component = {OrderHistoryPage}/>
			<Route path= "logout" component={LogoutPage} />
			<Route path = "pleaseConfirm" component = {PleaseConfirmPage}/>
			<Route path= "adminEditProduct/:product_id" onEnter = {checkAdmin} component={AdminProductPage} />
			<Route path = "billing" onEnter = {checkConfirmedUser} component = {UpdateBillingPage} />
			<Route path = "myCards" onEnter = {checkConfirmedUser} component = {ManageCardsPage} />
			<Route path = "shipping" onEnter = {checkConfirmedUser} component = {UpdateShippingPage}/>
			<Route path = "myPlaces" onEnter = {checkConfirmedUser} component = {ManageAddressPage}/>
			<Route path = "myCart" onEnter = {checkConfirmedUser} component = {ViewCartPage} />
			<Route path = "checkout" onEnter = {checkConfirmedUser} component = {CheckoutPage} />
			<Route path = "checkoutConfirmed" onEnter = {checkConfirmedUser} component = {CheckoutConfirmedPage}/>
			<Route path= "*" component={PageNotFound} />
		</Route>
	</Router>, 
document.getElementById('app'));

