var React = require('react')
var ReactDOM = require('react-dom')
import Footer from '../Nav/Footer'
import Navbar from '../Nav/Navbar'
import Spinner from '../Misc/Spinner'
import AppStore from '../../stores/AppStore'
import MobileFooter from '../Nav/MobileFooter'


export default class PageContainer extends React.Component {
	constructor(props) {
		super(props)
		this.state = { 
			width: '0', 
			height: '0' 
		}
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
	}


	componentDidMount() {
		this.updateWindowDimensions()
		window.addEventListener('resize', this.updateWindowDimensions)
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateWindowDimensions)
	}

	updateWindowDimensions() {
		this.setState({ width: window.innerWidth, height: window.innerHeight })
	}


	render() {
		var user = AppStore.getCurrentUser()
		var top_text = user ? 'Opening special! Get 10% off for your first month!*' : 'Register now and get 10% off!*'

		return (
			<div>
				{this.props.is_loading && <Spinner />}
				{this.state.width >= 761 ?
					<div className = "hidden-xs">
						<div className = "page-top-row">
							<div className = "page-wrapper">
								<div className = "top-row-inner">
									<span className = "top-row-text">{top_text}</span>
									<span id = "top-contact-us" className = "top-row-text float-right" onClick = {() => window.location = '/support'}> 
										<span id = "top- email-glyph"className = "glyphicon glyphicon-envelope top-row-envelope-icon"/>
									 	<span>CONTACT SUPPORT</span>
									</span>
								</div>
							</div>
						</div>
						<div className = "container-fluid">
							<div className = "page-wrapper">
								<Navbar />
								<div className = "content-wrapper"> 
									{this.props.children}
								</div>
							</div>

							<div className = "top-buffer"/>
							<Footer />
							<div className = "top-buffer"/>
						</div>
					</div>
					: 
					<div style = {{'width' : '100%'}} className = "hidden-sm hidden-md hidden-lg">
						<Navbar/>
						{this.props.children}
						<div className = "top-buffer"/>
						<MobileFooter/>
					</div>
				}
			</div>
		)
	}
}