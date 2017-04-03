var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;

import { Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';
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
		var current_user = this.state.current_user
		if (current_user == {} || !current_user){
			return (
				<Nav pullRight>
					<NavItem eventKey={1}> <Link to="/login">Sign In</Link> </NavItem>
				</Nav>
			)
		}
		else {
			return (
				<Nav pullRight>
					<NavDropdown title="Settings" id="nav-dropdown">
						  <MenuItem href = "orders"> Order History </MenuItem>
						  <MenuItem divider />
						  <MenuItem href = "settings"> Change Settings </MenuItem>
					</NavDropdown>
					<NavItem eventKey={1} onClick = {this.handleLogout.bind(this)}> Logout </NavItem>
				</Nav>
				
			)
		}	
	}

	render() {
		var right_nav = this.getRightNav()
		return (
			<Navbar bsStyle="pills" inverse collapseOnSelect>
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