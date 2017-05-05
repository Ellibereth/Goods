var React = require('react');
var ReactDOM = require('react-dom');
import {} from 'react-bootstrap';
import PageContainer from './PageContainer'


export default class PrivacyPolicyPage extends React.Component {
  constructor(props) {
	super(props);
	this.state = {
	  // show_modal: false
	}
  }


  render() {
	// class size 30 and centered 
	var component = (
			<div className = "container">
				<h2> Privacy Policy </h2>
				<h5> Lorem Ipsum </h5>
			</div>
		)
	return (
		<PageContainer component = {component} />
	);
  }
}