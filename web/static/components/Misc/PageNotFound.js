var React = require('react');
var ReactDOM = require('react-dom');
import {} from 'react-bootstrap';
import TopNavBar from './TopNavBar.js'

export default class PageNotFound extends React.Component {
  constructor(props) {
	super(props);
	this.state = {
	  show_modal: false
	}
  }




  render() {

	return (
		<div id = "error_page_container">
			<TopNavBar />
			<h1>
				What a prank! You tried to go to a bad page! <br/>
				Click <a href ="/"> here </a> to return to the home page.
			</h1>
		</div>
	);
  }
}