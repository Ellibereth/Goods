var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;

import { Navbar, Nav, NavItem} from 'react-bootstrap';
var Link = require('react-router').Link;

import AppStore from '../../stores/AppStore.js';
import AppActions from '../../actions/AppActions.js';

export default class TopNavBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			current_user : null
		}
	}

	handleChange(event) {
		this.props.onTextInputChange(this.props.key, event.value)
	}

	componentDidMount(){
		this.setState({current_user : AppStore.getCurrentUser()})
	}

	handleLogout(){
		this.setState({current_user : null})
		AppActions.removeCurrentUser()
		browserHistory.push('/')

	}

	getSignInButton() {
		var current_user = this.state.current_user
		if (current_user == null){
			<Nav pullRight>
				<NavItem eventKey={1}> <Link to="/register">Sign In</Link> </NavItem>
			</Nav>	
		}
		else {
			<Nav pullRight>
				<NavItem eventKey={1} onClick = {this.handleLogout.bind(this)}> Logout </NavItem>
			</Nav>
		}	
	}

	render() {
		var sign_in_button = this.getSignInButton()
		return (
			<Navbar inverse collapseOnSelect>
				<Navbar.Header>
					<Navbar.Brand>
						<a href="#">Edgar USA</a>
					</Navbar.Brand>
					<Navbar.Toggle />
				</Navbar.Header>
				<Navbar.Collapse>
					{sign_in_button}
				</Navbar.Collapse> 
			</Navbar>
		);
	}
}