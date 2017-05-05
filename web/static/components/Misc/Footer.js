var React = require('react');
var Link = require('react-router').Link;
export default class Footer extends React.Component {
	render() {
		return(
			<footer className = "footer">
				<div className="container">
					<div className="row">
						<ul className ="nav navbar-nav">
							<li><Link to="/">© 2017 Manaweb, Inc.</Link></li>
					    	<li><Link to="/">Home</Link></li>
					    	<li><Link to="/terms">Terms</Link></li>
					    	<li><Link to="/privacy">Privacy</Link></li>
					    </ul>
					</div>
				</div>
			</footer>
		);
	}
}