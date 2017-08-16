var React = require('react');
var ReactDOM = require('react-dom');
import TrimmedNavbar from '../Nav/TrimmedNavbar'
import Spinner from '../Misc/Spinner'
import AppStore from '../../stores/AppStore'


export default class PageContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
			width: '0', 
			height: '0' 
		}
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
	}


componentDidMount() {
  this.updateWindowDimensions();
  window.addEventListener('resize', this.updateWindowDimensions);
}

componentWillUnmount() {
  window.removeEventListener('resize', this.updateWindowDimensions);
}

updateWindowDimensions() {
  this.setState({ width: window.innerWidth, height: window.innerHeight });
}


	render() {
		var user = AppStore.getCurrentUser()
		var top_text = user ? "Opening special! Get 10% off for your first month!*" : "Register now and get 10% off!*"


		return (
				<div>
					{this.props.is_loading && <Spinner />}
					{this.state.width >= 600 &&
					<div className = "hidden-xs">
						<div className = "page-wrapper">
							<TrimmedNavbar />
							<div className = "content-wrapper"> 
								{!this.props.no_add_buffer && <div className = "content-buffer"/>}
								{this.props.children}
							</div>
						</div>
						<div className = "top-buffer"/>
						<div className = "top-buffer"/>
					</div>
					}
					{this.state.width < 600 && 
						<div style = {{"width" : "100%"}} className = "hidden-sm hidden-md hidden-lg">
							{this.props.children}
							<div className = "top-buffer"/>
						</div>
					}
				</div>
		);
	}
}