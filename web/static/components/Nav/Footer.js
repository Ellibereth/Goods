var React = require('react');
var Link = require('react-router').Link;
export default class Footer extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			ready : false
		}
	}

	componentDidMount(){
		setTimeout( function() {
			this.setState({ready : true}) 
		}.bind(this), 2000);
	}

	render() {
		if (!this.state.ready) return <div/>
		return(	
				<div className="container">
					<footer className = "row edgarusa-footer">
					<ul className ="nav navbar-nav">
						<li><Link to="/">© 2017 Manaweb, Inc.</Link></li>
							<li><Link to="/">Home</Link></li>
							<li><Link to="/terms">Terms</Link></li>
							<li><Link to="/privacy">Privacy</Link></li>
						</ul>
					</footer>
				</div>
		);
	}
}