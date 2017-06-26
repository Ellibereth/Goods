

var React = require('react');
var ReactDOM = require('react-dom');

export default class MobileAccountMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	componentDidMount(){
		
	}




	render() {
		return (
				<li className="dropdown">
					<a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
						You <span className="caret"></span>
					</a>
					<ul className="dropdown-menu navbar-mobile-account-dropdown">
						<li><a href="/settings">Acccount <span className = "glyphicon glyphicon-user"/></a></li>
						<li><a href="/myOrders">Past Orders <span className = "glyphicon glyphicon-list-alt"/></a></li>
						<li><a href="/support">Support <span className = "glyphicon glyphicon-info-sign"/></a></li>
						<li><a href="/logout">Sign Out <span className = "glyphicon glyphicon-log-out"/></a></li>
					</ul>
				</li>
		);
	}
}