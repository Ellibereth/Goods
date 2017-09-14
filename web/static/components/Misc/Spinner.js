var React = require('react')
var ReactDOM = require('react-dom')


export default class Spinner extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
		}
	}

	render() {

		return (
			<div className = "loading"/>
		)
	}
}