var React = require('react');
var ReactDOM = require('react-dom');
import {Button} from 'react-bootstrap';
import RequestModal from './RequestModal.js'


export default class HomePageFeedback extends React.Component {
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
			<center>
			<h1>
				Feedback
			</h1>	
			<h3>
			Any questions or suggestions?
			</h3>
			<br/>
			<Button>
				Let us know!
			</Button>
			</center>
		</div>
	);
  }
}