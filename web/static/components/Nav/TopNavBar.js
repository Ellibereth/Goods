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
import SiteMap from './SiteMap'

const LARGE = 'large'
const SMALL = 'small'

export default class TopNavBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			small_navbar_visible : false,
			search_input : ""
		}
	}

	componentDidMount(){
		var change_height = 400; //number of pixels before modifying styles
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

		$(document).ready(function() {
      		$('.account-dropdown').on('mouseleave', function() {
				$(this).removeClass("open");
			});
		});
	}

	onSearchChange(event){
		this.setState({search_input : event.target.value})
	}

	getSearchBar(size){
		var current_user = AppStore.getCurrentUser()
		var search_bar_class = "navbar-form navbar-left edgar-search-bar"
		if (current_user == {} || !current_user) {
			search_bar_class = search_bar_class +  " no-user"
		}
		else {
			search_bar_class = search_bar_class + " with-user"
		}

		if (size == LARGE){
			search_bar_class = search_bar_class +  " nav-large"

		}

		else if (size == SMALL) {
			search_bar_class = search_bar_class +  " nav-small"
		}

		return (
				<form onSubmit = {this.searchProducts.bind(this)}
					  className = {search_bar_class}
					  role="search">
					<div className="input-group ">
						<input style = {{"height" : "34px"}} onChange = {this.onSearchChange.bind(this)} type="text" className="form-control" placeholder="Search" name="srch-term" id="srch-term"/>
						<div className="input-group-btn nav-search-icon">
							<button style = {{"height" : "34px"}} className="btn btn-default" type="submit"><i className="glyphicon glyphicon-search"></i></button>
						</div>
					</div>
				</form>
		)
	}

	searchProducts(event){
		window.location.href = '/search/' + this.state.search_input
		event.preventDefault()
	}


	

	render() {
		return (
			<div>
				<LargeNavBar getSearchBar = {this.getSearchBar.bind(this, LARGE)} visible = {!this.state.small_navbar_visible}/>
				<SmallNavBar getSearchBar = {this.getSearchBar.bind(this, SMALL)} visible = {this.state.small_navbar_visible}/>
				<SiteMap />
			</div>
		);
	}
}