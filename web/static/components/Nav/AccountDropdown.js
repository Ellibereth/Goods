var React = require('react');
var ReactDOM = require('react-dom');
var browserHistory = require('react-router').browserHistory;

export default class AccountDropdown extends React.Component {
	render() {
		var name_display = this.props.user ? this.props.user.name.split(" ")[0]  : "Account"
		return (
			<div className="hidden-xs float-right username-adjust edgar-color-gray-3 headerUserCt">
					  <span className="newUserName font14">
						<span className="userNameText avant-garde-std-bk" style = {{"paddingRight" : "6px", "color" :"black"}}>
							{name_display}
						</span>
					  </span>
					  <span className="fa fa-angle-down down-angle vertMiddle dIB" style = {{"color": "black"}}></span>
					  <ul className="newEdgarUserDD">
						<li className="newEdgarUserDDItem"><a className="newEdgarUserDDLink dIB" href="/settings/">My Account</a></li>
						<li className="arrow_box"></li>
						<li className="newEdgarUserDDItem"><a className="newEdgarUserDDLink dIB" href="/myOrders">My Cart</a></li>
						<li className="newEdgarUserDDItem"><a className="newEdgarUserDDLink dIB" href="/myOrders">My Orders</a></li>
						<li className="newEdgarUserDDItem"><a className="newEdgarUserDDLink dIB" href="/logout">Logout</a></li>
						
					</ul>
			</div>
			
		)
	}
}

