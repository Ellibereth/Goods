var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;
var Link = require('react-router').Link;

import AppStore from '../../stores/AppStore.js';
import AppActions from '../../actions/AppActions.js';

export default class BottomNavBar extends React.Component {
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

	

	render() {

		return (
			<div className="navbar navbar-inverse bottom-navbar" role="navigation">	
				<div className = "container-fluid">
					<div className="collapse navbar-collapse">
						<div className = "nav navbar-right">
							<form className="navbar-form" role="search">
								<div className="input-group nav-search-bar">
									<input type="text" className="form-control" placeholder="Search" name="srch-term" id="srch-term"/>
									<div className="input-group-btn">
										<button className="btn btn-default" type="submit"><i className="glyphicon glyphicon-search"></i></button>
									</div>
								</div>
							</form>
						</div>
					</div>
						
				</div>
			</div>

		);
	}
}