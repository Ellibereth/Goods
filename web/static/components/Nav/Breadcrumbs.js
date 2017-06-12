var React = require('react');
var ReactDOM = require('react-dom');

var Link = require('react-router').Link

import AppStore from '../../stores/AppStore'


export default class Breadcrumbs extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		
		}
	}

	componentDidMount(){

	}

	render(){
		var labels = this.props.labels
		var routes = this.props.routes
		var links = []
		for (var i  = 0; i < routes.length; i++){
			if (i == routes.length - 1){
				links.push(
					<li className="active"> {labels[i]} </li>
				)
			}
			else {
				links.push(
					<li> 
						<a href = {"/" + routes[i]}> {labels[i]} </a>
					</li>
				)
			}
		}	


		return (
			<div>
				{AppStore.getCurrentUser() && <div style = {{"padding-top" : "25px"}}/>}
				<ul className="breadcrumb">
					{links}
				</ul>
			</div>
		)
	}
}

