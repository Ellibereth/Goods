var React = require('react');
var ReactDOM = require('react-dom');
import PageContainer from './PageContainer'


export default class TermsOfServicePage extends React.Component {
	constructor(props) {
	super(props);
	this.state = {
		// show_modal: false
		}
	}

	getComponent(){
		return (
			<div className = "container">
				<h2> Terms of Service </h2>
				<h5> Lorem Ipsum </h5>
			</div>
		)
	}


	render() {
	var component = this.getComponent()
		return (
			<PageContainer component = {component}/>
			);
		}
}