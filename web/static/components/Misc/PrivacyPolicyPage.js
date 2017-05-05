var React = require('react');
var ReactDOM = require('react-dom');
import {} from 'react-bootstrap';
import TopNavBar from './TopNavBar.js'
import Footer from './Footer'


export default class PrivacyPolicyPage extends React.Component {
  constructor(props) {
	super(props);
	this.state = {
	  // show_modal: false
	}
  }


  render() {
	// class size 30 and centered 
	return (
		<div  id = "privacy-policy-container">
			<TopNavBar/>
			<div className = "container">
				<h2> Privacy Policy </h2>
				<h5> Lorem Ipsum </h5>
			</div>
			<Footer />
		</div>
	);
  }
}