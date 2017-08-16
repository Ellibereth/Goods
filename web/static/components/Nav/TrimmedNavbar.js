var React = require('react');
var ReactDOM = require('react-dom');
import NavbarSearch from './NavbarSearch'
import MobileNavBar from './MobileNavBar'
import AppStore from '../../stores/AppStore'
const edgar_logos = ["https://s3-us-west-2.amazonaws.com/edgarusahomepage/linda3.png"]

export default class TrimmedNavbar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cart_badge : 0,
		}
	}

	componentDidMount(){
		
	}


	render() {
		var rand_logo = edgar_logos[Math.floor(Math.random() * edgar_logos.length)];

		return (
				<div>
					<div className = "edgar-navbar hidden-xs">
						<div className = "container-fluid">
							<div className = "row">
								<div className = "col-xs-2 col-sm-1 col-md-1 col-lg-1" id = "logo-column">
									<a href = "/">
										<img className = "edgar-logo" src = {rand_logo}/>
									</a>
								</div>
							</div>
								
							<div className = "small-buffer"/>
							<div className = "row">
								<nav className = "home-sub-menu">
									<div id="home-sub-navigation">
										<ul>
											<li><a href="/">Home</a></li>
										</ul>
									</div>
								</nav>
							</div>
						</div>
					</div>
				</div>
		);
	}
}