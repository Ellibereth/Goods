var React = require('react');
var ReactDOM = require('react-dom');
import {} from 'react-bootstrap';
import RequestModal from './RequestModal.js'


export default class HomePageRight extends React.Component {
  constructor(props) {
	super(props);
	this.state = {
	  // show_modal: false
	}
  }


  render() {
	// class size 30 and centered 
	return (
		<div>
			<h3> Send a request </h3>
			<h3> We'll get back to you with an American selection  </h3>
			<h3> We'll talk until you're happy  </h3>
		</div>
	);
  }
}