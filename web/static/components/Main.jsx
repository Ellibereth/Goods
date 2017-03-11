var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Link = require('react-router').Link;
var IndexRoute = require('react-router').IndexRoute;
var browserHistory = require('react-router').browserHistory;
import ProductSubmissionForm from './ProductSubmissionForm/ProductSubmissionForm.jsx'

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
      <IndexRoute component={ ProductSubmissionForm } />
    </Route>
  </Router>, document.getElementById('app'));

