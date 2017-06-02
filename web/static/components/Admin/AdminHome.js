var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;
import AppActions from '../../actions/AppActions'
import PageContainer from '../Misc/PageContainer'
import AddHomeImage from './AddHomeImage'


export default class AdminLoginPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
	
		}
	}

	onTextInputChange(field, value) {
		var obj = {}
		obj[field] = value
		this.setState(obj)
	}


	componentDidMount() {
		
	}

	render() {
		return (
			<div> Home Page Tab..This is a WIP </div>
		);
	}
}