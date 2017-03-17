var React = require('react');
var ReactDOM = require('react-dom');
import {} from 'react-bootstrap';
import TopNavBar from '../Navbar/TopNavBar.js'


export default class PrivacyPolicy extends React.Component {
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
			<div clasName = "container">
				<h2> Privary Policy </h2>
				<h4> Lorem Ipsum </h4>
			</div>
		</div>
	);
  }
}