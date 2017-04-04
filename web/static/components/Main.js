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
import AdminPage from './Admin/AdminPage.js'
import PageNotFound from './Misc/PageNotFound.js'
import EmailConfirmationPage from './Confirmation/EmailConfirmation/EmailConfirmationPage.js'
import RequestConfirmationPage from './Confirmation/RequestConfirmation/RequestConfirmationPage.js'
import TermsOfServicePage from './Misc/TermsOfServicePage.js'
import PrivacyPolicyPage from './Misc/PrivacyPolicyPage.js'
import ProductPage from './Product/ProductPage.js'
import StorePage from './Store/StorePage.js'
import RegisterPage from './Account/Register/RegisterPage.js'
import LoginPage from './Account/Login/LoginPage.js'
import SettingsPage from './Account/Settings/SettingsPage.js'
import UpdateSettingsPage from './Account/Settings/UpdateSettingsPage.js'
import OrderHistoryPage from './Account/Settings/OrderHistoryPage.js'


export default class Main extends React.Component {
	render() {
		return (
			<div>
				{this.props.children}
			</div>);
	}
}


ReactDOM.render(  
	<Router history={ browserHistory }>
		<Route path='/' component={ Main }>
			<IndexRoute  component={() => <HomePage no_login = {true} />} />
			<Route path = 'test' component = {HomePage}/>
			<Route path = 'admin' component = {AdminPage}/>
			<Route path= "confirmRequest/:confirmation_id" component={RequestConfirmationPage}/>
			<Route path= "confirmEmail/:email_confirmation_id" component={EmailConfirmationPage}/>
			<Route path= "Store" component={StorePage}/>
			<Route path= "privacy" component={PrivacyPolicyPage}/>
			<Route path= "terms" component={TermsOfServicePage}/>
			<Route path= "eg/:product_id" component={ProductPage}/>
			<Route path = "register" component = {RegisterPage}/>
			<Route path = "login" component = {LoginPage}/>
			<Route path = "settings" component = {SettingsPage}/>
			<Route path = "updateSettings" component = {UpdateSettingsPage}/>

			<Route path = "orders" component = {OrderHistoryPage}/>
			<Route path= "*" component={PageNotFound} />
		</Route>
	</Router>, 
document.getElementById('app'));

