var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;

import {Button, Row, Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';
var Link = require('react-router').Link;

import AppStore from '../../stores/AppStore.js';
import AppActions from '../../actions/AppActions.js';

export default class TopNavBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			current_user : null,
			search_input : ""
		}
	}

	componentDidMount(){
		this.setState({current_user : AppStore.getCurrentUser()})
	}

	onSearchBoxChange(event){
		this.setState({search_input: event.target.value})
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
				<Nav className = "main-nav-item" pullRight>
					<NavItem eventKey={1}>  <Link to="/login">Sign In</Link> </NavItem>
				</Nav>
			)
		}
		else {
			return (
				<Nav className = "main-nav-item nav-pills" pullRight>
					<NavDropdown title="Account" id="nav-dropdown">
						  <MenuItem> <Link to = "/settings"> <div className = "react-router-link"> Account Settings </div> </Link> </MenuItem>
						  <MenuItem> <Link to = "/myCart"> <div className = "react-router-link"> View Cart </div> </Link> </MenuItem>
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
			<Navbar className = "navbar-fixed-top top-nav-bar" bsStyle="pills" inverse>
				<Navbar.Header>
					<Navbar.Brand>
						<Link to = "/"> Edgar USA </Link>
					</Navbar.Brand>
					{/* <Navbar.Toggle />*/}
				</Navbar.Header>
				<Nav className = "nav-search-bar">
					<NavItem>
						<form className="navbar-form" role="search">
							<div className="input-group">
								<input type="text" onChange = {this.onSearchBoxChange.bind(this)} className="form-control" placeholder="Search" name="srch-term" id="srch-term"/>
								<div className="input-group-btn">
									<button className="btn btn-default" type="submit"><i className="glyphicon glyphicon-search"></i></button>
								</div>
							</div>
						</form>
					</NavItem>
				</Nav>
				{right_nav}
				
			</Navbar>
		);
	}
}