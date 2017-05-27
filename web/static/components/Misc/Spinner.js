var React = require('react');
var ReactDOM = require('react-dom');
import {} from 'react-bootstrap';


export default class Spinner extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	render() {

		return (
			<div className = "loading"/>
		)
	}
}