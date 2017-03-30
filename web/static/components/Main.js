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
import AdminPage from './Admin/AdminPAge.js'
import PageNotFound from './Misc/PageNotFound.js'
import EmailConfirmationPage from './Confirmation/EmailConfirmationPage.js'
import RequestConfirmationPage from './Confirmation/RequestConfirmationPage.js'
import TermsOfServicePage from './Misc/TermsOfServicePage.js'
import PrivacyPolicyPage from './Misc/PrivacyPolicyPage.js'
import ProductPage from './Product/ProductPage.js'

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
			<IndexRoute component={HomePage} />
			<Route path = 'admin' component = {AdminPage}/>
			<Route path= "confirmRequest/:confirmation_id" component={RequestConfirmationPage}/>
			<Route path= "confirmEmail/:email_confirmation_id" component={EmailConfirmationPage}/>
			<Route path= "privacy" component={PrivacyPolicyPage}/>
			<Route path= "terms" component={TermsOfServicePage}/>
			<Route path= "eg/:product_id" component={ProductPage}/>
			<Route path= "*" component={PageNotFound} />
		</Route>
	</Router>, 
document.getElementById('app'));

