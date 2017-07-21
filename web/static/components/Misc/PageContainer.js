var React = require('react');
var ReactDOM = require('react-dom');
import Footer from '../Nav/Footer'
import Navbar from '../Nav/Navbar'
import Spinner from '../Misc/Spinner'
import AppStore from '../../stores/AppStore'


export default class PageContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	componentDidMount(){
		
	}




	render() {
		var user = AppStore.getCurrentUser()
		var top_text = user ? "Opening special! Get 10% off for your first month!*" : "Register now and get 10% off!*"

		return (
				<div>
					{this.props.is_loading && <Spinner />}
					<div className = "page-top-row">
						<div className = "page-wrapper">
							<div className = "top-row-inner">
								<span className = "top-row-text">{top_text}</span>
								<span id = "top-contact-us" className = "top-row-text float-right" onClick = {() => window.location = "/support"}> 
									<span id = "top- email-glyph"className = "glyphicon glyphicon-envelope top-row-envelope-icon"/>
								 	<span>Contact Support</span>
								</span>
							</div>
						</div>
					</div>
					<div className = "page-wrapper">
						<Navbar />
						<div className = "content-wrapper"> 
							{!this.props.no_add_buffer && <div className = "content-buffer"/>}
							{this.props.children}
						</div>
					</div>
					<div className = "top-buffer"/>
					<Footer />
					<div className = "top-buffer"/>
				</div>
		);
	}
}