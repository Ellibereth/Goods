var React = require('react');
var ReactDOM = require('react-dom');

const fab_logo = "https://web.archive.org/web/20140713231906im_/http://dnok91peocsw3.cloudfront.net/relaunch/fab_2_0_logo.png"

export default class HomeNavBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}


	render() {

		return (
					<div className = "edgar-navbar">
						<div className = "container-fluid">
							<div className = "row">
								<div className = "col-sm-1 col-md-1 col-lg-1" id = "logo-column">
									<img src = {fab_logo}/>
								</div>
								<div className = "vcenter col-sm-offset-1 col-md-offset-1 col-lg-offset-1 col-sm-6 col-md-6 col-lg-6">
									<div className="input-group input-group-lg">
										<span className="input-group-addon" id="basic-addon1"><span className = "glyphicon glyphicon-search" /></span>
										<input type="text" className="form-control" placeholder="Search" aria-describedby="basic-addon1"/>
									</div>
								</div>
								<div id = "top-right-navigation" className = "col-md-2 col-lg-2 col-sm-2 home-right-nav pull-right">
									<div id="home-top-navigation" className = "float-right">
										<ul>
											<li><a href="/myCart"><span className = "glyphicon glyphicon-shopping-cart"/></a></li>
											<li><a href="/login" id = "home-login-text">Login</a></li>
										</ul>
									</div>
								</div>
							</div>
							<div className = "small-buffer"/>
							<div className = "row">
								<nav className = "home-sub-menu">
									<div id="home-sub-navigation">
										<ul>
											<li><a href="#">Shop By Department</a></li>
											<li><a href="#">New Arrivals</a></li>
											<li><a href="#">Featured Design Deals</a></li>
											<li><a href="#">Clearance</a></li>
										</ul>
									</div>
								</nav>
							</div>
						</div>
					</div>
		);
	}
}