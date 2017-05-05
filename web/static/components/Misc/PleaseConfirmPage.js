var React = require('react');
var ReactDOM = require('react-dom');
import {} from 'react-bootstrap';
import PageContainer from './PageContainer'


export default class PleaseConfirmPage extends React.Component {
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
				<h2> Please confirm your account! </h2>
				<h2> Check your e-mail </h2>
				<h5> Then come back! </h5>
			</div>
		)
	return (
		<PageContainer component = {component} />
	);
  }
}