var React = require('react');
var Link = require('react-router').Link;
export default class Footer extends React.Component {
	render() {
		return(
			<div className="hidden-sm hidden-xs navbar navbar-default navbar-fixed-bottom">
				<div className="container">
					<div className="row">
						<ul className ="nav navbar-nav">
							<li><Link to="/">© 2017 Manaweb, Inc.</Link></li>
					    	<li><Link to="/">Home</Link></li>
					    	<li><Link to="/">About</Link></li>
					    	<li><Link to="/">Terms</Link></li>
					    	<li><Link to="/">Privacy</Link></li>
					    	<li><Link to="/">Cookies</Link></li>
					    	<li><Link to="/">Status</Link></li>
					    	<li><Link to="/">Help</Link></li>
					    </ul>
					</div>
				</div>
			</div>
		);
	}
}