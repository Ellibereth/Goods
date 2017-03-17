var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Link = require('react-router').Link;
var IndexRoute = require('react-router').IndexRoute;
var browserHistory = require('react-router').browserHistory;
import HomeApp from './Home/HomeApp.js'
import AdminApp from './Admin/AdminApp.js'
import PageNotFound from './Misc/PageNotFound.js'
import EmailConfirmationPage from './Confirmation/EmailConfirmationPage.js'
import RequestConfirmationPage from './Confirmation/RequestConfirmationPage.js'
import TermsOfService from './Misc/TermsOfService.js'
import PrivacyPolicy from './Misc/PrivacyPolicy.js'



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
			<IndexRoute component={HomeApp} />
			<Route path = 'admin' component = {AdminApp}/>
			<Route path= "confirmRequest/:confirmation_id" component={RequestConfirmationPage}/>
			<Route path= "confirmEmail/:email_confirmation_id" component={EmailConfirmationPage}/>
			<Route path= "privacy" component={PrivacyPolicy}/>
			<Route path= "terms" component={TermsOfService}/>
			<Route path= "*" component={PageNotFound} />
		</Route>
	</Router>, 
document.getElementById('app'));

