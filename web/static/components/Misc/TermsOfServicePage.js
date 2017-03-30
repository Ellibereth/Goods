var React = require('react');
var ReactDOM = require('react-dom');
import {} from 'react-bootstrap';
import TopNavBar from '../Navbar/TopNavBar.js'


export default class TermsOfServicePage extends React.Component {
  constructor(props) {
	super(props);
	this.state = {
	  // show_modal: false
	}
  }


  render() {
	// class size 30 and centered 
	return (
		<div  id = "terms-service-container">
			<TopNavBar/>
			<div className = "container">
				<h2> Terms of Service </h2>
				<h5> Lorem Ipsum </h5>
			</div>
		</div>
	);
  }
}