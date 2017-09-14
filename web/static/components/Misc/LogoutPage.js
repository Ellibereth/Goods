var React = require('react')
var ReactDOM = require('react-dom')
import AppStore from '../../stores/AppStore'
import AppActions from '../../actions/AppActions'
var browserHistory = require('react-router').browserHistory


export default class LogoutPage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
		}
	}


	componentWillMount(){
		AppActions.removeCurrentUser()
		window.location = '/'
	}

	render() {
		return (
			<div/>
		)
	}
}