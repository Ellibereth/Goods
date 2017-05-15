var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;

// import {Button, Row, Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';
var Link = require('react-router').Link;
import styles from './navbar.css'

import AppStore from '../../stores/AppStore.js';
import AppActions from '../../actions/AppActions.js';
import LargeNavBar from './LargeNavBar'
import SmallNavBar from './SmallNavBar'

export default class TopNavBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			small_navbar_visible : false
		}
	}

	componentDidMount(){
		var change_height = 80; //number of pixels before modifying styles
		var small_nav_height = 50; // bootstrap default nav height, currently using this for small nav
		$(window).bind('scroll', function () {
			if (this.state.current_nav){
				var threshold = change_height + small_nav_height
			}
			else {
				var threshold = change_height
			}
		    if ($(window).scrollTop() < threshold) {
		        this.setState({
		        	small_navbar_visible : false
		        })


		    } else {
		        this.setState({
		        	small_navbar_visible : true
		        })
		    }
		}.bind(this));
	}

	

	render() {
		return (
			<div>
				<LargeNavBar visible = {!this.state.small_navbar_visible}/>
				<SmallNavBar visible = {this.state.small_navbar_visible}/>
			</div>
		);
	}
}