var React = require('react');
var ReactDOM = require('react-dom');
import {Button} from 'react-bootstrap';
import RequestModal from './RequestModal.js'


export default class HomePageNewProduct extends React.Component {
  constructor(props) {
	super(props);
	this.state = {
	  // show_modal: false
	}
  }


  render() {
	// class size 30 and centered 
	// will show our other products
	// find more
	return (
		<div>
			<center>
				<h1> Edgar USA </h1>
				<h3> Full Store  </h3>
				<h3> Coming soon! </h3>
			</center>
		</div>
	);
  }
}