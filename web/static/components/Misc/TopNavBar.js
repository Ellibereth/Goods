var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;

import {Button, Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';
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
		console.log("current user removed")
		browserHistory.push('/')

	}

	getRightNav() {
		if (this.props.no_login) {
			return <div/>
		}
		var current_user = this.state.current_user
		if (current_user == {} || !current_user){
			return (
				<Nav pullRight>
					<NavItem eventKey={1}>  <Link to="/login">Sign In</Link> </NavItem>
				</Nav>
			)
		}
		else {
			return (
				<Nav className = "nav-pills" pullRight>
					<NavDropdown title="Account" id="nav-dropdown">
						  <MenuItem href = "settings"> Account Settings </MenuItem>
						  <MenuItem divider />
						  <MenuItem eventKey={1} onClick = {this.handleLogout.bind(this)}> Logout </MenuItem>
					</NavDropdown>
				</Nav>
				
			)
		}	
	}

	render() {
		var right_nav = this.getRightNav()
		return (
			<Navbar className = "navbar-fixed-top top-nav-bar" bsStyle="pills" inverse collapseOnSelect>
				<Navbar.Header>
					<Navbar.Brand>
						<a href="/">Edgar USA</a>
					</Navbar.Brand>
					<Navbar.Toggle />
				</Navbar.Header>
				{right_nav}
				
			</Navbar>
		);
	}
}